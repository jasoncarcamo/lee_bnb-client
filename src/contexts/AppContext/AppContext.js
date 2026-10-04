import React from "react";


const AppContext = React.createContext({

    propertyContext: {},

    amenityContext: {},

    inquiryContext: {},
    propertyAvailabilityContext: {},
    reservationContext: {},
    adminGuestContext: {},
    adminPaymentContext: {},
    adminRefundContext: {}
});


export default AppContext;


export class AppContextProvider extends React.Component{

    render(){

        const value = {

            propertyContext: this.props.propertyContext,
            amenityContext: this.props.amenityContext,
            inquiryContext: this.props.inquiryContext,
            propertyAvailabilityContext: this.props.propertyAvailabilityContext,
            reservationContext: this.props.reservationContext,
            adminGuestContext: this.props.adminGuestContext,
            adminPaymentContext: this.props.adminPaymentContext,
            adminRefundContext: this.props.adminRefundContext
        };


        return (
            <AppContext.Provider value={value}>

                {this.props.children}

            </AppContext.Provider>
        );

    };

};