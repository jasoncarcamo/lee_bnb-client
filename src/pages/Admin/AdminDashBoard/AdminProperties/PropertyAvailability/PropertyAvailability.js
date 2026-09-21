
import React from "react";

import PropertyAvailabilityRequest from "../../../../../services/PropertyAvailabilityRequest";
import ReservationRequest from "../../../../../services/ReservationServices";

import "./PropertyAvailability.css";


export default class PropertyAvailability extends React.Component{

    state = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        availabilityByDate: {},
        reservedDates: {},
        isLoading: false,
        savingDate: "",
        error: "",
        success: ""
    };


    monthCache = {};

    requestId = 0;

    componentIsMounted = false;


    componentDidMount(){

        this.componentIsMounted = true;

        if(!this.isCreateMode()){

            this.loadMonth();

        };

    };


    componentDidUpdate(previousProps){

        if(
            previousProps.propertyId !== this.props.propertyId ||
            previousProps.mode !== this.props.mode
        ){

            this.monthCache = {};

            if(!this.isCreateMode()){

                this.loadMonth();

            };

        };

    };


    componentWillUnmount(){

        this.componentIsMounted = false;

        this.requestId += 1;

    };
    
    isCreateMode = ()=>{

        return this.props.mode === "create";

    };
    
    isPastDate = (date)=>{

        const today = new Date();

        const todayString = this.formatDate(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


        return date < todayString;

    };


    formatDate = (year, month, day)=>{

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    getMonthRange = ()=>{

        const {
            year,
            month
        } = this.state;


        const lastDay = new Date(
            year,
            month + 1,
            0
        ).getDate();


        return {
            startDate: this.formatDate(year, month, 1),

            endDate: this.formatDate(
                year,
                month,
                lastDay
            ),

            nextMonthStart: this.formatDate(
                new Date(year, month + 1, 1).getFullYear(),
                new Date(year, month + 1, 1).getMonth(),
                1
            )
        };

    };


    getCacheKey = ()=>{

        return [
            this.props.propertyId,
            this.state.year,
            this.state.month
        ].join(":");

    };


    getReservedDates = (
        reservations,
        startDate,
        endDate
    )=>{

        const reservedDates = {};


        reservations.forEach( reservation => {

            if(
                reservation.status !== "pending" &&
                reservation.status !== "confirmed"
            ){

                return;

            };


            const checkIn = reservation.check_in.slice(0, 10);

            const checkOut = reservation.check_out.slice(0, 10);


            const date = new Date(
                `${checkIn}T12:00:00`
            );


            while(
                this.formatDate(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ) < checkOut
            ){

                const dateString = this.formatDate(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );


                if(
                    dateString >= startDate &&
                    dateString <= endDate
                ){

                    reservedDates[dateString] = true;

                };


                date.setDate(
                    date.getDate() + 1
                );

            };

        });


        return reservedDates;

    };


    loadMonth = ()=>{

        const propertyId = this.props.propertyId;

        const requestId = ++this.requestId;

        const cacheKey = this.getCacheKey();


        if(!propertyId){

            this.setState({
                isLoading: false,
                error: "A property must be selected."
            });

            return;

        };


        const cachedMonth = this.monthCache[cacheKey];


        if(cachedMonth){

            this.setState({
                ...cachedMonth,
                isLoading: false,
                savingDate: "",
                error: "",
                success: ""
            });

            return;

        };


        const {
            startDate,
            endDate,
            nextMonthStart
        } = this.getMonthRange();


        this.setState({
            isLoading: true,
            availabilityByDate: {},
            reservedDates: {},
            savingDate: "",
            error: "",
            success: ""
        });


        Promise.all([
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
            .then( responses => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId
                ){

                    return;

                };


                const availabilityResponse = responses[0];

                const reservationResponse = responses[1];


                const availabilityByDate = {};


                availabilityResponse.availability.forEach(
                    availability => {

                        const date = availability.date.slice(0, 10);

                        availabilityByDate[date] = availability;

                    }
                );


                const reservedDates = this.getReservedDates(
                    reservationResponse.reservations,
                    startDate,
                    endDate
                );


                const monthData = {
                    availabilityByDate,
                    reservedDates
                };


                this.monthCache[cacheKey] = monthData;


                this.setState({
                    ...monthData,
                    isLoading: false,
                    error: ""
                });

            })
            .catch( error => {

                if(
                    !this.isMounted ||
                    requestId !== this.requestId
                ){

                    return;

                };


                this.setState({
                    isLoading: false,
                    error:
                        error.error ||
                        "Unable to load availability."
                });

            });

    };


    changeMonth = (offset)=>{

        if(
            this.state.isLoading ||
            this.state.savingDate
        ){

            return;

        };


        const nextMonth = new Date(
            this.state.year,
            this.state.month + offset,
            1
        );


        this.setState({
            year: nextMonth.getFullYear(),
            month: nextMonth.getMonth()
        }, ()=>{

            if(!this.isCreateMode()){

                this.loadMonth();

            };

        });

    };


    handleDateClick = (date)=>{

        if(
            this.state.isLoading ||
            this.state.savingDate ||
            this.state.reservedDates[date] ||
            this.isPastDate(date)
        ){

            return;

        };
        
        if(this.isCreateMode()){

            const blockedDates =
                this.props.blockedDates || [];


            const nextBlockedDates =
                blockedDates.includes(date)
                    ? blockedDates.filter(
                        blockedDate => blockedDate !== date
                    )
                    : [
                        ...blockedDates,
                        date
                    ];


            if(this.props.onBlockedDatesChange){

                this.props.onBlockedDatesChange(
                    nextBlockedDates
                );

            };


            return;

        };


        const existingAvailability =
            this.state.availabilityByDate[date];


        const isBlocked =
            existingAvailability &&
            existingAvailability.is_available === false;


        const propertyId = this.props.propertyId;

        const cacheKey = this.getCacheKey();


        const request = isBlocked
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
                    
        


        this.setState({
            savingDate: date,
            error: "",
            success: ""
        });


        request
            .then( response => {

                if(
                    !this.componentIsMounted ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                this.setState( previousState => {

                    const availabilityByDate = {
                        ...previousState.availabilityByDate
                    };


                    if(isBlocked){

                        delete availabilityByDate[date];

                    }else{

                        availabilityByDate[date] = {
                            ...existingAvailability,
                            ...response.availability,
                            date,
                            is_available: false
                        };

                    };


                    this.monthCache[cacheKey] = {
                        availabilityByDate,
                        reservedDates:
                            previousState.reservedDates
                    };


                    return {
                        availabilityByDate,
                        savingDate: "",
                        error: "",
                        success: isBlocked
                            ? `${date} is available by default.`
                            : `${date} was blocked.`
                    };

                });

            })
            .catch( error => {

                if(
                    !this.componentIsMounted ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                this.setState({
                    savingDate: "",
                    error:
                        error.error ||
                        error.message ||
                        "Unable to update availability.",
                    success: ""
                });

            });

    };


    renderDays(){

        const {
            year,
            month,
            availabilityByDate,
            reservedDates,
            savingDate
        } = this.state;


        const firstWeekday = new Date(
            year,
            month,
            1
        ).getDay();


        const numberOfDays = new Date(
            year,
            month + 1,
            0
        ).getDate();


        const cells = [];


        for(let index = 0; index < firstWeekday; index++){

            cells.push(
                <span
                    key={`empty-${index}`}
                    className="property-availability__empty"
                    aria-hidden="true"
                />
            );

        };


        for(let day = 1; day <= numberOfDays; day++){

            const date = this.formatDate(
                year,
                month,
                day
            );


            const availability = this.isCreateMode()
                ? (
                    (this.props.blockedDates || []).includes(date)
                        ? {
                            date,
                            is_available: false
                        }
                        : null
                )
                : availabilityByDate[date];


            const isReserved =
                reservedDates[date] === true;
                
            const isPast = this.isPastDate(date);


            const isBlocked =
                !isReserved &&
                availability &&
                availability.is_available === false;


            const status = isReserved
                ? "Reserved"
                : isBlocked
                    ? "Blocked"
                    : "Available";


            const isSaving =
                savingDate === date;


            cells.push(
                <button
                    key={date}
                    type="button"
                    className={
                        `property-availability__day ` +
                        `property-availability__day--${status.toLowerCase()}`
                    }
                    onClick={
                        ()=>this.handleDateClick(date)
                    }
                    disabled={
                        isReserved ||
                        !!savingDate ||
                        this.state.isLoading
                    }
                    data-past={isPast}
                    aria-label={
                        `${date}: ${status}` +
                        (
                            isPast
                                ? ". Past date."
                                : isReserved
                                    ? ""
                                    : isBlocked
                                        ? ". Click to unblock."
                                        : ". Click to block."
                        )
                    }
                    title={
                        isReserved
                            ? "Reserved"
                            : isBlocked
                                ? "Unblock date"
                                : "Block date"
                    }
                >
                    <strong>
                        {day}
                    </strong>

                    <span>
                        {
                            isSaving
                                ? "Saving..."
                                : status
                        }
                    </span>
                </button>
            );

        };


        return cells;

    };


    render(){

        const {
            year,
            month,
            isLoading,
            savingDate,
            error,
            success
        } = this.state;


        const monthLabel = new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(
            new Date(year, month, 1)
        );


        return (
            <section
                className="property-availability"
                aria-label="Property availability"
            >

                <header className="property-availability__header">

                    <div>

                        <h4>
                            Availability
                        </h4>

                        <p>
                        {
                            this.isCreateMode()
                                ? "Select dates to block before creating the property. Your selections will be saved when you click Create Property."
                                : "Select an available date to block it. Select a blocked date to unblock it. Reserved nights cannot be changed here."
                        }
                    </p>

                    </div>

                </header>


                <div className="property-availability__navigation">

                    <button
                        type="button"
                        onClick={
                            ()=>this.changeMonth(-1)
                        }
                        disabled={
                            isLoading ||
                            !!savingDate
                        }
                        aria-label="Previous month"
                    >
                        ‹
                    </button>


                    <h5 aria-live="polite">
                        {monthLabel}
                    </h5>


                    <button
                        type="button"
                        onClick={
                            ()=>this.changeMonth(1)
                        }
                        disabled={
                            isLoading ||
                            !!savingDate
                        }
                        aria-label="Next month"
                    >
                        ›
                    </button>

                </div>


                <div className="property-availability__legend">

                    <span>
                        <i className="property-availability__key property-availability__key--available" />
                        Available
                    </span>

                    <span>
                        <i className="property-availability__key property-availability__key--blocked" />
                        Blocked
                    </span>

                    <span>
                        <i className="property-availability__key property-availability__key--reserved" />
                        Reserved
                    </span>

                </div>


                {
                    error &&
                    <p
                        className="property-availability__error"
                        role="alert"
                    >
                        {error}
                    </p>
                }


                {
                    success &&
                    <p
                        className="property-availability__success"
                        role="status"
                    >
                        {success}
                    </p>
                }


                {
                    isLoading
                        ? (
                            <p
                                className="property-availability__loading"
                                role="status"
                            >
                                Loading availability...
                            </p>
                        )
                        : (
                            <>

                                <div className="property-availability__weekdays">

                                    {
                                        [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ].map( weekday => {

                                            return (
                                                <span key={weekday}>
                                                    {weekday}
                                                </span>
                                            );

                                        })
                                    }

                                </div>


                                <div className="property-availability__calendar">

                                    {this.renderDays()}

                                </div>

                            </>
                        )
                }


                <p className="property-availability__note">
                    Reservation checkout dates are not
                    counted as occupied nights.
                </p>

            </section>
        );

    };

};