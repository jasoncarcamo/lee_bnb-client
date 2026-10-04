import React from "react";

import InquiryRequest
    from "../../../../../services/InquiryServices";
import "./GuestInquiry.css";

export default class GuestInquiry extends React.Component{

    state = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        guestsCount: 1,
        message: "",

        isSubmitting: false,
        error: "",
        success: false
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
            property,
            checkIn,
            checkOut
        } = this.props;


        const {
            firstName,
            lastName,
            email,
            phone,
            guestsCount,
            message
        } = this.state;


        if(
            !property ||
            !checkIn ||
            !checkOut
        ){

            this.setState({
                error:
                    "Please select your check-in and check-out dates."
            });

            return;

        };


        const guestCount =
            Number(guestsCount);


        if(
            !Number.isInteger(guestCount) ||
            guestCount < 1
        ){

            this.setState({
                error:
                    "Please select a valid number of guests."
            });

            return;

        };


        if(
            guestCount >
            Number(property.max_guests)
        ){

            this.setState({
                error:
                    `This property allows a maximum of ${property.max_guests} guests.`
            });

            return;

        };


        const newInquiry = {

            property_id:
                property.id,

            first_name:
                firstName.trim(),

            last_name:
                lastName.trim() || null,

            email:
                email.trim(),

            phone:
                phone.trim() || null,

            subject:
                "Reservation Request",

            message:
                message.trim(),

            check_in:
                checkIn,

            check_out:
                checkOut,

            guests_count:
                guestCount

        };


        this.setState({
            isSubmitting: true,
            error: ""
        });


        InquiryRequest
            .createGuestInquiry(
                newInquiry
            )
            .then(()=>{

                this.setState({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    guestsCount: 1,
                    message: "",

                    isSubmitting: false,
                    success: true,
                    error: ""
                });

            })
            .catch(error => {

                this.setState({
                    isSubmitting: false,
                    error:
                        error.error ||
                        "Unable to submit your reservation request."
                });

            });

    };
    
    closeSuccess = ()=>{
        this.setState({
            success: false
        });

    };

    render(){

        const {
            property,
            checkIn,
            checkOut
        } = this.props;


        const {
            firstName,
            lastName,
            email,
            phone,
            guestsCount,
            message,
            isSubmitting,
            error,
            success
        } = this.state;

        return (
            <section
                className="guest-inquiry"
                aria-labelledby="guest-inquiry-title"
            >

                <div className="guest-inquiry__header">

                    <h2 id="guest-inquiry-title">
                        Request to book
                    </h2>

                    <p>
                        Complete your information to send
                        this reservation request.
                    </p>

                </div>


                <div className="guest-inquiry__stay">

                    <div>

                        <span>
                            Check-in
                        </span>

                        <strong>
                            {checkIn}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Check-out
                        </span>

                        <strong>
                            {checkOut}
                        </strong>

                    </div>

                </div>


                <form
                    className="guest-inquiry__form"
                    onSubmit={
                        this.handleSubmit
                    }
                >

                    <div className="guest-inquiry__row">

                        <div className="guest-inquiry__field">

                            <label htmlFor="guest-first-name">
                                First name
                            </label>

                            <input
                                id="guest-first-name"
                                name="firstName"
                                type="text"
                                value={firstName}
                                onChange={
                                    this.handleChange
                                }
                                autoComplete="given-name"
                                required
                            />

                        </div>


                        <div className="guest-inquiry__field">

                            <label htmlFor="guest-last-name">
                                Last name
                            </label>

                            <input
                                id="guest-last-name"
                                name="lastName"
                                type="text"
                                value={lastName}
                                onChange={
                                    this.handleChange
                                }
                                autoComplete="family-name"
                            />

                        </div>

                    </div>


                    <div className="guest-inquiry__field">

                        <label htmlFor="guest-email">
                            Email
                        </label>

                        <input
                            id="guest-email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={
                                this.handleChange
                            }
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="guest-inquiry__field">

                        <label htmlFor="guest-phone">
                            Phone
                        </label>

                        <input
                            id="guest-phone"
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={
                                this.handleChange
                            }
                            autoComplete="tel"
                        />

                    </div>


                    <div className="guest-inquiry__field">

                        <label htmlFor="guest-count">
                            Guests
                        </label>

                        <select
                            id="guest-count"
                            name="guestsCount"
                            value={guestsCount}
                            onChange={
                                this.handleChange
                            }
                            required
                        >

                            {
                                Array.from(
                                    {
                                        length:
                                            Number(
                                                property.max_guests
                                            )
                                    },
                                    (_, index)=>(
                                        <option
                                            key={index + 1}
                                            value={index + 1}
                                        >
                                            {index + 1}
                                        </option>
                                    )
                                )
                            }

                        </select>

                    </div>


                    <div className="guest-inquiry__field">

                        <label htmlFor="guest-message">
                            Message
                        </label>

                        <textarea
                            id="guest-message"
                            name="message"
                            value={message}
                            onChange={
                                this.handleChange
                            }
                            rows="5"
                            placeholder="Tell us anything we should know about your stay."
                            required
                        />

                    </div>


                    {
                        error &&
                        (
                            <p
                                className="guest-inquiry__error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )
                    }


                    <button
                        className="guest-inquiry__submit"
                        type="submit"
                        disabled={isSubmitting}
                    >

                        {
                            isSubmitting
                                ? "Submitting..."
                                : "Request to Book"
                        }

                    </button>

                </form>

                {
                    success &&
                    (
                        <div
                            className="guest-inquiry__confirmation-overlay"
                            role="presentation"
                        >

                            <div
                                className="guest-inquiry__confirmation"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="guest-inquiry-success-title"
                                aria-describedby="guest-inquiry-success-message"
                            >

                                <div
                                    className="guest-inquiry__confirmation-icon"
                                    aria-hidden="true"
                                >
                                    ✓
                                </div>

                                <h2 id="guest-inquiry-success-title">
                                    Request submitted
                                </h2>

                                <p id="guest-inquiry-success-message">
                                    Your reservation request has been
                                    sent successfully.
                                </p>

                                <p>
                                    We will contact you after your
                                    request has been reviewed.
                                </p>

                                <button
                                    type="button"
                                    className="guest-inquiry__confirmation-button"
                                    onClick={
                                        this.closeSuccess
                                    }
                                    autoFocus
                                >
                                    OK
                                </button>

                            </div>

                        </div>
                    )
                }
            </section>
        );

    };

};