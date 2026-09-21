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

import {
    AppContextProvider
} from "../AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (
            <AuthContextProvider>

                <PropertyContextProvider>

                    <AmenityContextProvider>

                        <PropertyContext.Consumer>

                            { propertyContext => (

                                <AmenityContext.Consumer>

                                    { amenityContext => (

                                        <AppContextProvider
                                            propertyContext={
                                                propertyContext
                                            }
                                            amenityContext={
                                                amenityContext
                                            }
                                        >

                                            {this.props.children}

                                        </AppContextProvider>

                                    )}

                                </AmenityContext.Consumer>

                            )}

                        </PropertyContext.Consumer>

                    </AmenityContextProvider>

                </PropertyContextProvider>

            </AuthContextProvider>
        );

    };

};