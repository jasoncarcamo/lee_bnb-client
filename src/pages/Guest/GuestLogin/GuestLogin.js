import React from "react";
import {Navigate} from "react-router-dom";

import AppContext from "../../../contexts/AppContext/AppContext";
import GuestTokenService from "../../../storage/GuestTokenService";
import "./GuestLogin.css";


export default class GuestLogin extends React.Component{

    static contextType = AppContext;


    state = {
        email: "",
        password: "",
        error: "",
        isSubmitting: false,
        redirectToGuest: false
    };


    componentDidMount(){

        if(GuestTokenService.hasToken()){

            this.setState({
                redirectToGuest: true
            });

        };

    };


    handleChange = (event)=>{

        const {
            name,
            value
        } = event.target;


        this.setState({
            [name]: value,
            error: ""
        });

    };


    handleSubmit = (event)=>{

        event.preventDefault();


        const {
            email,
            password
        } = this.state;


        const guest = {
            email,
            password
        };


        this.setState({
            isSubmitting: true,
            error: ""
        });


        this.context
            .guestAuthContext
            .logInGuest(guest)
            .then(response => {

                /*
                    GuestAuthContext already saves
                    the token and Guest state.
                */

                this.setState({
                    password: "",
                    isSubmitting: false,
                    redirectToGuest: true
                });

                return response;

            })
            .catch(error => {

                this.setState({
                    isSubmitting: false,
                    error:
                        error.error ||
                        "Unable to log in"
                });

            });

    };


    render(){

        const {
            email,
            password,
            error,
            isSubmitting,
            redirectToGuest
        } = this.state;


        if(redirectToGuest){

            return (
                <Navigate
                    to="/guest"
                    replace
                />
            );

        };


        return (
            <main className="guest-login">

                <section className="guest-login__container">

                    <header className="guest-login__header">

                        <div
                            className="guest-login__logo"
                            aria-hidden="true"
                        >
                            L
                        </div>

                        <p className="guest-login__brand">
                            Lee BnB
                        </p>

                    </header>


                    <div className="guest-login__card">

                        <header className="guest-login__welcome">

                            <p className="guest-login__eyebrow">
                                Guest Portal
                            </p>

                            <h1>
                                Welcome back
                            </h1>

                            <p>
                                Sign in to your Lee BnB account.
                            </p>

                        </header>


                        <form
                            className="guest-login__form"
                            onSubmit={this.handleSubmit}
                        >

                            <div className="guest-login__field">

                                <label htmlFor="guest-email">
                                    Email
                                </label>

                                <input
                                    id="guest-email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    onChange={this.handleChange}
                                    disabled={isSubmitting}
                                    required
                                />

                            </div>


                            <div className="guest-login__field">

                                <label htmlFor="guest-password">
                                    Password
                                </label>

                                <input
                                    id="guest-password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    onChange={this.handleChange}
                                    disabled={isSubmitting}
                                    required
                                />

                            </div>


                            {
                                error &&
                                <p
                                    className="guest-login__error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            }


                            <button
                                className="guest-login__submit"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {
                                    isSubmitting
                                        ? "Signing in..."
                                        : "Sign in"
                                }
                            </button>

                        </form>


                        <p className="guest-login__register">

                            Don't have an account?{" "}

                            <a href="/guest/register">
                                Create account
                            </a>

                        </p>

                    </div>

                </section>

            </main>
        );

    };

};