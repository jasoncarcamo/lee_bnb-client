import React from "react";

import {
    Navigate,
    Link
} from "react-router-dom";

import AppContext from "../../../contexts/AppContext/AppContext";
import GuestTokenService from "../../../storage/GuestTokenService";

import "./GuestRegister.css";


export default class GuestRegister extends React.Component{

    static contextType = AppContext;


    state = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        error: "",
        success: "",
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
            error: "",
            success: ""
        });

    };


    handleSubmit = (event)=>{

        event.preventDefault();


        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            confirmPassword
        } = this.state;


        if(password !== confirmPassword){

            this.setState({
                error: "Passwords do not match"
            });

            return;

        };


        const newGuest = {
            first_name,
            last_name,
            email,
            phone,
            password
        };


        this.setState({
            isSubmitting: true,
            error: "",
            success: ""
        });


        this.context
            .guestAuthContext
            .registerGuest(newGuest)
            .then(() => {

                this.setState({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    error: "",
                    success:
                        "Guest account created successfully",
                    isSubmitting: false,
                    redirectToGuest: true
                });

            })
            .catch(error => {

                this.setState({
                    error:
                        error.error ||
                        "Unable to create account",
                    success: "",
                    isSubmitting: false
                });

            });

    };


    render(){

        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            confirmPassword,
            error,
            success,
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
            <main className="guest-register">

                <section className="guest-register__container">

                    <header className="guest-register__header">

                        <div
                            className="guest-register__logo"
                            aria-hidden="true"
                        >
                            L
                        </div>

                        <p className="guest-register__brand">
                            Lee BnB
                        </p>

                    </header>


                    <div className="guest-register__card">

                        <header className="guest-register__welcome">

                            <p className="guest-register__eyebrow">
                                Guest Account
                            </p>

                            <h1>
                                Create your account
                            </h1>

                            <p>
                                Register to request and manage your stays.
                            </p>

                        </header>


                        <form
                            className="guest-register__form"
                            onSubmit={this.handleSubmit}
                        >

                            <div className="guest-register__name-fields">

                                <div className="guest-register__field">

                                    <label htmlFor="guest-first-name">
                                        First name
                                    </label>

                                    <input
                                        id="guest-first-name"
                                        name="first_name"
                                        type="text"
                                        value={first_name}
                                        placeholder="First name"
                                        autoComplete="given-name"
                                        onChange={this.handleChange}
                                        disabled={isSubmitting}
                                        required
                                    />

                                </div>


                                <div className="guest-register__field">

                                    <label htmlFor="guest-last-name">
                                        Last name
                                    </label>

                                    <input
                                        id="guest-last-name"
                                        name="last_name"
                                        type="text"
                                        value={last_name}
                                        placeholder="Last name"
                                        autoComplete="family-name"
                                        onChange={this.handleChange}
                                        disabled={isSubmitting}
                                    />

                                </div>

                            </div>


                            <div className="guest-register__field">

                                <label htmlFor="guest-phone">
                                    Phone
                                </label>

                                <input
                                    id="guest-phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    onChange={this.handleChange}
                                    disabled={isSubmitting}
                                />

                            </div>


                            <div className="guest-register__field">

                                <label htmlFor="guest-register-email">
                                    Email
                                </label>

                                <input
                                    id="guest-register-email"
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


                            <div className="guest-register__field">

                                <label htmlFor="guest-register-password">
                                    Password
                                </label>

                                <input
                                    id="guest-register-password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    onChange={this.handleChange}
                                    disabled={isSubmitting}
                                    minLength="8"
                                    required
                                />

                            </div>


                            <div className="guest-register__field">

                                <label htmlFor="guest-confirm-password">
                                    Confirm password
                                </label>

                                <input
                                    id="guest-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    onChange={this.handleChange}
                                    disabled={isSubmitting}
                                    minLength="8"
                                    required
                                />

                            </div>


                            {
                                error &&
                                <p
                                    className="guest-register__message guest-register__message--error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            }


                            {
                                success &&
                                <p
                                    className="guest-register__message guest-register__message--success"
                                    role="status"
                                >
                                    {success}
                                </p>
                            }


                            <button
                                className="guest-register__submit"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {
                                    isSubmitting
                                        ? "Creating account..."
                                        : "Create account"
                                }
                            </button>

                        </form>


                        <p className="guest-register__login">

                            Already have an account?{" "}

                            <Link to="/guest/login">
                                Sign in
                            </Link>

                        </p>

                    </div>

                </section>

            </main>
        );

    };

};