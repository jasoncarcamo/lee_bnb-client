import React from "react";


const AppContext = React.createContext({

    propertyContext: {},

    amenityContext: {},

    inquiryContext: {},
    propertyAvailabilityContext: {},
    reservationContext: {},
    adminGuestContext: {},
    adminPaymentContext: {}

});


export default AppContext;


export class AppContextProvider extends React.Component{

    render(){

        const value = {

            propertyContext:
                this.props.propertyContext,

            amenityContext:
                this.props.amenityContext,

            inquiryContext:
                this.props.inquiryContext,
            propertyAvailabilityContext: this.propertyAvailabilityContext,
            reservationContext: this.props.reservationContext,
            adminGuestContext: this.props.adminGuestContext,
            adminPaymentContext: this.props.adminPaymentContext
        };


        return (
            <AppContext.Provider value={value}>

                {this.props.children}

            </AppContext.Provider>
        );

    };

};