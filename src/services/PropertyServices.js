const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const PropertyRequest = {

    getAllProperties(){

        return fetch(`${url}/api/properties`)
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    getPropertyById(id){

        return fetch(`${url}/api/properties/${id}`)
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    getPropertyBySlug(slug){

        return fetch(`${url}/api/properties/slug/${slug}`)
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    createProperty(newProperty){

        return fetch(`${url}/api/properties`, {
            method: "POST",

            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(newProperty)
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    updateProperty(id, updatedProperty){

        return fetch(`${url}/api/properties/${id}`, {
            method: "PATCH",

            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(updatedProperty)
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    deleteProperty(id){

        return fetch(`${url}/api/properties/${id}`, {
            method: "DELETE",

            headers: {
                "authorization": `Bearer ${AdminTokenService.getToken()}`
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


module.exports = PropertyRequest;