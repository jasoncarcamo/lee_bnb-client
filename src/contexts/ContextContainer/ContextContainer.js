import React from "react";

import {
    AuthContextProvider
} from "../AuthContext";
import {
    AppContextProvider
} from "../AppContext/AppContext";
import PropertyContext, {
    PropertyContextProvider
} from "../AppContext/PropertyContext";


export default class ContextContainer extends React.Component{

    render(){

        return (
            <AuthContextProvider>

                <PropertyContextProvider>

                    <PropertyContext.Consumer>

                        { propertyContext => (

                            <AppContextProvider
                                propertyContext={propertyContext}
                            >
                                {this.props.children}
                            </AppContextProvider>

                        )}

                    </PropertyContext.Consumer>

                </PropertyContextProvider>

            </AuthContextProvider>
        );

    };
};