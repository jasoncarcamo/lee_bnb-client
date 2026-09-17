import React from "react";

import {
    AuthContextProvider
} from "../AuthContext";
import {
    AppContextProvider
} from "../AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (
            <AuthContextProvider>

                <AppContextProvider>
                    {this.props.children}
                </AppContextProvider>

            </AuthContextProvider>
        );

    };
};