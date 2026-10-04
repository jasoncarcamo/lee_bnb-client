import React from "react";

import AppContext from "../../../contexts/AppContext/AppContext";

import "./GuestProperties.css";


export default class GuestProperties extends React.Component{

    static contextType = AppContext;


    formatCurrency = (
        amount,
        currency = "USD"
    )=>{

        const numericAmount =
            Number(amount);


        if(!Number.isFinite(numericAmount)){

            return "—";

        };


        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: currency || "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        ).format(numericAmount);

    };


    getActivePropertyIds = ()=>{

        const {
            properties,
            propertyIds
        } = this.context.propertyContext;


        return propertyIds.filter(
            propertyId => {

                const property =
                    properties[propertyId];


                return (
                    property &&
                    property.status === "active"
                );

            }
        );

    };


    renderProperties = ()=>{

        const {
            properties
        } = this.context.propertyContext;


        const activePropertyIds =
            this.getActivePropertyIds();


        if(!activePropertyIds.length){

            return (
                <div className="guest-properties__empty">

                    <h2>
                        No stays available
                    </h2>

                    <p>
                        There are currently no properties
                        available for booking.
                    </p>

                </div>
            );

        };


        return (
            <div className="guest-properties__grid">

                {
                    activePropertyIds.map(
                        propertyId => {

                            const property =
                                properties[propertyId];


                            return (
                                <article
                                    className="guest-properties__card"
                                    key={property.id}
                                >

                                    <div className="guest-properties__content">

                                        <header className="guest-properties__card-header">

                                            <div>

                                                <h2>
                                                    {property.name}
                                                </h2>

                                                <p className="guest-properties__location">

                                                    {
                                                        [
                                                            property.city,
                                                            property.state
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")
                                                    }

                                                </p>

                                            </div>

                                        </header>


                                        {
                                            property.description &&

                                            <p className="guest-properties__description">
                                                {property.description}
                                            </p>
                                        }


                                        <div className="guest-properties__details">

                                            <span>
                                                {property.max_guests}{" "}
                                                {
                                                    Number(
                                                        property.max_guests
                                                    ) === 1
                                                        ? "guest"
                                                        : "guests"
                                                }
                                            </span>

                                            <span aria-hidden="true">
                                                ·
                                            </span>

                                            <span>
                                                {property.bedrooms}{" "}
                                                {
                                                    Number(
                                                        property.bedrooms
                                                    ) === 1
                                                        ? "bedroom"
                                                        : "bedrooms"
                                                }
                                            </span>

                                            <span aria-hidden="true">
                                                ·
                                            </span>

                                            <span>
                                                {property.beds}{" "}
                                                {
                                                    Number(
                                                        property.beds
                                                    ) === 1
                                                        ? "bed"
                                                        : "beds"
                                                }
                                            </span>

                                            <span aria-hidden="true">
                                                ·
                                            </span>

                                            <span>
                                                {property.bathrooms}{" "}
                                                {
                                                    Number(
                                                        property.bathrooms
                                                    ) === 1
                                                        ? "bathroom"
                                                        : "bathrooms"
                                                }
                                            </span>

                                        </div>


                                        <div className="guest-properties__footer">

                                            <div className="guest-properties__price">

                                                <strong>
                                                    {
                                                        this.formatCurrency(
                                                            property.base_price,
                                                            property.currency
                                                        )
                                                    }
                                                </strong>

                                                <span>
                                                    {" "}/ night
                                                </span>

                                                <small>
                                                    Minimum{" "}
                                                    {property.minimum_nights}{" "}
                                                    {
                                                        Number(
                                                            property.minimum_nights
                                                        ) === 1
                                                            ? "night"
                                                            : "nights"
                                                    }
                                                </small>

                                            </div>


                                            <button
                                                type="button"
                                                className="guest-properties__view"
                                                onClick={
                                                    ()=>this.props.handleSelectProperty(
                                                        property.id
                                                    )
                                                }
                                            >
                                                View property
                                            </button>

                                        </div>

                                    </div>

                                </article>
                            );

                        }
                    )
                }

            </div>
        );

    };


    render(){

        const {
            isLoading,
            error
        } = this.context.propertyContext;


        return (
            <section
                className="guest-properties"
                aria-labelledby="guest-properties-title"
            >

                <header className="guest-properties__header">

                    <h1 id="guest-properties-title">
                        Find your stay
                    </h1>

                    <p>
                        Choose a property and start planning
                        your stay.
                    </p>

                </header>


                {
                    isLoading
                        ? (
                            <p
                                className="guest-properties__loading"
                                role="status"
                                aria-live="polite"
                            >
                                Loading properties...
                            </p>
                        )
                        : error
                            ? (
                                <p
                                    className="guest-properties__error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )
                            : this.renderProperties()
                }

            </section>
        );

    };
};