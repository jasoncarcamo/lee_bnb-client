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

import {
    AppContextProvider
} from "../AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (
            <AuthContextProvider>

                <PropertyContextProvider>

                    <AmenityContextProvider>

                        <InquiryContextProvider>
                            
                            <PropertyAvailabilityProvider>

                                <PropertyContext.Consumer>

                                    { propertyContext => (

                                        <AmenityContext.Consumer>

                                            { amenityContext => (

                                                <InquiryContext.Consumer>

                                                    { inquiryContext => (
                                                        
                                                        
                                                        <PropertyAvailabilityContext.Consumer>
                                                            {PropertyAvailabilityContext => (
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
                                                                >

                                                                    {this.props.children}

                                                                </AppContextProvider>
                                                            )}
                                                        </PropertyAvailabilityContext.Consumer>

                                                    )}

                                                </InquiryContext.Consumer>

                                            )}

                                        </AmenityContext.Consumer>

                                    )}

                                </PropertyContext.Consumer>
                            
                            </PropertyAvailabilityProvider>

                        </InquiryContextProvider>

                    </AmenityContextProvider>

                </PropertyContextProvider>

            </AuthContextProvider>
        );

    };

};