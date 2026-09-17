import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";

import CreateProperty from "./CreateProperty/CreateProperty";

import "./AdminProperties.css";


export default class AdminProperties extends React.Component{

    static contextType = AppContext;


    state = {
        showCreateProperty: false
    };


    openCreateProperty = ()=>{

        this.setState({
            showCreateProperty: true
        });

    };


    closeCreateProperty = ()=>{

        this.setState({
            showCreateProperty: false
        });

    };


    renderProperties(){

        const {
            propertyContext
        } = this.context;


        const {
            properties,
            propertyIds
        } = propertyContext;


        if(!propertyIds.length){

            return (
                <div className="admin-properties__empty">

                    <h3>
                        No properties
                    </h3>

                    <p>
                        No properties have been added yet.
                    </p>

                </div>
            );

        };


        return (
            <div className="admin-properties__grid">

                {
                    propertyIds.map( propertyId => {

                        const property =
                            properties[propertyId];


                        if(!property){

                            return null;

                        };


                        return (
                            <article
                                className="admin-properties__card"
                                key={property.id}
                            >

                                <div className="admin-properties__card-header">

                                    <div>

                                        <h3>
                                            {property.name}
                                        </h3>

                                        <p className="admin-properties__location">

                                            {
                                                [
                                                    property.city,
                                                    property.state,
                                                    property.country
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")
                                            }

                                        </p>

                                    </div>


                                    {
                                        property.status &&
                                        <span className="admin-properties__status">
                                            {property.status}
                                        </span>
                                    }

                                </div>


                                <div className="admin-properties__details">

                                    <p>
                                        <strong>
                                            Guests:
                                        </strong>

                                        {" "}

                                        {property.max_guests}
                                    </p>


                                    <p>
                                        <strong>
                                            Bedrooms:
                                        </strong>

                                        {" "}

                                        {property.bedrooms}
                                    </p>


                                    <p>
                                        <strong>
                                            Beds:
                                        </strong>

                                        {" "}

                                        {property.beds}
                                    </p>


                                    <p>
                                        <strong>
                                            Bathrooms:
                                        </strong>

                                        {" "}

                                        {property.bathrooms}
                                    </p>

                                </div>


                                <div className="admin-properties__price">

                                    <strong>
                                        ${property.base_price}
                                    </strong>

                                    <span>
                                        / night
                                    </span>

                                </div>

                            </article>
                        );

                    })
                }

            </div>
        );

    };


    render(){

        const {
            propertyContext
        } = this.context;


        const {
            isLoading,
            error
        } = propertyContext;


        return (
            <section className="admin-properties">

                <header className="admin-properties__header">

                    <div>

                        <h2>
                            Properties
                        </h2>

                        <p>
                            Manage your vacation rental properties.
                        </p>

                    </div>


                    <button
                        className="admin-properties__add"
                        type="button"
                        onClick={this.openCreateProperty}
                    >

                        <span aria-hidden="true">
                            +
                        </span>

                        Add property

                    </button>

                </header>


                {
                    isLoading
                        ? (
                            <div
                                className="admin-properties__loading"
                                role="status"
                            >
                                Loading properties...
                            </div>
                        )
                        : error
                            ? (
                                <div
                                    className="admin-properties__error"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )
                            : this.renderProperties()
                }


                {
                    this.state.showCreateProperty &&
                    <CreateProperty
                        handleClose={
                            this.closeCreateProperty
                        }
                    />
                }

            </section>
        );

    };
};