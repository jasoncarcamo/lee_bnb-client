import React from "react";

import AppContext
    from "../../../../../contexts/AppContext/AppContext";
import GuestTokenService
    from "../../../../../storage/GuestTokenService";
import "./GuestInquiryAuth.css";


export default class GuestInquiryAuth extends React.Component{

    static contextType = AppContext;


    state = {

        authMode: "login",

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        isSubmitting: false,
        error: ""

    };
    
    handleBookingFormBackgroundChange = (event)=>{
        this.props.handleChange(event);
    }

    handleChange = (event)=>{
        const {
            name,
            value
        } = event.target;

        this.handleBookingFormBackgroundChange(event)

        this.setState({
            [name]: value,
            error: ""
        });
    };


    showLogin = ()=>{

        if(this.state.isSubmitting){

            return;

        };


        this.setState({
            authMode: "login",
            password: "",
            confirmPassword: "",
            error: ""
        });

    };


    showRegister = ()=>{

        if(this.state.isSubmitting){

            return;

        };


        this.setState({
            authMode: "register",
            password: "",
            confirmPassword: "",
            error: ""
        });

    };


    handleLogin = (event)=>{

        event.preventDefault();

        
        const {
            email,
            password
        } = this.state;


        this.setState({
            isSubmitting: true,
            error: ""
        });


        this.context.guestAuthContext
            .logInGuest({
                email: email.trim(),
                password
            })
            .then( response => {
                this.setState({
                    isSubmitting: false
                });


                this.props.onAuthenticated(response.guest);

            })
            .catch( error => {

                this.setState({

                    isSubmitting: false,

                    error:
                        error.error ||
                        "Unable to log in."

                });

            });

    };


    handleRegister = (event)=>{

        event.preventDefault();


        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword
        } = this.state;


        if(password !== confirmPassword){

            this.setState({
                error:
                    "Passwords do not match."
            });

            return;

        };


        this.setState({
            isSubmitting: true,
            error: ""
        });


        this.context.guestAuthContext
            .registerGuest({

                first_name:
                    firstName.trim(),

                last_name:
                    lastName.trim() || null,

                email:
                    email.trim(),

                phone:
                    phone.trim() || null,

                password

            })
            .then( response => {

                this.setState({
                    isSubmitting: false
                });


                this.props.onAuthenticated(response.guest
                );

            })
            .catch( error => {

                this.setState({

                    isSubmitting: false,

                    error:
                        error.error ||
                        "Unable to create your account."

                });

            });

    };


    renderLogin(){

        const {
            email,
            password,
            isSubmitting
        } = this.state;

        return (
            <form
                className="guest-inquiry-auth__form"
                onSubmit={this.handleLogin}
            >

                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-login-email">
                        Email
                    </label>

                    <input
                        id="booking-login-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={this.handleChange}
                        autoComplete="email"
                        required
                    />

                </div>


                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-login-password">
                        Password
                    </label>

                    <input
                        id="booking-login-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        autoComplete="current-password"
                        required
                    />

                </div>


                <button
                    type="submit"
                    className="guest-inquiry-auth__primary"
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting
                            ? "Logging in..."
                            : "Log in and continue"
                    }
                </button>


                <p className="guest-inquiry-auth__switch">

                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={this.showRegister}
                        disabled={isSubmitting}
                    >
                        Create account
                    </button>

                </p>

            </form>
        );

    };


    renderRegister(){

        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
            isSubmitting
        } = this.state;


        return (
            <form
                className="guest-inquiry-auth__form"
                onSubmit={this.handleRegister}
            >

                <div className="guest-inquiry-auth__row">

                    <div className="guest-inquiry-auth__field">

                        <label htmlFor="booking-register-first-name">
                            First name
                        </label>

                        <input
                            id="booking-register-first-name"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={this.handleChange}
                            autoComplete="given-name"
                            required
                        />

                    </div>


                    <div className="guest-inquiry-auth__field">

                        <label htmlFor="booking-register-last-name">
                            Last name
                        </label>

                        <input
                            id="booking-register-last-name"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={this.handleChange}
                            autoComplete="family-name"
                        />

                    </div>

                </div>


                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-register-email">
                        Email
                    </label>

                    <input
                        id="booking-register-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={this.handleChange}
                        autoComplete="email"
                        required
                    />

                </div>


                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-register-phone">
                        Phone
                    </label>

                    <input
                        id="booking-register-phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={this.handleChange}
                        autoComplete="tel"
                    />

                </div>


                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-register-password">
                        Password
                    </label>

                    <input
                        id="booking-register-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        autoComplete="new-password"
                        required
                    />

                </div>


                <div className="guest-inquiry-auth__field">

                    <label htmlFor="booking-register-confirm-password">
                        Confirm password
                    </label>

                    <input
                        id="booking-register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        autoComplete="new-password"
                        required
                    />

                </div>


                <button
                    type="submit"
                    className="guest-inquiry-auth__primary"
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting
                            ? "Creating account..."
                            : "Create account and continue"
                    }
                </button>


                <p className="guest-inquiry-auth__switch">

                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={this.showLogin}
                        disabled={isSubmitting}
                    >
                        Log in
                    </button>

                </p>

            </form>
        );

    };


    render(){

        const {
            authMode,
            error,
            isSubmitting
        } = this.state;


        return (
            <div className="guest-inquiry-auth__overlay">

                <section
                    className="guest-inquiry-auth"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="guest-inquiry-auth-title"
                >

                    <button
                        type="button"
                        className="guest-inquiry-auth__close"
                        onClick={this.props.handleClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        ×
                    </button>


                    <header className="guest-inquiry-auth__header">

                        <h2 id="guest-inquiry-auth-title">
                            {
                                authMode === "login"
                                    ? "Log in to continue"
                                    : "Create your account"
                            }
                        </h2>

                        <p>
                            Your reservation request is ready.
                            Sign in to continue without losing
                            your information.
                        </p>

                    </header>


                    {
                        error &&
                        (
                            <p
                                className="guest-inquiry-auth__error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )
                    }


                    {
                        authMode === "login"
                            ? this.renderLogin()
                            : this.renderRegister()
                    }

                </section>

            </div>
        );

    };

};