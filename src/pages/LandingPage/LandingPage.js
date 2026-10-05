import React from "react";

import {
    Link
} from "react-router-dom";

import AppContext
    from "../../contexts/AppContext/AppContext";

import GuestProperties
    from "../Guest/GuestProperties/GuestProperties";

import PropertyDetails
    from "../Guest/GuestProperties/GuestPropertyDetails/GuestPropertyDetails";

import GuestTokenService
    from "../../storage/GuestTokenService";

import "./LandingPage.css";


export default class LandingPage extends React.Component{

    static contextType = AppContext;


    state = {
        selectedPropertyId: null,
        isLoggedIn:
            GuestTokenService.hasToken()
    };


    selectProperty = (propertyId)=>{

        this.setState({
            selectedPropertyId: propertyId
        });

    };


    closeProperty = ()=>{

        this.setState({
            selectedPropertyId: null
        });

    };


    handleSignOut = ()=>{

        this.context
            .guestAuthContext
            .logOutGuest();


        this.setState({
            isLoggedIn: false,
            selectedPropertyId: null
        });

    };


    render(){

        const {
            selectedPropertyId,
            isLoggedIn
        } = this.state;


        return (
            <div className="landing-page">

                <header className="landing-page__header">

                    <div className="landing-page__nav">

                        <button
                            className="landing-page__brand"
                            type="button"
                            onClick={this.closeProperty}
                            aria-label="Lee BnB home"
                        >

                            <span
                                className="landing-page__logo"
                                aria-hidden="true"
                            >
                                L
                            </span>

                            <span>
                                Lee BnB
                            </span>

                        </button>


                        <nav
                            className="landing-page__account-nav"
                            aria-label="Account"
                        >

                            {
                                isLoggedIn
                                    ? (
                                        <React.Fragment>

                                            <Link
                                                className="landing-page__login"
                                                to="/guest"
                                            >
                                                Home
                                            </Link>


                                            <button
                                                className="landing-page__register"
                                                type="button"
                                                onClick={this.handleSignOut}
                                            >
                                                Sign out
                                            </button>

                                        </React.Fragment>
                                    )
                                    : (
                                        <React.Fragment>

                                            <Link
                                                className="landing-page__login"
                                                to="/guest/login"
                                            >
                                                Log in
                                            </Link>


                                            <Link
                                                className="landing-page__register"
                                                to="/guest/register"
                                            >
                                                Create account
                                            </Link>

                                        </React.Fragment>
                                    )
                            }

                        </nav>

                    </div>

                </header>


                <main className="landing-page__main">

                    {
                        selectedPropertyId
                            ? (
                                <PropertyDetails
                                    propertyId={
                                        selectedPropertyId
                                    }
                                    handleBack={
                                        this.closeProperty
                                    }
                                />
                            )
                            : (
                                <React.Fragment>

                                    <section
                                        className="landing-page__hero"
                                        aria-labelledby="landing-title"
                                    >

                                        <div className="landing-page__hero-content">

                                            <p className="landing-page__eyebrow">
                                                Welcome to Lee BnB
                                            </p>


                                            <h1 id="landing-title">
                                                A simple way to find
                                                your next stay.
                                            </h1>


                                            <p className="landing-page__description">
                                                Explore our properties,
                                                check availability, choose
                                                your dates, and request
                                                your stay directly with
                                                Lee BnB.
                                            </p>


                                            <a
                                                className="landing-page__explore"
                                                href="#properties"
                                            >
                                                Explore properties
                                            </a>

                                        </div>

                                    </section>


                                    <section
                                        id="properties"
                                        className="landing-page__properties"
                                        aria-labelledby="properties-title"
                                    >

                                        <header className="landing-page__section-header">

                                            <p className="landing-page__section-eyebrow">
                                                Our properties
                                            </p>


                                            <h2 id="properties-title">
                                                Places made for your next getaway
                                            </h2>


                                            <p>
                                                Explore our collection of
                                                properties, each with its
                                                own availability, amenities,
                                                and details.
                                            </p>

                                        </header>


                                        <GuestProperties
                                            handleSelectProperty={
                                                this.selectProperty
                                            }
                                        />

                                    </section>

                                </React.Fragment>
                            )
                    }

                </main>


                <footer className="landing-page__footer">

                    <p>
                        © {new Date().getFullYear()} Lee BnB
                    </p>

                </footer>

            </div>
        );

    };

};