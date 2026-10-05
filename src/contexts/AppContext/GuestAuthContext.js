import React, { Component } from "react";

const GuestAuthRequest =
    require("../../services/GuestAuthService");

const GuestTokenService =
    require("../../storage/GuestTokenService");


const GuestAuthContext = React.createContext({

    guest: null,

    isLoggedIn: false,

    registerGuest: () => {},

    logInGuest: () => {},

    logOutGuest: () => {}

});


export class GuestAuthProvider extends Component {

    state = {

        guest: null,

        isLoggedIn: false,

        loading: true

    };


    componentDidMount(){

        if(!GuestTokenService.hasToken()){

            this.setState({
                loading: false
            });

            return;

        };


        GuestAuthRequest
            .getCurrentGuest()
            .then(response => {

                this.setState({

                    guest:
                        response.guest,

                    isLoggedIn: true,

                    loading: false

                });

            })
            .catch(() => {

                GuestTokenService.deleteToken();

                this.setState({

                    guest: null,

                    isLoggedIn: false,

                    loading: false

                });

            });

    };


    registerGuest = (newGuest) => {

        return GuestAuthRequest
            .registerGuest(newGuest)
            .then(response => {

                GuestTokenService.setToken(
                    response.token
                );


                this.setState({

                    guest:
                        response.guest,

                    isLoggedIn: true

                });


                return response;

            });

    };


    logInGuest = (guest) => {

        return GuestAuthRequest
            .logInGuest(guest)
            .then(response => {

                GuestTokenService.setToken(
                    response.token
                );


                this.setState({

                    guest:
                        response.guest,

                    isLoggedIn: true

                });


                return response;

            });

    };


    logOutGuest = () => {

        GuestTokenService.deleteToken();


        this.setState({

            guest: null,

            isLoggedIn: false

        });

    };


    render(){

        const value = {
            guest:
                this.state.guest,
            isLoggedIn:
                this.state.isLoggedIn,
            loading:
                this.state.loading,
            registerGuest:
                this.registerGuest,
            logInGuest:
                this.logInGuest,
            logOutGuest:
                this.logOutGuest
        };


        return (

            <GuestAuthContext.Provider
                value={value}
            >

                {this.props.children}

            </GuestAuthContext.Provider>

        );

    };

};


export default GuestAuthContext;