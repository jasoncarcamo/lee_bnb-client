const {url} = require("../config");

const AdminTokenService = require("../storage/TokenService");


const AdminPaymentRequest = {

    getAllPayments(){

        return fetch(
            `${url}/api/payments`,
            {
                headers: {
                    "authorization": `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(res => {

                if(!res.ok){

                    return res.json()
                        .then(error => Promise.reject(error));

                };


                return res.json();

            });

    }

};


module.exports = AdminPaymentRequest;