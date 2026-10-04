import React from "react";

import AppContext from "../../../../../contexts/AppContext/AppContext";
import "./ReservationDetails.css";
import CancelReservation from "./CancelReservation/CancelReservation";


const STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
    expired: "Expired"
};


export default class ReservationDetails extends React.Component{

    static contextType = AppContext;


    state = {

        showPartialRefund: false,

        refundAmount: "",

        refundReason: "",

        isRefunding: false,

        refundError: "",

        showRefundConfirmation: false,

        pendingRefundAmount: "",

        showCancelConfirmation: false,

        cancellationReason: "",

        isCancelling: false,

        cancelError: ""

    };


    componentDidMount(){

        this.loadRefunds();

    };


    componentDidUpdate(previousProps){

        if(
            previousProps.reservationId !==
            this.props.reservationId
        ){

            this.loadRefunds();

        };

    };


    loadRefunds = ()=>{

        const reservation =
            this.getReservation();


        if(!reservation){

            return Promise.resolve([]);

        };


        const refundPayment =
            this.getRefundPayment(
                reservation.id
            );


        if(!refundPayment){

            return Promise.resolve([]);

        };


        return this.context
            .adminRefundContext
            .getRefundsByPaymentId(
                refundPayment.id
            )
            .catch(error => {

                console.error(
                    "Unable to load refunds:",
                    error
                );


                return [];

            });

    };


    getReservation = ()=>{

        const {
            reservationId
        } = this.props;


        if(!reservationId){

            return null;

        };


        return this.context
            .reservationContext
            .reservations[reservationId] ||
            null;

    };


    getGuest = (guestId)=>{

        return this.context
            .adminGuestContext
            .guests[guestId] ||
            null;

    };


    getPropertyName = (propertyId)=>{

        const property =
            this.context
                .propertyContext
                .properties[propertyId];


        return property
            ? property.name
            : "Property unavailable";

    };


    getReservationPayments = (
        reservationId
    )=>{

        const {
            payments,
            paymentIdsByReservationId
        } = this.context
            .adminPaymentContext;


        const ids =
            paymentIdsByReservationId[
                reservationId
            ] || [];


        return ids
            .map(id => payments[id])
            .filter(Boolean);

    };


    getPaymentStatus = (
        reservation
    )=>{

        const {
            isLoading,
            error
        } = this.context
            .adminPaymentContext;


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
                reservation.id
            );


        if(!payments.length){

            return {
                label: "Not paid",
                type: "unpaid"
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
                label:
                    "Partially refunded",

                type:
                    "partially_refunded"
            };

        };


        const refundedPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "refunded"
            );


        if(refundedPayment){

            return {
                label: "Refunded",
                type: "refunded"
            };

        };


        const paidPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "paid"
            );


        if(paidPayment){

            return {
                label: "Paid",
                type: "paid"
            };

        };


        const pendingPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "pending"
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

            failed:
                "Payment failed",

            cancelled:
                "Payment cancelled"

        };


        return {

            label:
                labels[
                    latestPayment.status
                ] ||
                latestPayment.status ||
                "Payment unavailable",

            type:
                latestPayment.status ||
                "unknown"

        };

    };


    /*
        PAYMENT WHOSE REFUND INFORMATION
        SHOULD BE DISPLAYED.

        THIS INCLUDES FULLY REFUNDED
        PAYMENTS SO THEIR REFUND HISTORY
        REMAINS VISIBLE.
    */
    getRefundPayment = (
        reservationId
    )=>{

        const payments =
            this.getReservationPayments(
                reservationId
            );


        const partiallyRefundedPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "partially_refunded"
            );


        if(partiallyRefundedPayment){

            return partiallyRefundedPayment;

        };


        const paidPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "paid"
            );


        if(paidPayment){

            return paidPayment;

        };


        const refundedPayment =
            payments.find(
                payment =>
                    payment.status ===
                    "refunded"
            );


        return refundedPayment || null;

    };


    /*
        PAYMENT THAT CAN RECEIVE ANOTHER
        REFUND.

        FULLY REFUNDED PAYMENTS ARE
        INTENTIONALLY EXCLUDED.
    */
    getRefundablePayment = (
        reservationId
    )=>{

        const refundPayment =
            this.getRefundPayment(
                reservationId
            );


        if(!refundPayment){

            return null;

        };


        if(
            refundPayment.status ===
                "paid" ||
            refundPayment.status ===
                "partially_refunded"
        ){

            return refundPayment;

        };


        return null;

    };


    getRefundSummary = (
        payment,
        refunds
    )=>{

        if(!payment){

            return {

                paymentAmountCents: 0,

                refundedCents: 0,

                remainingCents: 0

            };

        };


        const paymentAmountCents =
            Math.round(
                Number(payment.amount) *
                100
            );


        const refundedCents =
            refunds.reduce(
                (
                    total,
                    refund
                ) => {

                    return total +
                        Math.round(
                            Number(
                                refund.amount
                            ) * 100
                        );

                },
                0
            );


        const remainingCents =
            Math.max(
                0,

                paymentAmountCents -
                refundedCents
            );


        return {

            paymentAmountCents,

            refundedCents,

            remainingCents

        };

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


    formatDateTime = (value)=>{

        if(!value){

            return "—";

        };


        const date =
            new Date(value);


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return String(value);

        };


        return date.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short"
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


        const numericAmount =
            Number(amount);


        if(
            !Number.isFinite(
                numericAmount
            )
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
            numericAmount
        );

    };


    handleOverlayClick = (
        event
    )=>{

        if(
            this.state.isRefunding ||
            this.state.isCancelling
        ){

            return;

        };


        if(
            event.target ===
            event.currentTarget
        ){

            this.props.onClose();

        };

    };


    handleKeyDown = (
        event
    )=>{

        if(
            this.state.isRefunding ||
            this.state.isCancelling
        ){

            return;

        };


        if(event.key === "Escape"){

            this.props.onClose();

        };

    };


    /*
        PARTIAL REFUND
    */
    handleOpenPartialRefund = ()=>{

        this.setState({

            showPartialRefund: true,

            refundAmount: "",

            refundReason: "",

            refundError: ""

        });

    };


    handleClosePartialRefund = ()=>{

        if(this.state.isRefunding){

            return;

        };


        this.setState({

            showPartialRefund: false,

            showRefundConfirmation:
                false,

            refundAmount: "",

            pendingRefundAmount: "",

            refundReason: "",

            refundError: ""

        });

    };


    handleRefundAmountChange = (
        event
    )=>{

        this.setState({

            refundAmount:
                event.target.value,

            refundError: ""

        });

    };


    handleRefundReasonChange = (
        event
    )=>{

        this.setState({

            refundReason:
                event.target.value,

            refundError: ""

        });

    };


    handleContinuePartialRefund = (
        remainingCents
    )=>{

        const refundAmount =
            Number(
                this.state.refundAmount
            );


        const refundAmountCents =
            Math.round(
                refundAmount * 100
            );


        if(
            !Number.isFinite(
                refundAmount
            ) ||
            refundAmount <= 0
        ){

            this.setState({
                refundError:
                    "Enter a valid refund amount."
            });

            return;

        };


        if(
            Math.abs(
                refundAmount * 100 -
                refundAmountCents
            ) > 0.000001
        ){

            this.setState({
                refundError:
                    "Refund amount cannot have more than two decimal places."
            });

            return;

        };


        if(
            refundAmountCents >
            remainingCents
        ){

            this.setState({
                refundError:
                    "Refund amount cannot exceed the remaining refundable amount."
            });

            return;

        };


        if(
            refundAmountCents ===
            remainingCents
        ){

            this.setState({
                refundError:
                    "Use Cancel reservation if you need to cancel and refund the entire remaining balance."
            });

            return;

        };


        this.setState({

            showRefundConfirmation:
                true,

            pendingRefundAmount:
                (
                    refundAmountCents /
                    100
                ).toFixed(2),

            refundError: ""

        });

    };


    handleConfirmPartialRefund = (
        refundablePayment
    )=>{

        if(
            !refundablePayment ||
            this.state.isRefunding
        ){

            return;

        };


        const {
            adminRefundContext,
            adminPaymentContext
        } = this.context;


        this.setState({

            isRefunding: true,

            refundError: ""

        });


        const newRefund = {

            payment_id:
                refundablePayment.id,

            amount:
                this.state
                    .pendingRefundAmount,

            reason:
                this.state
                    .refundReason
                    .trim() ||
                null

        };


        adminRefundContext
            .createRefund(
                newRefund
            )
            .then(() => {

                return adminPaymentContext
                    .getPayments();

            })
            .then(() => {

                return adminRefundContext
                    .getRefundsByPaymentId(
                        refundablePayment.id
                    );

            })
            .then(() => {

                this.setState({

                    showPartialRefund:
                        false,

                    showRefundConfirmation:
                        false,

                    refundAmount: "",

                    pendingRefundAmount: "",

                    refundReason: "",

                    isRefunding: false,

                    refundError: ""

                });

            })
            .catch(error => {

                this.setState({

                    showRefundConfirmation:
                        false,

                    isRefunding: false,

                    refundError:
                        error?.error ||
                        error?.message ||
                        "Unable to process refund."

                });

            });

    };


    /*
        CANCEL RESERVATION
        + REFUND REMAINING BALANCE
    */
    handleOpenCancel = ()=>{

        this.setState({

            showCancelConfirmation:
                true,

            cancellationReason: "",

            cancelError: ""

        });

    };


    handleCloseCancel = ()=>{

        if(this.state.isCancelling){

            return;

        };


        this.setState({

            showCancelConfirmation:
                false,

            cancellationReason: "",

            cancelError: ""

        });

    };


    handleCancellationReasonChange = (
        event
    )=>{

        this.setState({

            cancellationReason:
                event.target.value,

            cancelError: ""

        });

    };


    handleCancelAndRefund = (
        reservation
    )=>{

        if(this.state.isCancelling){

            return;

        };


        const cancellationReason =
            this.state
                .cancellationReason
                .trim();


        if(!cancellationReason){

            this.setState({

                cancelError:
                    "Cancellation reason is required."

            });

            return;

        };


        const {
            reservationContext,
            adminPaymentContext,
            adminRefundContext
        } = this.context;


        this.setState({

            isCancelling: true,

            cancelError: ""

        });


        reservationContext
            .cancelReservationAndRefund(
                reservation.id,
                cancellationReason
            )
            .then(response => {

                return adminPaymentContext
                    .getPayments()
                    .then(() => response);

            })
            .then(response => {

                if(response.payment){

                    return adminRefundContext
                        .getRefundsByPaymentId(
                            response.payment.id
                        );

                };


                return [];

            })
            .then(() => {

                this.setState({

                    showCancelConfirmation:
                        false,

                    cancellationReason: "",

                    isCancelling: false,

                    cancelError: ""

                });

            })
            .catch(error => {

                this.setState({

                    isCancelling: false,

                    cancelError:
                        error?.error ||
                        error?.message ||
                        "Unable to cancel reservation."

                });

            });

    };


    render(){

        const reservation =
            this.getReservation();


        if(!reservation){

            return null;

        };


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
            this.getPaymentStatus(
                reservation
            );


        /*
            refundPayment is used for
            displaying refund information,
            including after a full refund.
        */
        const refundPayment =
            this.getRefundPayment(
                reservation.id
            );


        /*
            refundablePayment only exists
            while another refund can still
            be performed.
        */
        const refundablePayment =
            this.getRefundablePayment(
                reservation.id
            );


        const refunds =
            refundPayment
                ? this.context
                    .adminRefundContext
                    .getRefundsForPayment(
                        refundPayment.id
                    )
                : [];


        const refundSummary =
            this.getRefundSummary(
                refundPayment,
                refunds
            );


        const fields = [

            [
                "Payment status",
                paymentStatus.label
            ],

            [
                "Guest name",
                guestName
            ],

            [
                "Email",
                guest?.email || "—"
            ],

            [
                "Phone",
                guest?.phone || "—"
            ],

            [
                "Confirmation code",
                reservation
                    .confirmation_code
            ],

            [
                "Property",
                this.getPropertyName(
                    reservation.property_id
                )
            ],

            [
                "Guest ID",
                reservation.guest_id
            ],

            [
                "Check-in",
                this.formatStayDate(
                    reservation.check_in
                )
            ],

            [
                "Check-out",
                this.formatStayDate(
                    reservation.check_out
                )
            ],

            [
                "Guests",
                reservation.guests_count
            ],

            [
                "Nights",
                reservation.nights
            ],

            [
                "Nightly subtotal",
                this.formatCurrency(
                    reservation
                        .nightly_subtotal,
                    reservation.currency
                )
            ],

            [
                "Cleaning fee",
                this.formatCurrency(
                    reservation.cleaning_fee,
                    reservation.currency
                )
            ],

            [
                "Service fee",
                this.formatCurrency(
                    reservation.service_fee,
                    reservation.currency
                )
            ],

            [
                "Taxes",
                this.formatCurrency(
                    reservation.taxes,
                    reservation.currency
                )
            ],

            [
                "Discount",
                this.formatCurrency(
                    reservation.discount,
                    reservation.currency
                )
            ],

            [
                "Total price",
                this.formatCurrency(
                    reservation.total_price,
                    reservation.currency
                )
            ],

            [
                "Created",
                this.formatDateTime(
                    reservation.created_at
                )
            ],

            [
                "Cancelled",
                this.formatDateTime(
                    reservation.cancelled_at
                )
            ]

        ];


        const canCancel =
            reservation.status ===
                "pending" ||
            reservation.status ===
                "confirmed";


        return (

            <div
                className="reservation-details__overlay"
                onClick={
                    this.handleOverlayClick
                }
                onKeyDown={
                    this.handleKeyDown
                }
            >

                <section
                    className="reservation-details"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reservation-details-title"
                >

                    <header className="reservation-details__header">

                        <div>

                            <h3 id="reservation-details-title">
                                Reservation details
                            </h3>

                            <p>
                                {
                                    reservation
                                        .confirmation_code
                                }
                            </p>

                        </div>


                        <button
                            type="button"
                            className="reservation-details__close"
                            onClick={
                                this.props.onClose
                            }
                            disabled={
                                this.state.isRefunding ||
                                this.state.isCancelling
                            }
                            aria-label="Close reservation details"
                        >
                            ×
                        </button>

                    </header>


                    <div className="reservation-details__badges">

                        <span
                            className={
                                `reservation-details__status reservation-details__status--${reservation.status}`
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
                                `reservation-details__payment reservation-details__payment--${paymentStatus.type}`
                            }
                        >
                            {
                                paymentStatus.label
                            }
                        </span>

                    </div>


                    <dl className="reservation-details__fields">

                        {
                            fields.map(
                                ([label, value]) => (

                                    <div
                                        className="reservation-details__field"
                                        key={label}
                                    >

                                        <dt>
                                            {label}
                                        </dt>

                                        <dd>
                                            {
                                                value ??
                                                "—"
                                            }
                                        </dd>

                                    </div>

                                )
                            )
                        }

                    </dl>


                    {
                        refundPayment &&

                        <section
                            className="reservation-details__refund-summary"
                            aria-labelledby="reservation-refund-summary-title"
                        >

                            <h4 id="reservation-refund-summary-title">
                                Payment & refunds
                            </h4>


                            <dl>

                                <div>

                                    <dt>
                                        Original payment
                                    </dt>

                                    <dd>
                                        {
                                            this.formatCurrency(
                                                refundSummary
                                                    .paymentAmountCents /
                                                100,

                                                refundPayment
                                                    .currency
                                            )
                                        }
                                    </dd>

                                </div>


                                <div>

                                    <dt>
                                        Total refunded
                                    </dt>

                                    <dd>
                                        {
                                            this.formatCurrency(
                                                refundSummary
                                                    .refundedCents /
                                                100,

                                                refundPayment
                                                    .currency
                                            )
                                        }
                                    </dd>

                                </div>


                                <div>

                                    <dt>
                                        Remaining refundable
                                    </dt>

                                    <dd>
                                        {
                                            this.formatCurrency(
                                                refundSummary
                                                    .remainingCents /
                                                100,

                                                refundPayment
                                                    .currency
                                            )
                                        }
                                    </dd>

                                </div>

                            </dl>


                            {
                                refundablePayment &&
                                refundSummary
                                    .remainingCents >
                                    0 &&
                                canCancel &&

                                <div className="reservation-details__refund-actions">

                                    <button
                                        type="button"
                                        onClick={
                                            this.handleOpenPartialRefund
                                        }
                                        disabled={
                                            this.state.isRefunding ||
                                            this.state.isCancelling
                                        }
                                    >
                                        Partial refund
                                    </button>

                                </div>
                            }


                            {
                                this.state
                                    .showPartialRefund &&
                                refundablePayment &&

                                <div className="reservation-details__refund-form">

                                    <h5>
                                        Partial refund
                                    </h5>


                                    <div className="reservation-details__refund-control">

                                        <label htmlFor="partial-refund-amount">
                                            Refund amount
                                        </label>

                                        <input
                                            id="partial-refund-amount"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            max={
                                                (
                                                    refundSummary
                                                        .remainingCents /
                                                    100
                                                ).toFixed(2)
                                            }
                                            value={
                                                this.state
                                                    .refundAmount
                                            }
                                            onChange={
                                                this.handleRefundAmountChange
                                            }
                                            disabled={
                                                this.state
                                                    .isRefunding
                                            }
                                        />

                                    </div>


                                    <p className="reservation-details__refund-available">

                                        Remaining refundable:{" "}

                                        <strong>
                                            {
                                                this.formatCurrency(
                                                    refundSummary
                                                        .remainingCents /
                                                    100,

                                                    refundablePayment
                                                        .currency
                                                )
                                            }
                                        </strong>

                                    </p>


                                    <div className="reservation-details__refund-control">

                                        <label htmlFor="partial-refund-reason">
                                            Reason
                                        </label>

                                        <textarea
                                            id="partial-refund-reason"
                                            rows="3"
                                            value={
                                                this.state
                                                    .refundReason
                                            }
                                            onChange={
                                                this.handleRefundReasonChange
                                            }
                                            disabled={
                                                this.state
                                                    .isRefunding
                                            }
                                        />

                                    </div>


                                    {
                                        this.state
                                            .refundError &&

                                        <p
                                            className="reservation-details__refund-error"
                                            role="alert"
                                        >
                                            {
                                                this.state
                                                    .refundError
                                            }
                                        </p>
                                    }


                                    <div className="reservation-details__refund-form-actions">

                                        <button
                                            type="button"
                                            onClick={
                                                this.handleClosePartialRefund
                                            }
                                            disabled={
                                                this.state
                                                    .isRefunding
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            onClick={
                                                () =>
                                                    this.handleContinuePartialRefund(
                                                        refundSummary
                                                            .remainingCents
                                                    )
                                            }
                                            disabled={
                                                this.state
                                                    .isRefunding
                                            }
                                        >
                                            Continue refund
                                        </button>

                                    </div>

                                </div>
                            }

                        </section>
                    }


                    {
                        reservation.special_requests &&

                        <div className="reservation-details__message">

                            <h4>
                                Special requests
                            </h4>

                            <p>
                                {
                                    reservation
                                        .special_requests
                                }
                            </p>

                        </div>
                    }


                    {
                        reservation
                            .cancellation_reason &&

                        <div className="reservation-details__message">

                            <h4>
                                Cancellation reason
                            </h4>

                            <p>
                                {
                                    reservation
                                        .cancellation_reason
                                }
                            </p>

                        </div>
                    }


                    {
                        this.state
                            .showRefundConfirmation &&
                        refundablePayment &&

                        <div
                            className="reservation-details__refund-confirmation-overlay"
                            role="presentation"
                        >

                            <section
                                className="reservation-details__refund-confirmation"
                                role="alertdialog"
                                aria-modal="true"
                                aria-labelledby="refund-confirmation-title"
                            >

                                <h4 id="refund-confirmation-title">
                                    Confirm refund
                                </h4>


                                <p>

                                    You are about to refund{" "}

                                    <strong>
                                        {
                                            this.formatCurrency(
                                                this.state
                                                    .pendingRefundAmount,

                                                refundablePayment
                                                    .currency
                                            )
                                        }
                                    </strong>.

                                </p>


                                {
                                    this.state
                                        .refundReason
                                        .trim() &&

                                    <p>

                                        <strong>
                                            Reason:
                                        </strong>{" "}

                                        {
                                            this.state
                                                .refundReason
                                                .trim()
                                        }

                                    </p>
                                }


                                <p>
                                    Please confirm that you want
                                    to continue with this refund.
                                </p>


                                {
                                    this.state
                                        .isRefunding &&

                                    <p
                                        className="reservation-details__refund-processing"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        Processing your refund.
                                        Please do not close this
                                        window.
                                    </p>
                                }


                                <div className="reservation-details__refund-confirmation-actions">

                                    <button
                                        type="button"
                                        onClick={
                                            () =>
                                                this.setState({
                                                    showRefundConfirmation:
                                                        false
                                                })
                                        }
                                        disabled={
                                            this.state
                                                .isRefunding
                                        }
                                    >
                                        Go back
                                    </button>


                                    <button
                                        type="button"
                                        className="reservation-details__refund-confirm"
                                        onClick={
                                            () =>
                                                this.handleConfirmPartialRefund(
                                                    refundablePayment
                                                )
                                        }
                                        disabled={
                                            this.state
                                                .isRefunding
                                        }
                                    >

                                        {
                                            this.state
                                                .isRefunding
                                                ? (
                                                    <>

                                                        <span
                                                            className="reservation-details__spinner"
                                                            aria-hidden="true"
                                                        />

                                                        Processing refund...

                                                    </>
                                                )
                                                : "Confirm refund"
                                        }

                                    </button>

                                </div>

                            </section>

                        </div>
                    }


                    {
                        this.state.showCancelConfirmation &&

                        <CancelReservation
                            reservation={reservation}
                            refundablePayment={
                                refundablePayment
                            }
                            remainingCents={
                                refundSummary.remainingCents
                            }
                            cancellationReason={
                                this.state.cancellationReason
                            }
                            cancelError={
                                this.state.cancelError
                            }
                            isCancelling={
                                this.state.isCancelling
                            }
                            onReasonChange={
                                this.handleCancellationReasonChange
                            }
                            onGoBack={
                                this.handleCloseCancel
                            }
                            onConfirm={
                                () =>
                                    this.handleCancelAndRefund(
                                        reservation
                                    )
                            }
                        />
                    }

                    <footer className="reservation-details__actions">

                        {
                            canCancel &&

                            <button
                                type="button"
                                className="reservation-details__cancel-reservation"
                                onClick={
                                    this.handleOpenCancel
                                }
                                disabled={
                                    this.state
                                        .isCancelling ||
                                    this.state
                                        .isRefunding
                                }
                            >
                                {
                                    refundablePayment &&
                                    refundSummary
                                        .remainingCents >
                                        0
                                        ? "Cancel reservation & refund"
                                        : "Cancel reservation"
                                }
                            </button>
                        }


                        <button
                            type="button"
                            onClick={
                                this.props.onClose
                            }
                            disabled={
                                this.state
                                    .isCancelling ||
                                this.state
                                    .isRefunding
                            }
                        >
                            Close
                        </button>

                    </footer>

                </section>

            </div>

        );

    };

};