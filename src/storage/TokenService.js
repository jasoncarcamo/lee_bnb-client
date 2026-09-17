const AdminTokenService = {

    getToken(){

        return window.localStorage.getItem("admin-token");

    },


    hasToken(){

        return this.getToken();

    },


    setToken(token){

        return window.localStorage.setItem(
            "admin-token",
            token
        );

    },


    updateToken(token){

        return this.setToken(token);

    },


    deleteToken(){

        return window.localStorage.removeItem(
            "admin-token"
        );

    }

};


module.exports = AdminTokenService;