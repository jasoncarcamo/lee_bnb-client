import React from "react";

import AdminPaymentRequest from "../../services/AdminPaymentService";


const AdminPaymentContext = React.createContext({

    payments: {},

    paymentIds: [],

    paymentIdsByReservationId: {},

    isLoading: false,

    error: "",

    getPayments: ()=>Promise.resolve([])

});


export default AdminPaymentContext;


export class AdminPaymentContextProvider extends React.Component{

    state = {

        payments: {},

        paymentIds: [],

        paymentIdsByReservationId: {},

        isLoading: false,

        error: ""

    };


    getPayments = ()=>{

        this.setState({

            isLoading: true,

            error: ""

        });


        return AdminPaymentRequest
            .getAllPayments()
            .then(({payments}) => {
                const normalizedPayments = {};
                const paymentIds = [];
                const paymentIdsByReservationId = {};


                payments.forEach(payment => {

                    if(!payment || !payment.id){

                        return;

                    };


                    normalizedPayments[payment.id] = payment;

                    paymentIds.push(payment.id);


                    if(
                        !paymentIdsByReservationId[
                            payment.reservation_id
                        ]
                    ){

                        paymentIdsByReservationId[
                            payment.reservation_id
                        ] = [];

                    };


                    paymentIdsByReservationId[
                        payment.reservation_id
                    ].push(payment.id);

                });


                this.setState({

                    payments: normalizedPayments,

                    paymentIds,

                    paymentIdsByReservationId,

                    isLoading: false,

                    error: ""

                });


                return payments;

            })
            .catch(error => {

                this.setState({

                    isLoading: false,

                    error: error?.error ||
                        error?.message ||
                        "Unable to load payments."

                });


                return Promise.reject(error);

            });

    };


    render(){

        return (

            <AdminPaymentContext.Provider

                value={{

                    ...this.state,

                    getPayments: this.getPayments

                }}

            >

                {this.props.children}

            </AdminPaymentContext.Provider>

        );

    };

};