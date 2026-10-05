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

import AdminRefundContext, {
    AdminRefundContextProvider
} from "../AppContext/AdminRefundContext";

import GuestAuthContext, {
    GuestAuthProvider
} from "../AppContext/GuestAuthContext";

import {
    AppContextProvider
} from "../AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (

            <AuthContextProvider>

                <GuestAuthProvider>

                    <AdminPaymentContextProvider>

                        <AdminGuestContextProvider>

                            <PropertyContextProvider>

                                <AmenityContextProvider>

                                    <InquiryContextProvider>

                                        <PropertyAvailabilityProvider>

                                            <ReservationContextProvider>

                                                <AdminRefundContextProvider>

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

                                                                                                            <AdminRefundContext.Consumer>

                                                                                                                {adminRefundContext => (

                                                                                                                    <GuestAuthContext.Consumer>

                                                                                                                        {guestAuthContext => (

                                                                                                                            <AppContextProvider
                                                                                                                                propertyContext={propertyContext}
                                                                                                                                amenityContext={amenityContext}
                                                                                                                                inquiryContext={inquiryContext}
                                                                                                                                propertyAvailabilityContext={propertyAvailabilityContext}
                                                                                                                                reservationContext={reservationContext}
                                                                                                                                adminGuestContext={adminGuestContext}
                                                                                                                                adminPaymentContext={adminPaymentContext}
                                                                                                                                adminRefundContext={adminRefundContext}
                                                                                                                                guestAuthContext={guestAuthContext}
                                                                                                                            >

                                                                                                                                {this.props.children}

                                                                                                                            </AppContextProvider>

                                                                                                                        )}

                                                                                                                    </GuestAuthContext.Consumer>

                                                                                                                )}

                                                                                                            </AdminRefundContext.Consumer>

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

                                                </AdminRefundContextProvider>

                                            </ReservationContextProvider>

                                        </PropertyAvailabilityProvider>

                                    </InquiryContextProvider>

                                </AmenityContextProvider>

                            </PropertyContextProvider>

                        </AdminGuestContextProvider>

                    </AdminPaymentContextProvider>

                </GuestAuthProvider>

            </AuthContextProvider>

        );

    };

};