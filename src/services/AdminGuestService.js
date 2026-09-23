const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const AdminGuestRequest = {

    handleResponse(res){

        if(!res.ok){

            return res.json()
                .then(error => Promise.reject(error));

        };


        return res.json();

    },


    getAllGuests(){

        return fetch(
            `${url}/api/guests`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    getGuestById(id){

        return fetch(
            `${url}/api/guests/${encodeURIComponent(id)}`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    createGuest(newGuest){

        return fetch(
            `${url}/api/guests`,
            {
                method: "POST",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`,
                    "content-type": "application/json"
                },

                body: JSON.stringify(newGuest)
            }
        )
            .then(this.handleResponse);

    },


    updateGuest(id, updatedGuest){

        return fetch(
            `${url}/api/guests/${encodeURIComponent(id)}`,
            {
                method: "PATCH",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`,
                    "content-type": "application/json"
                },

                body: JSON.stringify(updatedGuest)
            }
        )
            .then(this.handleResponse);

    },


    deleteGuest(id){

        return fetch(
            `${url}/api/guests/${encodeURIComponent(id)}`,
            {
                method: "DELETE",

                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    }

};


module.exports = AdminGuestRequest;