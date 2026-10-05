const GuestTokenService = {
    getToken(){

        return window.localStorage.getItem("guest-token");

    },
    hasToken(){

        return this.getToken();

    },
    setToken(token){

        return window.localStorage.setItem(
            "guest-token",
            token
        );

    },
    updateToken(token){

        return this.setToken(token);

    },
    deleteToken(){

        return window.localStorage.removeItem(
            "guest-token"
        );

    }
};


module.exports = GuestTokenService;