import React from "react";

import InquiryRequest from "../../services/InquiryServices";


const InquiryContext = React.createContext({

    inquiries: {},
    inquiryIds: [],
    isLoading: false,
    error: "",

    getInquiries: ()=>{},
    getInquiryById: ()=>{},
    createInquiry: ()=>{},
    updateInquiry: ()=>{},
    sendInquiry: ()=>{},
    deleteInquiry: ()=>{}

});


export default InquiryContext;


export class InquiryContextProvider extends React.Component{

    state = {

        inquiries: {},
        inquiryIds: [],
        isLoading: false,
        error: ""

    };
    
    getReservationQuote = (request)=>{

        return InquiryRequest
            .getReservationQuote(request)
            .then( response => {

                return response.quote;

            });

    };

    normalizeInquiries = (inquiries)=>{

        const normalizedInquiries = {};
        const inquiryIds = [];


        inquiries.forEach( inquiry => {

            normalizedInquiries[inquiry.id] = inquiry;

            inquiryIds.push(
                inquiry.id
            );

        });


        return {

            inquiries: normalizedInquiries,
            inquiryIds

        };

    };


    getInquiries = ()=>{

        this.setState({

            isLoading: true,
            error: ""

        });


        return InquiryRequest.getAllInquiries()
            .then( response => {

                const normalizedData =
                    this.normalizeInquiries(
                        response.inquiries
                    );


                this.setState({

                    inquiries:
                        normalizedData.inquiries,

                    inquiryIds:
                        normalizedData.inquiryIds,

                    isLoading: false,

                    error: ""

                });


                return response.inquiries;

            })
            .catch( error => {

                this.setState({

                    isLoading: false,

                    error:
                        error.error ||
                        "Unable to load inquiries"

                });


                return Promise.reject(error);

            });

    };


    getInquiryById = (id)=>{

        const inquiry =
            this.state.inquiries[id];


        if(inquiry){

            return Promise.resolve(
                inquiry
            );

        };


        return InquiryRequest.getInquiryById(id)
            .then( response => {

                this.setInquiry(
                    response.inquiry
                );


                return response.inquiry;

            });

    };


    setInquiry = (inquiry)=>{

        this.setState( previousState => {

            const inquiryExists =
                !!previousState.inquiries[inquiry.id];


            const inquiries = {

                ...previousState.inquiries,

                [inquiry.id]: inquiry

            };


            const inquiryIds =
                inquiryExists
                    ? previousState.inquiryIds
                    : [
                        inquiry.id,
                        ...previousState.inquiryIds
                    ];


            return {

                inquiries,
                inquiryIds

            };

        });

    };


    createInquiry = (newInquiry)=>{

        return InquiryRequest.createInquiry(
            newInquiry
        )
            .then( response => {

                this.setInquiry(
                    response.inquiry
                );


                return response.inquiry;

            });

    };


    updateInquiry = (
        id,
        updatedInquiry
    )=>{

        return InquiryRequest.updateInquiry(
            id,
            updatedInquiry
        )
            .then( response => {

                this.setInquiry(
                    response.inquiry
                );


                return response.inquiry;

            });

    };


    sendInquiry = (id)=>{

        return InquiryRequest.sendInquiry(id)
            .then( response => {

                this.setInquiry(
                    response.inquiry
                );


                return response.inquiry;

            });

    };


    deleteInquiry = (id)=>{

        return InquiryRequest.deleteInquiry(id)
            .then( response => {

                this.setState( previousState => {

                    const inquiries = {

                        ...previousState.inquiries

                    };


                    delete inquiries[id];


                    const inquiryIds =
                        previousState.inquiryIds.filter(
                            inquiryId =>
                                inquiryId !== id
                        );


                    return {

                        inquiries,
                        inquiryIds

                    };

                });


                return response.inquiry;

            });

    };


    render(){

        const value = {

            inquiries: this.state.inquiries,

            inquiryIds: this.state.inquiryIds,

            isLoading: this.state.isLoading,

            error: this.state.error,

            getInquiries: this.getInquiries,

            getInquiryById: this.getInquiryById,

            createInquiry: this.createInquiry,

            updateInquiry: this.updateInquiry,

            sendInquiry: this.sendInquiry,

            deleteInquiry: this.deleteInquiry,
            getReservationQuote: this.getReservationQuote

        };


        return (

            <InquiryContext.Provider value={value}>

                {this.props.children}

            </InquiryContext.Provider>

        );

    };

};