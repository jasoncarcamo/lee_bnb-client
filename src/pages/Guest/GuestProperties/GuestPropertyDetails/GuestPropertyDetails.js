import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";
import AvailabilityCalendar from "../AvailabilityCalendar/AvailabilityCalendar";
import GuestInquiry from "./GuestInquiry/GuestInquiry";
import "./GuestPropertyDetails.css";


export default class PropertyDetails extends React.Component{
    
    state = {
        checkIn: "",
        checkOut: ""
    };


    handleStayChange = (
        checkIn,
        checkOut
    )=>{

        this.setState({
            checkIn,
            checkOut
        });

    };

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


    formatBathrooms = (bathrooms)=>{

        const amount =
            Number(bathrooms);


        if(!Number.isFinite(amount)){

            return bathrooms;

        };


        return Number.isInteger(amount)
            ? amount
            : amount.toFixed(1);

    };


    render(){

        const {
            propertyId,
            handleBack
        } = this.props;


        const {
            properties
        } = this.context.propertyContext;


        const property =
            properties[propertyId];


        if(!property){

            return (
                <section className="property-details">

                    <button
                        type="button"
                        className="property-details__back"
                        onClick={handleBack}
                    >
                        ← Back to properties
                    </button>

                    <p role="alert">
                        Property could not be found.
                    </p>

                </section>
            );

        };


        return (
            <article className="property-details">

                <button
                    type="button"
                    className="property-details__back"
                    onClick={handleBack}
                >
                    <span aria-hidden="true">
                        ←
                    </span>

                    {" "}

                    Back to properties
                </button>


                <header className="property-details__header">

                    <h1>
                        {property.name}
                    </h1>

                    <p className="property-details__location">

                        {
                            [
                                property.city,
                                property.state,
                                property.country
                            ]
                                .filter(Boolean)
                                .join(", ")
                        }

                    </p>

                </header>


                <div className="property-details__summary">

                    <span>
                        {property.max_guests} guests
                    </span>

                    <span aria-hidden="true">
                        ·
                    </span>

                    <span>
                        {property.bedrooms} bedrooms
                    </span>

                    <span aria-hidden="true">
                        ·
                    </span>

                    <span>
                        {property.beds} beds
                    </span>

                    <span aria-hidden="true">
                        ·
                    </span>

                    <span>
                        {this.formatBathrooms(
                            property.bathrooms
                        )} bathrooms
                    </span>

                </div>


                {
                    property.description &&

                    <section className="property-details__section">

                        <h2>
                            About this property
                        </h2>

                        <p>
                            {property.description}
                        </p>

                    </section>
                }


                <section className="property-details__section">

                    <h2>
                        Stay details
                    </h2>

                    <dl className="property-details__stay">

                        <div>

                            <dt>
                                Minimum stay
                            </dt>

                            <dd>
                                {property.minimum_nights}{" "}
                                {
                                    Number(
                                        property.minimum_nights
                                    ) === 1
                                        ? "night"
                                        : "nights"
                                }
                            </dd>

                        </div>


                        <div>

                            <dt>
                                Check-in
                            </dt>

                            <dd>
                                {property.check_in_time}
                            </dd>

                        </div>


                        <div>

                            <dt>
                                Check-out
                            </dt>

                            <dd>
                                {property.check_out_time}
                            </dd>

                        </div>

                    </dl>

                </section>
                
                <section className="property-details__section">

                    <h2>
                        Availability
                    </h2>

                    <AvailabilityCalendar
                        propertyId={property.id}
                        minimumNights={
                            property.minimum_nights
                        }
                        onStayChange={
                            this.handleStayChange
                        }
                    />

                </section>
                
                {
                    this.state.checkIn &&
                    this.state.checkOut &&
                    (
                        <GuestInquiry
                            property={property}
                            checkIn={this.state.checkIn}
                            checkOut={this.state.checkOut}
                        />
                    )
                }


                <div className="property-details__price">

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

                </div>

            </article>
        );

    };
};