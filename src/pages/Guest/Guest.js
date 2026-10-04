import React from "react";

import GuestHeader from "./GuestHeader/GuestHeader";
import GuestProperties from "./GuestProperties/GuestProperties";
import PropertyDetails from "./GuestProperties/GuestPropertyDetails/GuestPropertyDetails";

import "./Guest.css";


export default class Guest extends React.Component{

    state = {
        selectedPropertyId: null
    };


    selectProperty = (propertyId)=>{

        this.setState({
            selectedPropertyId: propertyId
        });

    };


    closeProperty = ()=>{

        this.setState({
            selectedPropertyId: null
        });

    };


    render(){

        const {
            selectedPropertyId
        } = this.state;


        return (
            <div className="guest">

                <GuestHeader/>


                <main className="guest__main">

                    {
                        selectedPropertyId
                            ? (
                                <PropertyDetails
                                    propertyId={
                                        selectedPropertyId
                                    }
                                    handleBack={
                                        this.closeProperty
                                    }
                                />
                            )
                            : (
                                <GuestProperties
                                    handleSelectProperty={
                                        this.selectProperty
                                    }
                                />
                            )
                    }

                </main>

            </div>
        );

    };
};