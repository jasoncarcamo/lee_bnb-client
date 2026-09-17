import React from "react";

import AuthRequest from "../../services/AuthServices";
import AdminTokenService from "../../storage/TokenService";

import "./AdminRegister.css";


export default class AdminRegister extends React.Component{

    state = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
        success: "",
        isSubmitting: false
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
            password,
            confirmPassword
        } = this.state;


        if(password !== confirmPassword){

            this.setState({
                error: "Passwords do not match"
            });

            return;

        };


        const newAdmin = {
            first_name,
            last_name,
            email,
            password
        };


        const admin = {
            email,
            password
        };


        this.setState({
            isSubmitting: true,
            error: "",
            success: ""
        });


        AuthRequest.registerAdmin(newAdmin)
            .then( response => {

                return AuthRequest.logInAdmin(admin);

            })
            .then( response => {

                AdminTokenService.setToken(
                    response.token
                );


                this.setState({
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    error: "",
                    success: "Admin account created successfully",
                    isSubmitting: false
                });

            })
            .catch( error => {

                this.setState({
                    error: error.error || "Unable to create admin account",
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
            password,
            confirmPassword,
            error,
            success,
            isSubmitting
        } = this.state;


        return (
            <main className="admin-register">

                <section className="admin-register__container">

                    <header className="admin-register__header">

                        <div
                            className="admin-register__logo"
                            aria-hidden="true"
                        >
                            L
                        </div>

                        <p className="admin-register__brand">
                            Lee BnB
                        </p>

                    </header>


                    <div className="admin-register__card">

                        <header className="admin-register__welcome">

                            <p className="admin-register__eyebrow">
                                Admin Portal
                            </p>

                            <h1>
                                Create admin account
                            </h1>

                            <p>
                                Register an administrator for Lee BnB.
                            </p>

                        </header>


                        <form
                            className="admin-register__form"
                            onSubmit={this.handleSubmit}
                        >

                            <div className="admin-register__name-fields">

                                <div className="admin-register__field">

                                    <label htmlFor="admin-first-name">
                                        First name
                                    </label>

                                    <input
                                        id="admin-first-name"
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


                                <div className="admin-register__field">

                                    <label htmlFor="admin-last-name">
                                        Last name
                                    </label>

                                    <input
                                        id="admin-last-name"
                                        name="last_name"
                                        type="text"
                                        value={last_name}
                                        placeholder="Last name"
                                        autoComplete="family-name"
                                        onChange={this.handleChange}
                                        disabled={isSubmitting}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="admin-register__field">

                                <label htmlFor="admin-register-email">
                                    Email
                                </label>

                                <input
                                    id="admin-register-email"
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


                            <div className="admin-register__field">

                                <label htmlFor="admin-register-password">
                                    Password
                                </label>

                                <input
                                    id="admin-register-password"
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


                            <div className="admin-register__field">

                                <label htmlFor="admin-confirm-password">
                                    Confirm password
                                </label>

                                <input
                                    id="admin-confirm-password"
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
                                    className="admin-register__message admin-register__message--error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            }


                            {
                                success &&
                                <p
                                    className="admin-register__message admin-register__message--success"
                                    role="status"
                                >
                                    {success}
                                </p>
                            }


                            <button
                                className="admin-register__submit"
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

                    </div>


                    <footer className="admin-register__footer">

                        <p>
                            Lee BnB Management
                        </p>

                    </footer>

                </section>

            </main>
        );

    };
};