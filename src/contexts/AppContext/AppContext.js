import React from "react";


const AppContext = React.createContext({

    propertyContext: {},

    amenityContext: {}

});


export default AppContext;


export class AppContextProvider extends React.Component{

    render(){

        const value = {

            propertyContext:
                this.props.propertyContext,

            amenityContext:
                this.props.amenityContext

        };


        return (
            <AppContext.Provider value={value}>

                {this.props.children}

            </AppContext.Provider>
        );

    };

};