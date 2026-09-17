const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const PropertyAmenityRequest = {

    getAmenitiesByPropertyId(propertyId){

        return fetch(
            `${url}/api/property-amenities/property/${propertyId}`
        )
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    getPropertyAmenity(
        propertyId,
        amenityId
    ){

        return fetch(
            `${url}/api/property-amenities/property/${propertyId}/amenity/${amenityId}`
        )
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    addAmenityToProperty(
        propertyId,
        amenityId
    ){

        return fetch(
            `${url}/api/property-amenities/property/${propertyId}`,
            {
                method: "POST",

                headers: {
                    "content-type": "application/json",
                    "authorization":
                        `Bearer ${AdminTokenService.getToken()}`
                },

                body: JSON.stringify({
                    amenity_id: amenityId
                })
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


    removeAmenityFromProperty(
        propertyId,
        amenityId
    ){

        return fetch(
            `${url}/api/property-amenities/property/${propertyId}/amenity/${amenityId}`,
            {
                method: "DELETE",

                headers: {
                    "authorization":
                        `Bearer ${AdminTokenService.getToken()}`
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


module.exports = PropertyAmenityRequest;