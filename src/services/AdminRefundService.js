const { url } = require("../config");

const AdminTokenService = require("../storage/TokenService");


const AdminRefundRequest = {

    handleResponse(res) {

        return res.json()
            .then(response => {

                if (!res.ok) {

                    return Promise.reject(response);

                };

                return response;

            });

    },


    getRefundsByPaymentId(paymentId) {

        return fetch(
            `${url}/api/refunds/payment/${paymentId}`,
            {
                headers: {
                    "authorization":
                        `Bearer ${AdminTokenService.getToken()}`
                }
            }
        )
            .then(this.handleResponse);

    },


    createRefund(newRefund) {

        return fetch(
            `${url}/api/refunds`,
            {
                method: "POST",

                headers: {
                    "authorization":
                        `Bearer ${AdminTokenService.getToken()}`,

                    "content-type": "application/json"
                },

                body: JSON.stringify(newRefund)
            }
        )
            .then(this.handleResponse);

    }

};


module.exports = AdminRefundRequest;