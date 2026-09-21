
const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const PropertyAvailabilityRequest = {

    getAvailabilityBetweenDates(
        propertyId,
        startDate,
        endDate
    ){

        return fetch(
            `${url}/api/property-availability/property/${propertyId}/between/${startDate}/${endDate}`
        )
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    createAvailability(
        propertyId,
        newAvailability
    ){

        return fetch(
            `${url}/api/property-availability/property/${propertyId}`,
            {
                method: "POST",

                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                },

                body: JSON.stringify(newAvailability)
            }
        )
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    updateAvailabilityByDate(
        propertyId,
        date,
        updatedAvailability
    ){

        return fetch(
            `${url}/api/property-availability/property/${propertyId}/date/${date}`,
            {
                method: "PATCH",

                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                },

                body: JSON.stringify(updatedAvailability)
            }
        )
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    deleteAvailabilityByDate(
        propertyId,
        date
    ){

        return fetch(
            `${url}/api/property-availability/property/${propertyId}/date/${date}`,
            {
                method: "DELETE",

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


module.exports = PropertyAvailabilityRequest;