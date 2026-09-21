
const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const ReservationRequest = {

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
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    }

};


module.exports = ReservationRequest;