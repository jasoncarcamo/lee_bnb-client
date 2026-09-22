import React from "react";


const AppContext = React.createContext({

    propertyContext: {},

    amenityContext: {},

    inquiryContext: {}

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
                this.props.inquiryContext

        };


        return (
            <AppContext.Provider value={value}>

                {this.props.children}

            </AppContext.Provider>
        );

    };

};