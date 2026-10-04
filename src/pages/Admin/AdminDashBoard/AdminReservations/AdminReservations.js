import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";

import ReservationDetails from "./ReservationDetails/ReservationDetails";

import "./AdminReservations.css";


const STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
    expired: "Expired"
};


const TAB_LABELS = {
    all: "All",
    active: "Active",
    upcoming: "Upcoming",
    past: "Past",
    cancelled: "Cancelled"
};


export default class AdminReservations extends React.Component{

    static contextType = AppContext;


    state = {
        activeTab: "all",
        search: "",
        selectedReservationId: null,
        error: ""
    };


    componentDidMount(){

        this.loadReservations();
        this.loadGuests();
        this.loadPayments();

    };


    loadReservations = ()=>{

        this.context.reservationContext
            .getReservations()
            .catch(error => {

                console.error(
                    "Unable to load reservations:",
                    error
                );


                this.setState({
                    error: this.getErrorMessage(
                        error,
                        "Unable to load reservations."
                    )
                });

            });

    };


    loadGuests = ()=>{

        this.context.adminGuestContext
            .getGuests()
            .catch(error => {

                console.error(
                    "Unable to load guests:",
                    error
                );

            });

    };


    loadPayments = ()=>{

        this.context.adminPaymentContext
            .getPayments()
            .catch(error => {

                console.error(
                    "Unable to load payments:",
                    error
                );

            });

    };


    getErrorMessage = (error, fallback)=>{

        if(typeof error === "string"){

            return error;

        };


        return error?.error ||
            error?.message ||
            fallback;

    };


    getGuest = (guestId)=>{

        return this.context.adminGuestContext
            .guests[guestId] || null;

    };


    getPropertyName = (propertyId)=>{

        const {
            properties
        } = this.context.propertyContext;


        const property =
            properties[propertyId];


        return property
            ? property.name
            : "Property unavailable";

    };


    getReservationPayments = (reservationId)=>{

        const {
            payments,
            paymentIdsByReservationId
        } = this.context.adminPaymentContext;


        const ids =
            paymentIdsByReservationId[reservationId] || [];


        return ids
            .map(id => payments[id])
            .filter(Boolean);

    };


    getPaymentStatus = (reservationId)=>{

        const {
            isLoading,
            error
        } = this.context.adminPaymentContext;


        if(isLoading){

            return {
                label: "Checking payment",
                type: "checking"
            };

        };


        if(error){

            return {
                label: "Payment unavailable",
                type: "unknown"
            };

        };


        const payments =
            this.getReservationPayments(
                reservationId
            );


        if(!payments.length){

            return {
                label: "Not paid",
                type: "unpaid"
            };

        };


        const paidPayment =
            payments.find(
                payment =>
                    payment.status === "paid"
            );


        if(paidPayment){

            return {
                label: "Paid",
                type: "paid"
            };

        };


        const partiallyRefundedPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "partially_refunded"
            );


        if(partiallyRefundedPayment){

            return {
                label: "Partially refunded",
                type: "partially_refunded"
            };

        };


        const refundedPayment =
            payments.find(
                payment =>
                    payment.status === "refunded"
            );


        if(refundedPayment){

            return {
                label: "Refunded",
                type: "refunded"
            };

        };


        const pendingPayment =
            payments.find(
                payment =>
                    payment.status === "pending"
            );


        if(pendingPayment){

            return {
                label: "Payment pending",
                type: "pending"
            };

        };


        const latestPayment =
            payments[0];


        const labels = {
            failed: "Payment failed",
            cancelled: "Payment cancelled"
        };


        return {
            label:
                labels[latestPayment.status] ||
                latestPayment.status ||
                "Payment unavailable",

            type:
                latestPayment.status ||
                "unknown"
        };

    };


    getReservationPaymentStatus = (reservation)=>{

        const paymentStatus =
            this.getPaymentStatus(
                reservation.id
            );


        if(
            reservation.status !==
            "cancelled"
        ){

            return paymentStatus;

        };


        if(
            paymentStatus.type ===
            "unpaid"
        ){

            return {
                label: "Not paid",
                type: "unpaid"
            };

        };


        return paymentStatus;

    };


    getReservationCategory = (reservation)=>{

        if(
            reservation.status ===
            "cancelled"
        ){

            return "cancelled";

        };


        const today = new Date();

        const localToday = [
            today.getFullYear(),
            String(
                today.getMonth() + 1
            ).padStart(2, "0"),
            String(
                today.getDate()
            ).padStart(2, "0")
        ].join("-");


        const checkIn =
            reservation.check_in
                ? String(
                    reservation.check_in
                ).slice(0, 10)
                : null;


        const checkOut =
            reservation.check_out
                ? String(
                    reservation.check_out
                ).slice(0, 10)
                : null;


        if(
            checkIn &&
            checkIn > localToday
        ){

            return "upcoming";

        };


        if(
            checkIn &&
            checkOut &&
            checkIn <= localToday &&
            checkOut > localToday
        ){

            return "active";

        };


        if(
            checkOut &&
            checkOut <= localToday
        ){

            return "past";

        };


        return "active";

    };


    getReservations = ()=>{

        const {
            reservations,
            reservationIds
        } = this.context.reservationContext;


        const {
            activeTab,
            search
        } = this.state;


        const searchValue =
            search.trim().toLowerCase();


        const searchDigits =
            searchValue.replace(
                /\D/g,
                ""
            );


        return reservationIds

            .map(
                id => reservations[id]
            )

            .filter(Boolean)

            .filter(reservation => {

                if(activeTab === "all"){

                    return true;

                };


                return (
                    this.getReservationCategory(
                        reservation
                    ) === activeTab
                );

            })

            .filter(reservation => {

                if(!searchValue){

                    return true;

                };


                const guest =
                    this.getGuest(
                        reservation.guest_id
                    );


                const fullName =
                    guest
                        ? [
                            guest.first_name,
                            guest.last_name
                        ]
                            .filter(Boolean)
                            .join(" ")
                        : "";


                const searchableText = [

                    reservation.confirmation_code,

                    reservation.status,

                    reservation.id,

                    reservation.guest_id,

                    fullName,

                    guest?.email,

                    guest?.phone,

                    this.getPropertyName(
                        reservation.property_id
                    )

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const phoneDigits =
                    String(
                        guest?.phone || ""
                    ).replace(
                        /\D/g,
                        ""
                    );


                const matchesText =
                    searchableText.includes(
                        searchValue
                    );


                const matchesPhone =
                    searchDigits.length >= 3 &&
                    phoneDigits.includes(
                        searchDigits
                    );


                return (
                    matchesText ||
                    matchesPhone
                );

            })

            .sort((a, b) => {

                return (
                    new Date(
                        b.check_in
                    ).getTime() -
                    new Date(
                        a.check_in
                    ).getTime()
                );

            });

    };


    getTabCount = (tab)=>{

        const {
            reservations,
            reservationIds
        } = this.context.reservationContext;


        if(tab === "all"){

            return reservationIds
                .filter(
                    id => !!reservations[id]
                )
                .length;

        };


        return reservationIds
            .filter(id => {

                const reservation =
                    reservations[id];


                if(!reservation){

                    return false;

                };


                return (
                    this.getReservationCategory(
                        reservation
                    ) === tab
                );

            })
            .length;

    };


    formatStayDate = (value)=>{

        if(!value){

            return "—";

        };


        const datePart =
            String(value).slice(
                0,
                10
            );


        const date =
            new Date(
                `${datePart}T12:00:00`
            );


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return datePart;

        };


        return date.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    formatCurrency = (
        amount,
        currency = "USD"
    )=>{

        if(
            amount === null ||
            amount === undefined
        ){

            return "—";

        };


        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency:
                    currency || "USD"
            }
        ).format(
            Number(amount)
        );

    };


    openReservation = (id)=>{

        this.setState({
            selectedReservationId: id
        });

    };


    closeReservation = ()=>{

        this.setState({
            selectedReservationId: null
        });

    };


    renderTabs(){

        const tabs = [
            ["all", "All"],
            ["active", "Active"],
            ["upcoming", "Upcoming"],
            ["past", "Past"],
            ["cancelled", "Cancelled"]
        ];


        return (

            <div
                className="admin-reservations__filters"
                role="group"
                aria-label="Filter reservations"
            >

                {
                    tabs.map(
                        ([tab, label]) => (

                            <button
                                key={tab}
                                type="button"
                                className={
                                    this.state.activeTab === tab
                                        ? "admin-reservations__filter admin-reservations__filter--active"
                                        : "admin-reservations__filter"
                                }
                                aria-pressed={
                                    this.state.activeTab === tab
                                }
                                onClick={
                                    ()=>this.setState({
                                        activeTab: tab
                                    })
                                }
                            >

                                {label}

                                <span>
                                    {
                                        this.getTabCount(
                                            tab
                                        )
                                    }
                                </span>

                            </button>

                        )
                    )
                }

            </div>

        );

    };


    renderReservations(){

        const reservations =
            this.getReservations();


        if(!reservations.length){

            return (

                <div className="admin-reservations__empty">

                    <h3>
                        No reservations found
                    </h3>

                    <p>
                        Try another search or switch tabs.
                    </p>

                </div>

            );

        };


        return (

            <div className="admin-reservations__list">

                {
                    reservations.map(
                        reservation => {

                            const guest =
                                this.getGuest(
                                    reservation.guest_id
                                );


                            const guestName =
                                guest
                                    ? [
                                        guest.first_name,
                                        guest.last_name
                                    ]
                                        .filter(Boolean)
                                        .join(" ")
                                    : "Guest unavailable";


                            const paymentStatus =
                                this.getReservationPaymentStatus(
                                    reservation
                                );


                            return (

                                <article
                                    className="admin-reservations__card"
                                    key={reservation.id}
                                >

                                    <div className="admin-reservations__card-main">

                                        <div className="admin-reservations__card-top">

                                            <h3>
                                                {
                                                    this.getPropertyName(
                                                        reservation.property_id
                                                    )
                                                }
                                            </h3>


                                            <div className="admin-reservations__badges">

                                                <span
                                                    className={
                                                        `admin-reservations__status admin-reservations__status--${reservation.status}`
                                                    }
                                                >
                                                    {
                                                        STATUS_LABELS[
                                                            reservation.status
                                                        ] ||
                                                        reservation.status
                                                    }
                                                </span>


                                                <span
                                                    className={
                                                        `admin-reservations__payment admin-reservations__payment--${paymentStatus.type}`
                                                    }
                                                >
                                                    {
                                                        paymentStatus.label
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <p className="admin-reservations__guest">
                                            {guestName}
                                        </p>


                                        <p className="admin-reservations__code">
                                            {
                                                reservation.confirmation_code
                                            }
                                        </p>


                                        <p className="admin-reservations__date">

                                            {
                                                this.formatStayDate(
                                                    reservation.check_in
                                                )
                                            }

                                            {" — "}

                                            {
                                                this.formatStayDate(
                                                    reservation.check_out
                                                )
                                            }

                                        </p>


                                        <p className="admin-reservations__date">

                                            {
                                                reservation.guests_count
                                            } guests

                                            {" · "}

                                            {
                                                reservation.nights
                                            } nights

                                        </p>


                                        <p className="admin-reservations__total">

                                            {
                                                this.formatCurrency(
                                                    reservation.total_price,
                                                    reservation.currency
                                                )
                                            }

                                        </p>

                                    </div>


                                    <div className="admin-reservations__card-actions">

                                        <button
                                            type="button"
                                            onClick={
                                                ()=>this.openReservation(
                                                    reservation.id
                                                )
                                            }
                                        >
                                            View details
                                        </button>

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
        } = this.context.reservationContext;


        return (

            <section className="admin-reservations">

                <header className="admin-reservations__header">

                    <div>

                        <h2>
                            Reservations
                        </h2>

                        <p>
                            Manage active, upcoming, past and cancelled bookings.
                        </p>

                    </div>

                </header>


                {
                    (this.state.error || error) &&

                    <p
                        className="admin-reservations__error"
                        role="alert"
                    >
                        {
                            this.state.error ||
                            error
                        }
                    </p>
                }


                <div className="admin-reservations__toolbar">

                    {this.renderTabs()}


                    <label className="admin-reservations__search">

                        <span className="admin-reservations__visually-hidden">
                            Search reservations
                        </span>

                        <input
                            type="search"
                            placeholder="Search name, email, phone or confirmation..."
                            value={
                                this.state.search
                            }
                            onChange={
                                event =>
                                    this.setState({
                                        search:
                                            event.target.value
                                    })
                            }
                        />

                    </label>

                </div>


                {
                    isLoading
                        ? (
                            <p
                                className="admin-reservations__loading"
                                role="status"
                            >
                                Loading reservations...
                            </p>
                        )
                        : this.renderReservations()
                }


                <ReservationDetails
                    reservationId={
                        this.state.selectedReservationId
                    }
                    onClose={
                        this.closeReservation
                    }
                />

            </section>

        );

    };

};