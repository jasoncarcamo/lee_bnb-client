import React from "react";

import PropertyAvailabilityRequest from "../../services/PropertyAvailabilityRequest";
import ReservationRequest from "../../services/ReservationServices";


export const PropertyAvailabilityContext = React.createContext({

    monthsByKey: {},

    loadMonth: () => Promise.resolve(null),
    loadRange: ()=>{},
    blockDate: () => Promise.reject(
        new Error("Provider missing")
    ),
    unblockDate: () => Promise.reject(
        new Error("Provider missing")
    ),
    invalidateMonth: () => {},
    invalidateProperty: () => {}

});

export default PropertyAvailabilityContext;

export class PropertyAvailabilityProvider extends React.Component {

    state = {
        monthsByKey: {}
    };


    pending = {};

    versions = {};

    mounted = false;


    componentDidMount(){

        this.mounted = true;

    };


    componentWillUnmount(){

        this.mounted = false;

    };


    key = (propertyId, year, month)=>{

        return JSON.stringify([
            propertyId,
            year,
            month
        ]);

    };


    formatDate = (year, month, day)=>{

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    getReservedDates = (reservations, startDate, endDate)=>{

        const dates = {};


        reservations.forEach(reservation => {

            if(
                reservation.status !== "pending" &&
                reservation.status !== "confirmed"
            ){

                return;

            };


            const checkIn = reservation.check_in.slice(0, 10);

            const checkOut = reservation.check_out.slice(0, 10);

            const day = new Date(
                `${checkIn}T12:00:00`
            );


            while(
                this.formatDate(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate()
                ) < checkOut
            ){

                const date = this.formatDate(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate()
                );


                if(
                    date >= startDate &&
                    date <= endDate
                ){

                    dates[date] = true;

                };


                day.setDate(
                    day.getDate() + 1
                );

            };

        });


        return dates;

    };


    loadMonth = (propertyId, year, month)=>{

        if(!propertyId){

            return Promise.reject(
                new Error("A property must be selected.")
            );

        };


        const key = this.key(
            propertyId,
            year,
            month
        );


        const cached = this.state.monthsByKey[key];


        if(
            cached &&
            cached.status === "ready"
        ){

            return Promise.resolve(cached);

        };


        if(this.pending[key]){

            return this.pending[key];

        };


        const version = this.versions[key] || 0;


        const startDate = this.formatDate(
            year,
            month,
            1
        );


        const endDate = this.formatDate(
            year,
            month,
            new Date(
                year,
                month + 1,
                0
            ).getDate()
        );


        const next = new Date(
            year,
            month + 1,
            1
        );


        const nextMonthStart = this.formatDate(
            next.getFullYear(),
            next.getMonth(),
            1
        );


        this.setState(previous => ({

            monthsByKey: {

                ...previous.monthsByKey,

                [key]: {

                    ...previous.monthsByKey[key],

                    status: "loading",

                    error: ""

                }

            }

        }));


        const request = Promise.all([

            PropertyAvailabilityRequest
                .getAvailabilityBetweenDates(
                    propertyId,
                    startDate,
                    endDate
                ),

            ReservationRequest
                .getReservationsBetweenDates(
                    propertyId,
                    startDate,
                    nextMonthStart
                )

        ])
            .then(([availabilityResponse, reservationResponse]) => {

                const availabilityByDate = {};


                availabilityResponse.availability.forEach(item => {

                    availabilityByDate[
                        item.date.slice(0, 10)
                    ] = item;

                });


                const data = {

                    status: "ready",

                    error: "",

                    availabilityByDate,

                    reservedDates: this.getReservedDates(
                        reservationResponse.reservations,
                        startDate,
                        endDate
                    )

                };


                if(
                    this.mounted &&
                    (this.versions[key] || 0) === version
                ){

                    this.setState(previous => ({

                        monthsByKey: {

                            ...previous.monthsByKey,

                            [key]: data

                        }

                    }));

                };


                return data;

            })
            .catch(error => {

                if(
                    this.mounted &&
                    (this.versions[key] || 0) === version
                ){

                    this.setState(previous => ({

                        monthsByKey: {

                            ...previous.monthsByKey,

                            [key]: {

                                status: "error",

                                error:
                                    error.error ||
                                    error.message ||
                                    "Unable to load availability.",

                                availabilityByDate: {},

                                reservedDates: {}

                            }

                        }

                    }));

                };


                throw error;

            })
            .finally(() => {

                if(this.pending[key] === request){

                    delete this.pending[key];

                };

            });


        this.pending[key] = request;


        return request;

    };

    loadRange = (propertyId, checkIn, checkOut) => {

        if(
            !propertyId ||
            !checkIn ||
            !checkOut ||
            checkOut <= checkIn
        ){

            return Promise.reject(
                new Error("A valid stay range is required.")
            );

        };


        const requests = [];


        const cursor = new Date(
            `${checkIn.slice(0, 7)}-01T12:00:00`
        );


        const lastNight = new Date(
            `${checkOut}T12:00:00`
        );


        // Checkout itself is not an occupied night.
        lastNight.setDate(
            lastNight.getDate() - 1
        );


        while(cursor <= lastNight){

            requests.push(

                this.loadMonth(
                    propertyId,
                    cursor.getFullYear(),
                    cursor.getMonth()
                )

            );


            cursor.setMonth(
                cursor.getMonth() + 1
            );

        };


        return Promise.all(requests);

    };

    updateDate = (
        propertyId,
        date,
        blocked,
        existingAvailability
    )=>{

        const [year, month] = date
            .split("-")
            .map(Number);


        const key = this.key(
            propertyId,
            year,
            month - 1
        );


        const request = blocked

            ? PropertyAvailabilityRequest
                .deleteAvailabilityByDate(
                    propertyId,
                    date
                )

            : existingAvailability

                ? PropertyAvailabilityRequest
                    .updateAvailabilityByDate(
                        propertyId,
                        date,
                        {
                            is_available: false
                        }
                    )

                : PropertyAvailabilityRequest
                    .createAvailability(
                        propertyId,
                        {
                            date,
                            is_available: false
                        }
                    );


        return request.then(response => {

            if(this.mounted){

                this.setState(previous => {

                    const current =
                        previous.monthsByKey[key];


                    if(
                        !current ||
                        current.status !== "ready"
                    ){

                        return null;

                    };


                    const availabilityByDate = {

                        ...current.availabilityByDate

                    };


                    if(blocked){

                        delete availabilityByDate[date];

                    }else{

                        availabilityByDate[date] = {

                            ...existingAvailability,

                            ...response.availability,

                            date,

                            is_available: false

                        };

                    };


                    return {

                        monthsByKey: {

                            ...previous.monthsByKey,

                            [key]: {

                                ...current,

                                availabilityByDate

                            }

                        }

                    };

                });

            };


            return response;

        });

    };


    blockDate = (
        propertyId,
        date,
        existingAvailability
    )=>{

        return this.updateDate(
            propertyId,
            date,
            false,
            existingAvailability
        );

    };


    unblockDate = (propertyId, date)=>{

        return this.updateDate(
            propertyId,
            date,
            true,
            null
        );

    };


    invalidateMonth = (propertyId, year, month)=>{

        const key = this.key(
            propertyId,
            year,
            month
        );


        this.versions[key] =
            (this.versions[key] || 0) + 1;


        delete this.pending[key];


        this.setState(previous => {

            const monthsByKey = {

                ...previous.monthsByKey

            };


            delete monthsByKey[key];


            return {
                monthsByKey
            };

        });

    };


    invalidateProperty = propertyId => {

        Object.keys(
            this.state.monthsByKey
        ).forEach(key => {

            const [
                cachedPropertyId,
                year,
                month
            ] = JSON.parse(key);


            if(cachedPropertyId === propertyId){

                this.invalidateMonth(
                    propertyId,
                    year,
                    month
                );

            };

        });

    };


    render(){

        return (

            <PropertyAvailabilityContext.Provider

                value={{

                    monthsByKey:
                        this.state.monthsByKey,

                    loadMonth:
                        this.loadMonth,
                        loadRange: this.loadRange,
                    blockDate:
                        this.blockDate,
                    unblockDate:
                        this.unblockDate,
                    invalidateMonth:
                        this.invalidateMonth,
                    invalidateProperty:
                        this.invalidateProperty

                }}

            >

                {this.props.children}

            </PropertyAvailabilityContext.Provider>

        );

    };

}