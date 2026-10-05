import React from "react";

import {
    Link,
    Navigate
} from "react-router-dom";

import AppContext
    from "../../../contexts/AppContext/AppContext";

import "./GuestHeader.css";


export default class GuestHeader extends React.Component{

    static contextType = AppContext;


    state = {
        redirectToLanding: false
    };


    handleSignOut = ()=>{

        this.context
            .guestAuthContext
            .logOutGuest();


        this.setState({
            redirectToLanding: true
        });

    };


    render(){

        if(this.state.redirectToLanding){

            return (
                <Navigate
                    to="/"
                    replace
                />
            );

        };


        return (
            <header className="guest-header">

                <div className="guest-header__container">

                    <Link
                        className="guest-header__brand"
                        to="/"
                        aria-label="Lee BnB public home"
                    >
                        Lee BnB
                    </Link>


                    <nav
                        className="guest-header__nav"
                        aria-label="Guest navigation"
                    >

                        <Link
                            className="guest-header__home"
                            to="/guest"
                        >
                            Home
                        </Link>


                        <button
                            type="button"
                            className="guest-header__sign-out"
                            onClick={this.handleSignOut}
                        >
                            Sign out
                        </button>

                    </nav>

                </div>

            </header>
        );

    };

};