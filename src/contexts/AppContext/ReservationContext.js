import React from "react";

import ReservationRequest from "../../services/ReservationServices";


const ReservationContext = React.createContext({

    reservations: {},
    reservationIds: [],
    isLoading: false,
    error: "",

    getReservations: ()=>{},
    getReservationById: ()=>{},
    createReservation: ()=>{},
    updateReservation: ()=>{},
    cancelReservation: ()=>{},
    setReservation: ()=>{},
    cancelReservationAndRefund: ()=>{},
});


export default ReservationContext;


export class ReservationContextProvider extends React.Component{

    state = {

        reservations: {},
        reservationIds: [],
        isLoading: false,
        error: ""

    };


    normalizeReservations = (reservations)=>{

        const normalizedReservations = {};
        const reservationIds = [];


        reservations.forEach( reservation => {

            normalizedReservations[reservation.id] = reservation;

            reservationIds.push(
                reservation.id
            );

        });


        return {

            reservations: normalizedReservations,
            reservationIds

        };

    };


    getReservations = ()=>{

        this.setState({

            isLoading: true,
            error: ""

        });


        return ReservationRequest.getAllReservations()
            .then( response => {

                const normalizedData =
                    this.normalizeReservations(
                        response.reservations
                    );


                this.setState({

                    reservations:
                        normalizedData.reservations,

                    reservationIds:
                        normalizedData.reservationIds,

                    isLoading: false,

                    error: ""

                });


                return response.reservations;

            })
            .catch( error => {

                this.setState({

                    isLoading: false,

                    error:
                        error.error ||
                        "Unable to load reservations"

                });


                return Promise.reject(error);

            });

    };


    getReservationById = (id)=>{

        const reservation =
            this.state.reservations[id];


        if(reservation){

            return Promise.resolve(
                reservation
            );

        };


        return ReservationRequest.getReservationById(id)
            .then( response => {

                this.setReservation(
                    response.reservation
                );


                return response.reservation;

            });

    };


    setReservation = (reservation)=>{

        this.setState( previousState => {

            const reservationExists =
                !!previousState.reservations[reservation.id];


            const reservations = {

                ...previousState.reservations,

                [reservation.id]: reservation

            };


            const reservationIds =
                reservationExists
                    ? previousState.reservationIds
                    : [
                        reservation.id,
                        ...previousState.reservationIds
                    ];


            return {

                reservations,
                reservationIds

            };

        });

    };


    createReservation = (newReservation)=>{

        return ReservationRequest.createReservation(
            newReservation
        )
            .then( response => {

                this.setReservation(
                    response.reservation
                );


                return response.reservation;

            });

    };


    updateReservation = (
        id,
        updatedReservation
    )=>{

        return ReservationRequest.updateReservation(
            id,
            updatedReservation
        )
            .then( response => {

                this.setReservation(
                    response.reservation
                );


                return response.reservation;

            });

    };


    cancelReservation = (
        id,
        cancellation_reason
    )=>{

        return ReservationRequest.cancelReservation(
            id,
            cancellation_reason
        )
            .then( response => {

                this.setReservation(
                    response.reservation
                );


                return response.reservation;

            });

    };
    
    cancelReservationAndRefund = (
        id,
        cancellation_reason
    )=>{

        return ReservationRequest
            .cancelReservationAndRefund(
                id,
                cancellation_reason
            )
            .then(response => {

                this.setReservation(
                    response.reservation
                );

                return response;

            });

    };

    render(){
        const value = {
            reservations:
                this.state.reservations,
            reservationIds:
                this.state.reservationIds,
            isLoading:
                this.state.isLoading,
            error:
                this.state.error,
            getReservations:
                this.getReservations,
            getReservationById:
                this.getReservationById,
            setReservation:
                this.setReservation,
            createReservation:
                this.createReservation,
            updateReservation:
                this.updateReservation,
            cancelReservation:
                this.cancelReservation,
            cancelReservationAndRefund:
                this.cancelReservationAndRefund

        };

        return (

            <ReservationContext.Provider value={value}>

                {this.props.children}

            </ReservationContext.Provider>

        );

    };

};