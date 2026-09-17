import React from "react";

import AuthContext from "../../../contexts/AuthContext";
import AdminTokenService from "../../../storage/TokenService";
import "./AdminLogin.css";


export default class AdminLogin extends React.Component{

    static contextType = AuthContext;
    state = {
        email: "",
        password: "",
        error: "",
        isSubmitting: false,
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


        const admin = {
            email,
            password
        };


        this.setState({
            isSubmitting: true,
            error: ""
        });

        this.context.logInAdmin(admin)
            .then( response => {

                AdminTokenService.setToken(
                    response.token
                );
                this.setState({
                    isSubmitting: false
                });

            })
            .catch( error => {

                this.setState({
                    isSubmitting: false,
                    error: error.error || "Unable to log in"
                });

            });

    };


    render(){

        const {
            email,
            password,
            error,
            isSubmitting
        } = this.state;


        return (
            <section className="admin-login">

                <div className="admin-login__container">


                    <header className="admin-login__header">

                        <div
                            className="admin-login__logo"
                            aria-hidden="true"
                        >
                            L
                        </div>


                        <p className="admin-login__brand">
                            Lee BnB
                        </p>

                    </header>


                    <div className="admin-login__card">

                        <div className="admin-login__welcome">

                            <p className="admin-login__eyebrow">
                                Admin Portal
                            </p>

                            <h1>
                                Welcome back
                            </h1>

                            <p>
                                Sign in to manage Lee BnB.
                            </p>

                        </div>


                        <form
                            className="admin-login__form"
                            onSubmit={this.handleSubmit}
                        >

                            <div className="admin-login__field">

                                <label htmlFor="admin-email">
                                    Email
                                </label>

                                <input
                                    id="admin-email"
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


                            <div className="admin-login__field">

                                <label htmlFor="admin-password">
                                    Password
                                </label>

                                <input
                                    id="admin-password"
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
                                    className="admin-login__error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            }


                            <button
                                className="admin-login__submit"
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

                    </div>


                    <footer className="admin-login__footer">

                        <p>
                            Lee BnB Management
                        </p>

                    </footer>

                </div>

            </section>
        );

    };
};