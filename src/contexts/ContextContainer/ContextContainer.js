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

                            <PropertyContext.Consumer>

                                { propertyContext => (

                                    <AmenityContext.Consumer>

                                        { amenityContext => (

                                            <InquiryContext.Consumer>

                                                { inquiryContext => (

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

                                            </InquiryContext.Consumer>

                                        )}

                                    </AmenityContext.Consumer>

                                )}

                            </PropertyContext.Consumer>

                        </InquiryContextProvider>

                    </AmenityContextProvider>

                </PropertyContextProvider>

            </AuthContextProvider>
        );

    };

};