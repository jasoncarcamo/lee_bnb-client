import React from "react";

import "./CancelReservation.css";


export default class CancelReservation extends React.Component{

    formatCurrency = (
        amount,
        currency = "USD"
    )=>{

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
                currency: currency || "USD"
            }
        ).format(
            numericAmount
        );

    };


    render(){

        const {
            reservation,
            refundablePayment,
            remainingCents,
            cancellationReason,
            cancelError,
            isCancelling,
            onReasonChange,
            onGoBack,
            onConfirm
        } = this.props;


        if(!reservation){

            return null;

        };


        const hasRefund =
            refundablePayment &&
            remainingCents > 0;


        return (

            <div
                className="cancel-reservation__overlay"
                role="presentation"
            >

                <section
                    className="cancel-reservation"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="cancel-reservation-title"
                >

                    <h4 id="cancel-reservation-title">
                        Cancel reservation
                    </h4>


                    <p>

                        This will cancel reservation{" "}

                        <strong>
                            {reservation.confirmation_code}
                        </strong>.

                    </p>


                    {
                        hasRefund &&

                        <p>

                            The remaining{" "}

                            <strong>
                                {
                                    this.formatCurrency(
                                        remainingCents / 100,
                                        refundablePayment.currency
                                    )
                                }
                            </strong>{" "}

                            payment balance will also be
                            refunded.

                        </p>
                    }


                    {
                        !hasRefund &&

                        <p>
                            There is no remaining
                            refundable payment balance.
                            The reservation will still
                            be cancelled.
                        </p>
                    }


                    <div className="cancel-reservation__control">

                        <label htmlFor="reservation-cancellation-reason">
                            Cancellation reason
                        </label>

                        <textarea
                            id="reservation-cancellation-reason"
                            rows="3"
                            value={cancellationReason}
                            onChange={onReasonChange}
                            disabled={isCancelling}
                        />

                    </div>


                    {
                        cancelError &&

                        <p
                            className="cancel-reservation__error"
                            role="alert"
                        >
                            {cancelError}
                        </p>
                    }


                    {
                        isCancelling &&

                        <p
                            className="cancel-reservation__processing"
                            role="status"
                            aria-live="polite"
                        >
                            Cancelling reservation and
                            processing the remaining
                            refund. Please do not close
                            this window.
                        </p>
                    }


                    <div className="cancel-reservation__actions">

                        <button
                            type="button"
                            onClick={onGoBack}
                            disabled={isCancelling}
                        >
                            Go back
                        </button>


                        <button
                            type="button"
                            className="cancel-reservation__confirm"
                            onClick={onConfirm}
                            disabled={isCancelling}
                        >

                            {
                                isCancelling
                                    ? (
                                        <>

                                            <span
                                                className="cancel-reservation__spinner"
                                                aria-hidden="true"
                                            />

                                            Processing...

                                        </>
                                    )
                                    : (
                                        hasRefund
                                            ? "Cancel & refund"
                                            : "Cancel reservation"
                                    )
                            }

                        </button>

                    </div>

                </section>

            </div>

        );

    };

};