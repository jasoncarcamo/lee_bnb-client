const { url } = require("../config");

const AdminTokenService = require("../storage/TokenService");


const InquiryRequest = {

    getAllInquiries(){

        return fetch(`${url}/api/inquiries`, {

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

    },


    getInquiryById(id){

        return fetch(`${url}/api/inquiries/${id}`, {

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

    },


    createInquiry(newInquiry){

        return fetch(`${url}/api/inquiries/admin`, {

            method: "POST",

            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(newInquiry)

        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    updateInquiry(id, updatedInquiry){

        return fetch(`${url}/api/inquiries/${id}`, {

            method: "PATCH",

            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${AdminTokenService.getToken()}`
            },

            body: JSON.stringify(updatedInquiry)

        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    sendInquiry(id){

        return fetch(`${url}/api/inquiries/${id}/send`, {

            method: "POST",

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

    },


    deleteInquiry(id){

        return fetch(`${url}/api/inquiries/${id}`, {

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

    },
    getReservationQuote(request){

        return fetch(`${url}/api/inquiries/quote`, {

            method: "POST",

            headers: {

                "content-type": "application/json",

                "authorization":
                    `Bearer ${AdminTokenService.getToken()}`

            },

            body: JSON.stringify(request)

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


module.exports = InquiryRequest;