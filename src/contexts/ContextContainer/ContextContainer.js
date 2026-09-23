import React from "react";

import {
    AuthContextProvider
} from "../AuthContext";

import PropertyContext, {
    PropertyContextProvider
} from "../AppContext/PropertyContext";

import AmenityContext, {
    AmenityContextProvider
} from "../AppContext/AmenityContext";

import InquiryContext, {
    InquiryContextProvider
} from "../AppContext/InquiryContext";

import PropertyAvailabilityContext, {
    PropertyAvailabilityProvider
} from "../AppContext/PropertyAvailabilityContext";

import ReservationContext, {
    ReservationContextProvider
} from "../AppContext/ReservationContext";

import AdminGuestContext, {
    AdminGuestContextProvider
} from "../AppContext/AdminGuestContext";

import AdminPaymentContext, {
    AdminPaymentContextProvider
} from "../AppContext/AdminPaymentContext";

import {
    AppContextProvider
} from "../AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (

            <AuthContextProvider>

                <AdminPaymentContextProvider>

                    <AdminGuestContextProvider>

                        <PropertyContextProvider>

                            <AmenityContextProvider>

                                <InquiryContextProvider>

                                    <PropertyAvailabilityProvider>

                                        <ReservationContextProvider>

                                            <PropertyContext.Consumer>

                                                {propertyContext => (

                                                    <AmenityContext.Consumer>

                                                        {amenityContext => (

                                                            <InquiryContext.Consumer>

                                                                {inquiryContext => (

                                                                    <PropertyAvailabilityContext.Consumer>

                                                                        {propertyAvailabilityContext => (

                                                                            <ReservationContext.Consumer>

                                                                                {reservationContext => (

                                                                                    <AdminGuestContext.Consumer>

                                                                                        {adminGuestContext => (

                                                                                            <AdminPaymentContext.Consumer>

                                                                                                {adminPaymentContext => (

                                                                                                    <AppContextProvider

                                                                                                        propertyContext={
                                                                                                            propertyContext
                                                                                                        }

                                                                                                        amenityContext={
                                                                                                            amenityContext
                                                                                                        }

                                                                                                        inquiryContext={
                                                                                                            inquiryContext
                                                                                                        }

                                                                                                        propertyAvailabilityContext={
                                                                                                            propertyAvailabilityContext
                                                                                                        }

                                                                                                        reservationContext={
                                                                                                            reservationContext
                                                                                                        }

                                                                                                        adminGuestContext={
                                                                                                            adminGuestContext
                                                                                                        }

                                                                                                        adminPaymentContext={
                                                                                                            adminPaymentContext
                                                                                                        }

                                                                                                    >

                                                                                                        {this.props.children}

                                                                                                    </AppContextProvider>

                                                                                                )}

                                                                                            </AdminPaymentContext.Consumer>

                                                                                        )}

                                                                                    </AdminGuestContext.Consumer>

                                                                                )}

                                                                            </ReservationContext.Consumer>

                                                                        )}

                                                                    </PropertyAvailabilityContext.Consumer>

                                                                )}

                                                            </InquiryContext.Consumer>

                                                        )}

                                                    </AmenityContext.Consumer>

                                                )}

                                            </PropertyContext.Consumer>

                                        </ReservationContextProvider>

                                    </PropertyAvailabilityProvider>

                                </InquiryContextProvider>

                            </AmenityContextProvider>

                        </PropertyContextProvider>

                    </AdminGuestContextProvider>

                </AdminPaymentContextProvider>

            </AuthContextProvider>

        );

    };

};