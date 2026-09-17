import React from "react";

import {AppContextProvider} from "./AppContext/AppContext";


export default class ContextContainer extends React.Component{

    render(){

        return (
            <AppContextProvider>

                {this.props.children}

            </AppContextProvider>
        );

    };
};