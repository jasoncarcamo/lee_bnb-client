import React from "react";


const AppContext = React.createContext({});


export default AppContext;


export class AppContextProvider extends React.Component{
    render(){

        const value = {

        };

        return (
            <AppContext.Provider value={value}>
                {this.props.children}
            </AppContext.Provider>
        );

    };
};