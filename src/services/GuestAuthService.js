const {url} = require("../config");
const GuestTokenService = require("../storage/GuestTokenService");


const GuestAuthRequest = {

    registerGuest(newGuest){

        return fetch(`${url}/api/guest-auth/register`, {
            method: "POST",

            headers: {
                "content-type": "application/json"
            },

            body: JSON.stringify(newGuest)
        })
            .then(res => {

                if(!res.ok){

                    return res.json()
                        .then(e => Promise.reject(e));

                };

                return res.json();

            });

    },


    logInGuest(guest){

        return fetch(`${url}/api/guest-auth/login`, {
            method: "POST",

            headers: {
                "content-type": "application/json"
            },

            body: JSON.stringify(guest)
        })
            .then(res => {

                if(!res.ok){

                    return res.json()
                        .then(e => Promise.reject(e));

                };

                return res.json();

            });

    },


    getCurrentGuest(){

        return fetch(`${url}/api/guest-auth/me`, {

            headers: {

                authorization:
                    `Bearer ${GuestTokenService.getToken()}`

            }

        })
            .then(res => {

                if(!res.ok){

                    return res.json()
                        .then(e => Promise.reject(e));

                };

                return res.json();

            });

    }

};


module.exports = GuestAuthRequest;