import React from "react";

import AdminRefundRequest from "../../services/AdminRefundService";


const AdminRefundContext = React.createContext({

    refunds: {},

    refundIdsByPaymentId: {},

    isLoading: false,

    error: "",

    getRefundsByPaymentId: () => {},

    getRefundsForPayment: () => {},

    createRefund: () => {}

});


export default AdminRefundContext;


export class AdminRefundContextProvider extends React.Component {

    state = {

        refunds: {},

        refundIdsByPaymentId: {},

        isLoading: false,

        error: ""

    };


    setRefundsForPayment = (
        paymentId,
        refunds
    ) => {

        this.setState(previousState => {

            const normalizedRefunds = {
                ...previousState.refunds
            };


            const refundIds = [];


            refunds.forEach(refund => {

                normalizedRefunds[refund.id] =
                    refund;

                refundIds.push(
                    refund.id
                );

            });


            return {

                refunds:
                    normalizedRefunds,

                refundIdsByPaymentId: {

                    ...previousState.refundIdsByPaymentId,

                    [paymentId]:
                        refundIds

                }

            };

        });

    };


    getRefundsByPaymentId = (
        paymentId
    ) => {

        this.setState({

            isLoading: true,

            error: ""

        });


        return AdminRefundRequest
            .getRefundsByPaymentId(
                paymentId
            )
            .then(response => {

                const refunds =
                    response.refunds || [];


                this.setRefundsForPayment(
                    paymentId,
                    refunds
                );


                this.setState({

                    isLoading: false,

                    error: ""

                });


                return refunds;

            })
            .catch(error => {

                this.setState({

                    isLoading: false,

                    error:
                        error.error ||
                        "Unable to load refunds"

                });


                return Promise.reject(
                    error
                );

            });

    };


    getRefundsForPayment = (
        paymentId
    ) => {

        const refundIds =
            this.state
                .refundIdsByPaymentId[
                    paymentId
                ] || [];


        return refundIds
            .map(id =>
                this.state.refunds[id]
            )
            .filter(Boolean);

    };


    createRefund = (
        newRefund
    ) => {

        this.setState({

            isLoading: true,

            error: ""

        });


        return AdminRefundRequest
            .createRefund(
                newRefund
            )
            .then(response => {

                const refund =
                    response.refund;


                this.setState(
                    previousState => {

                        const currentIds =
                            previousState
                                .refundIdsByPaymentId[
                                    refund.payment_id
                                ] || [];


                        return {

                            refunds: {

                                ...previousState.refunds,

                                [refund.id]:
                                    refund

                            },

                            refundIdsByPaymentId: {

                                ...previousState
                                    .refundIdsByPaymentId,

                                [refund.payment_id]: [
                                    refund.id,
                                    ...currentIds
                                ]

                            },

                            isLoading: false,

                            error: ""

                        };

                    }
                );


                return refund;

            })
            .catch(error => {

                this.setState({

                    isLoading: false,

                    error:
                        error.error ||
                        "Unable to create refund"

                });


                return Promise.reject(
                    error
                );

            });

    };


    render() {

        const value = {

            refunds:
                this.state.refunds,

            refundIdsByPaymentId:
                this.state.refundIdsByPaymentId,

            isLoading:
                this.state.isLoading,

            error:
                this.state.error,

            getRefundsByPaymentId:
                this.getRefundsByPaymentId,

            getRefundsForPayment:
                this.getRefundsForPayment,

            createRefund:
                this.createRefund

        };


        return (

            <AdminRefundContext.Provider
                value={value}
            >

                {this.props.children}

            </AdminRefundContext.Provider>

        );

    }

}