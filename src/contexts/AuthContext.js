import React from "react";

import AuthRequest from "../services/AuthServices";
import AdminTokenService from "../storage/TokenService";


const AuthContext = React.createContext({
    admin: null,
    isAuthenticated: false,
    logInAdmin: ()=>{},
    registerAdmin: ()=>{},
    logOutAdmin: ()=>{}
});


export default AuthContext;


export class AuthContextProvider extends React.Component{

    state = {
        admin: null,
        isAuthenticated: AdminTokenService.hasToken()
    };


    logInAdmin = (admin)=>{

        return AuthRequest.logInAdmin(admin)
            .then( response => {

                AdminTokenService.setToken(
                    response.token
                );


                this.setState({
                    admin: response.admin,
                    isAuthenticated: true
                });


                return response;

            });

    };


    registerAdmin = (newAdmin)=>{

        const admin = {
            email: newAdmin.email,
            password: newAdmin.password
        };


        return AuthRequest.registerAdmin(newAdmin)
            .then( response => {
                console.log(response)
                this.setState({
                    admin: response.admin,
                    isAuthenticated: true
                });

                return this.logInAdmin(admin);

            });

    };


    logOutAdmin = ()=>{

        AdminTokenService.deleteToken();


        this.setState({
            admin: null,
            isAuthenticated: false
        });

    };


    render(){

        const value = {
            admin: this.state.admin,
            isAuthenticated: this.state.isAuthenticated,

            logInAdmin: this.logInAdmin,
            registerAdmin: this.registerAdmin,
            logOutAdmin: this.logOutAdmin
        };


        return (
            <AuthContext.Provider value={value}>
                {this.props.children}
            </AuthContext.Provider>
        );

    };
};