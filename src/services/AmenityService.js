const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const AmenityRequest = {

    getAllAmenities(){

        return fetch(`${url}/api/amenities`)
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    getAmenityById(id){

        return fetch(`${url}/api/amenities/${id}`)
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    createAmenity(newAmenity){

        return fetch(`${url}/api/amenities`, {
            method: "POST",

            headers: {
                "content-type": "application/json",
                "authorization":
                    `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(newAmenity)
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    updateAmenity(id, updatedAmenity){

        return fetch(`${url}/api/amenities/${id}`, {
            method: "PATCH",

            headers: {
                "content-type": "application/json",
                "authorization":
                    `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(updatedAmenity)
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    },


    deleteAmenity(id){

        return fetch(`${url}/api/amenities/${id}`, {
            method: "DELETE",

            headers: {
                "authorization":
                    `Bearer ${AdminTokenService.getToken()}`
            }
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };


                return res.json();

            });

    }

};


module.exports = AmenityRequest;