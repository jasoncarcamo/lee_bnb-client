import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";
import CreateProperty from "./CreateProperty/CreateProperty";
import EditProperty from "./EditProperty/EditProperty";
import "./AdminProperties.css";


export default class AdminProperties extends React.Component{

    static contextType = AppContext;


    state = {
        showCreateProperty: false,
        selectedPropertyId: null,
    };
    
    openEditProperty = (propertyId)=>{
        console.log(
        "Selected property:",
        propertyId
    );
        this.setState({
            selectedPropertyId: propertyId
        });

    };


    closeEditProperty = ()=>{

        this.setState({
            selectedPropertyId: null
        });

    };

    formatTime = (time)=>{

    if(!time){

        return "";
    };


    const [
        hourValue,
        minute
    ] = time.split(":");


    const hour =
        Number(hourValue);


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    const formattedHour =
        hour % 12 || 12;


    return `${formattedHour}:${minute} ${period}`;

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


    renderAmenities(propertyId){

        const {
            amenityContext
        } = this.context;


        const {
            amenities,
            amenitiesByPropertyId
        } = amenityContext;


        const propertyAmenityIds =
            amenitiesByPropertyId[propertyId] || [];


        if(!propertyAmenityIds.length){

            return (
                <p className="admin-properties__no-amenities">
                    No amenities assigned
                </p>
            );

        };


        return (
            <div className="admin-properties__amenities">

                {
                    propertyAmenityIds.map(
                        amenityId => {

                            const amenity =
                                amenities[amenityId];


                            if(!amenity){

                                return null;

                            };


                            return (
                                <span
                                    className="admin-properties__amenity"
                                    key={amenity.id}
                                >
                                    {amenity.name}
                                </span>
                            );

                        }
                    )
                }

            </div>
        );

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
                                role="button"
                                tabIndex={propertyId}
                                onClick={
                                    ()=>this.openEditProperty(
                                        property.id
                                    )
                                }
                                onKeyDown={
                                    event => {

                                        if(
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ){

                                            event.preventDefault();

                                            this.openEditProperty(
                                                property.id
                                            );

                                        };

                                    }
                                }
                            >

                                <div className="admin-properties__card-header">

                                    <div>

                                        <div className="admin-properties__type">
                                            {property.property_type}
                                        </div>


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


                                {
                                    property.description &&
                                    <p className="admin-properties__description">
                                        {property.description}
                                    </p>
                                }


                                <div className="admin-properties__details">

                                    <p>

                                        <strong>
                                            {property.max_guests}
                                        </strong>
                                        {" "}
                                        <span>
                                            Guests
                                        </span>

                                    </p>


                                    <p>

                                        <strong>
                                            {property.bedrooms}
                                        </strong>
                                        {" "}
                                        <span>
                                            Bedrooms
                                        </span>

                                    </p>


                                    <p>

                                        <strong>
                                            {property.beds}
                                        </strong>
                                        {" "}
                                        <span>
                                            Beds
                                        </span>

                                    </p>


                                    <p>

                                        <strong>
                                            {property.bathrooms}
                                        </strong>
                                        {" "}
                                        <span>
                                            Bathrooms
                                        </span>

                                    </p>

                                </div>


                                <div className="admin-properties__info">

                                    <div className="admin-properties__amenities-section">

                                        <h4>
                                            Amenities
                                        </h4>

                                        {
                                            this.renderAmenities(
                                                property.id
                                            )
                                        }

                                    </div>


                                    <div className="admin-properties__stay-section">

                                        <h4>
                                            Stay details
                                        </h4>


                                        <div className="admin-properties__stay">

                                            <div>

                                                <span>
                                                    Check-in
                                                </span>

                                                <strong>
                                                    {
                                                        this.formatTime(
                                                            property.check_in_time
                                                        )
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Check-out
                                                </span>

                                                <strong>
                                                    {
                                                        this.formatTime(
                                                            property.check_out_time
                                                        )
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Minimum stay
                                                </span>

                                                <strong>

                                                    {property.minimum_nights}

                                                    {" "}

                                                    {
                                                        Number(
                                                            property.minimum_nights
                                                        ) === 1
                                                            ? "night"
                                                            : "nights"
                                                    }

                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="admin-properties__price">

                                    <div>

                                        <strong>
                                            ${property.base_price}
                                        </strong>

                                        <span>
                                            / night
                                        </span>

                                    </div>


                                    {
                                        property.instant_booking &&
                                        <span className="admin-properties__instant">
                                            Instant booking
                                        </span>
                                    }

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
                
                {
                    this.state.selectedPropertyId &&
                    <EditProperty
                        propertyId={
                            this.state.selectedPropertyId
                        }
                        handleClose={
                            this.closeEditProperty
                        }
                    />
                }
            </section>
        );

    };

};