const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const ReservationRequest = {

    handleResponse(res){

        if(!res.ok){

            return res.json()
                .then( e => Promise.reject(e));

        };


        return res.json();

    },


    getAllReservations(){

        return fetch(
            `${url}/api/reservations`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationById(id){

        return fetch(
            `${url}/api/reservations/${id}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationByConfirmationCode(confirmationCode){

        return fetch(
            `${url}/api/reservations/confirmation/${confirmationCode}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationsByPropertyId(propertyId){

        return fetch(
            `${url}/api/reservations/property/${propertyId}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationsByGuestId(guestId){

        return fetch(
            `${url}/api/reservations/guest/${guestId}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationsByStatus(status){

        return fetch(
            `${url}/api/reservations/status/${status}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getReservationsBetweenDates(
        propertyId,
        checkIn,
        checkOut
    ){

        const params = new URLSearchParams({
            check_in: checkIn,
            check_out: checkOut
        });


        return fetch(
            `${url}/api/reservations/property/${propertyId}/dates?${params.toString()}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    createReservation(newReservation){

        return fetch(
            `${url}/api/reservations`,
            {
                method: "POST",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`,
                    "content-type": "application/json"
                },

                body: JSON.stringify(
                    newReservation
                )
            }
        )
            .then(this.handleResponse);

    },


    updateReservation(
        id,
        updatedReservation
    ){

        return fetch(
            `${url}/api/reservations/${id}`,
            {
                method: "PATCH",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`,
                    "content-type": "application/json"
                },

                body: JSON.stringify(
                    updatedReservation
                )
            }
        )
            .then(this.handleResponse);

    },


    cancelReservation(
        id,
        cancellation_reason
    ){

        return fetch(
            `${url}/api/reservations/${id}/cancel`,
            {
                method: "POST",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`,
                    "content-type": "application/json"
                },

                body: JSON.stringify({
                    cancellation_reason
                })
            }
        )
            .then(this.handleResponse);

    },
    cancelReservationAndRefund(
        id,
        cancellation_reason
    ){

        return fetch(
            `${url}/api/reservations/${id}/cancel-and-refund`,
            {
                method: "POST",

                headers: {
                    "authorization":
                        `Bearer ${AdminTokenService.getToken()}`,

                    "content-type":
                        "application/json"
                },

                body: JSON.stringify({
                    cancellation_reason
                })
            }
        )
            .then(res => {

                return res.json()
                    .then(response => {

                        if(!res.ok){

                            return Promise.reject(
                                response
                            );

                        };

                        return response;

                    });

            });

    }
};


module.exports = ReservationRequest;