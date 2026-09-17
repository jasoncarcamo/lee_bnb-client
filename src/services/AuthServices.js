const {url} = require("../config");


const AuthRequest = {

    registerAdmin(newAdmin){

        return fetch(`${url}/api/register`, {
            method: "POST",

            headers: {
                "content-type": "application/json"
            },

            body: JSON.stringify(newAdmin)
        })
            .then( res => {

                if(!res.ok){

                    return res.json()
                        .then( e => Promise.reject(e));

                };

                return res.json();

            });

    },


    logInAdmin(admin){
        console.log(url)
        return fetch(`${url}/api/login`, {
            method: "POST",

            headers: {
                "content-type": "application/json"
            },

            body: JSON.stringify(admin)
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


module.exports = AuthRequest;