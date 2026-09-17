import React from "react";

import AppContext from "../../../../../contexts/AppContext/AppContext";

import "./CreateProperty.css";


export default class CreateProperty extends React.Component{

    static contextType = AppContext;


    state = {
        name: "",
        slug: "",
        description: "",
        property_type: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "USA",
        max_guests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        check_in_time: "15:00",
        check_out_time: "11:00",
        minimum_nights: 1,
        base_price: "",
        cleaning_fee: 0,
        instant_booking: false,
        cancellation_policy: "",
        house_rules: "",
        status: "active",

        selectedAmenityIds: [],

        isSubmitting: false,
        error: "",
        success: ""
    };


    handleChange = (event)=>{

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        this.setState({
            [name]: type === "checkbox"
                ? checked
                : value,

            error: ""
        });

    };


    handleNameChange = (event)=>{

        const name = event.target.value;


        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");


        this.setState({
            name,
            slug,
            error: ""
        });

    };


    handleAmenityChange = (event)=>{

        const {
            value,
            checked
        } = event.target;


        this.setState( previousState => {

            const selectedAmenityIds =
                checked
                    ? previousState.selectedAmenityIds.includes(
                        value
                    )
                        ? previousState.selectedAmenityIds
                        : [
                            ...previousState.selectedAmenityIds,
                            value
                        ]
                    : previousState.selectedAmenityIds.filter(
                        amenityId =>
                            amenityId !== value
                    );


            return {
                selectedAmenityIds,
                error: ""
            };

        });

    };


    handleClose = ()=>{

        if(this.state.isSubmitting){

            return;

        };


        if(this.props.handleClose){

            this.props.handleClose();

        };

    };


    handleOverlayClick = (event)=>{

        if(event.target !== event.currentTarget){

            return;

        };


        this.handleClose();

    };


    handleSubmit = (event)=>{

        event.preventDefault();


        if(this.state.isSubmitting){

            return;

        };


        const {
            propertyContext,
            amenityContext
        } = this.context;


        const newProperty = {
            name:
                this.state.name.trim(),

            slug:
                this.state.slug.trim(),

            description:
                this.state.description.trim(),

            property_type:
                this.state.property_type.trim(),

            address_line_1:
                this.state.address_line_1.trim() || null,

            address_line_2:
                this.state.address_line_2.trim() || null,

            city:
                this.state.city.trim(),

            state:
                this.state.state.trim() || null,

            postal_code:
                this.state.postal_code.trim() || null,

            country:
                this.state.country.trim(),

            latitude: null,

            longitude: null,

            max_guests:
                Number(this.state.max_guests),

            bedrooms:
                Number(this.state.bedrooms),

            beds:
                Number(this.state.beds),

            bathrooms:
                Number(this.state.bathrooms),

            check_in_time:
                this.state.check_in_time,

            check_out_time:
                this.state.check_out_time,

            minimum_nights:
                Number(this.state.minimum_nights),

            base_price:
                Number(this.state.base_price),

            cleaning_fee:
                Number(this.state.cleaning_fee),

            currency: "USD",

            instant_booking:
                this.state.instant_booking,

            cancellation_policy:
                this.state.cancellation_policy.trim() || null,

            house_rules:
                this.state.house_rules.trim() || null,

            status:
                this.state.status
        };


        this.setState({
            isSubmitting: true,
            error: "",
            success: ""
        });


        propertyContext.createProperty(newProperty)
            .then( property => {

                const amenityRequests =
                    this.state.selectedAmenityIds.map(
                        amenityId => {

                            return amenityContext
                                .addAmenityToProperty(
                                    property.id,
                                    amenityId
                                );

                        }
                    );


                return Promise.all(
                    amenityRequests
                )
                    .then(()=>{

                        return property;

                    });

            })
            .then( property => {

                this.setState({
                    name: "",
                    slug: "",
                    description: "",
                    property_type: "",
                    address_line_1: "",
                    address_line_2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "USA",
                    max_guests: 1,
                    bedrooms: 1,
                    beds: 1,
                    bathrooms: 1,
                    check_in_time: "15:00",
                    check_out_time: "11:00",
                    minimum_nights: 1,
                    base_price: "",
                    cleaning_fee: 0,
                    instant_booking: false,
                    cancellation_policy: "",
                    house_rules: "",
                    status: "active",

                    selectedAmenityIds: [],

                    isSubmitting: false,
                    error: "",

                    success:
                        `${property.name} was created successfully.`
                });


                window.setTimeout(()=>{

                    this.handleClose();

                }, 1800);

            })
            .catch( error => {

                this.setState({
                    isSubmitting: false,

                    error:
                        error.error ||
                        "Unable to create property",

                    success: ""
                });

            });

    };


    renderAmenities(){

        const {
            amenityContext
        } = this.context;


        const {
            amenities,
            amenityIds
        } = amenityContext;


        if(!amenityIds.length){

            return (
                <p className="create-property__no-amenities">
                    No amenities have been created yet.
                </p>
            );

        };


        return amenityIds.map(
            amenityId => {

                const amenity = amenities[amenityId];

                if(!amenity){

                    return null;

                };


                const isSelected =
                    this.state.selectedAmenityIds.includes(
                        amenity.id
                    );


                return (
                    <label
                        className="create-property__amenity"
                        key={amenity.id}
                    >

                        <input
                            type="checkbox"
                            value={amenity.id}
                            checked={isSelected}
                            onChange={
                                this.handleAmenityChange
                            }
                        />


                        <span className="create-property__amenity-content">

                            <strong>
                                {amenity.name}
                            </strong>

                        </span>

                    </label>
                );

            }
        );

    };


    render(){

        const {
            isSubmitting,
            error,
            success
        } = this.state;


        return (
            <div
                className="create-property__overlay"
                onMouseDown={this.handleOverlayClick}
            >

                <section
                    className="create-property"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-property-title"
                >

                    <header className="create-property__header">

                        <div>

                            <h3 id="create-property-title">
                                Add a property
                            </h3>

                            <p>
                                Enter the details for your new listing.
                            </p>

                        </div>


                        <button
                            className="create-property__close"
                            type="button"
                            onClick={this.handleClose}
                            disabled={isSubmitting}
                            aria-label="Close create property"
                        >
                            ×
                        </button>

                    </header>


                    {
                        success &&
                        <div
                            className="create-property__success"
                            role="status"
                            aria-live="polite"
                        >

                            <span
                                className="create-property__success-icon"
                                aria-hidden="true"
                            >
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Property created
                                </strong>

                                <p>
                                    {success}
                                </p>

                            </div>

                        </div>
                    }


                    {
                        error &&
                        <div
                            className="create-property__error"
                            role="alert"
                        >
                            {error}
                        </div>
                    }


                    <form
                        className="create-property__form"
                        onSubmit={this.handleSubmit}
                    >

                        <fieldset disabled={isSubmitting}>

                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Basic information
                                    </h4>

                                    <p>
                                        Tell guests what kind of property this is.
                                    </p>

                                </div>


                                <div className="create-property__grid">

                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            Property name
                                        </span>

                                        <input
                                            type="text"
                                            name="name"
                                            value={this.state.name}
                                            onChange={this.handleNameChange}
                                            autoFocus
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Property type
                                        </span>

                                        <input
                                            type="text"
                                            name="property_type"
                                            value={this.state.property_type}
                                            onChange={this.handleChange}
                                            placeholder="House, apartment, condo..."
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            Description
                                        </span>

                                        <textarea
                                            name="description"
                                            value={this.state.description}
                                            onChange={this.handleChange}
                                            rows="5"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Location
                                    </h4>

                                    <p>
                                        Enter the address and location information.
                                    </p>

                                </div>


                                <div className="create-property__grid">

                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            Address
                                        </span>

                                        <input
                                            type="text"
                                            name="address_line_1"
                                            value={this.state.address_line_1}
                                            onChange={this.handleChange}
                                        />

                                    </label>


                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            Address line 2
                                        </span>

                                        <input
                                            type="text"
                                            name="address_line_2"
                                            value={this.state.address_line_2}
                                            onChange={this.handleChange}
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            City
                                        </span>

                                        <input
                                            type="text"
                                            name="city"
                                            value={this.state.city}
                                            onChange={this.handleChange}
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            State
                                        </span>

                                        <input
                                            type="text"
                                            name="state"
                                            value={this.state.state}
                                            onChange={this.handleChange}
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Postal code
                                        </span>

                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={this.state.postal_code}
                                            onChange={this.handleChange}
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Country
                                        </span>

                                        <input
                                            type="text"
                                            name="country"
                                            value={this.state.country}
                                            onChange={this.handleChange}
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Capacity
                                    </h4>

                                    <p>
                                        Set the sleeping and guest capacity.
                                    </p>

                                </div>


                                <div className="create-property__grid create-property__grid--numbers">

                                    <label className="create-property__field">

                                        <span>
                                            Guests
                                        </span>

                                        <input
                                            type="number"
                                            name="max_guests"
                                            value={this.state.max_guests}
                                            onChange={this.handleChange}
                                            min="1"
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Bedrooms
                                        </span>

                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={this.state.bedrooms}
                                            onChange={this.handleChange}
                                            min="0"
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Beds
                                        </span>

                                        <input
                                            type="number"
                                            name="beds"
                                            value={this.state.beds}
                                            onChange={this.handleChange}
                                            min="0"
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Bathrooms
                                        </span>

                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={this.state.bathrooms}
                                            onChange={this.handleChange}
                                            min="0.5"
                                            step="0.5"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Amenities
                                    </h4>

                                    <p>
                                        Select the amenities available at this property.
                                    </p>

                                </div>


                                <div className="create-property__amenities">

                                    {this.renderAmenities()}

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Stay details
                                    </h4>

                                    <p>
                                        Configure arrival, departure, and minimum stay.
                                    </p>

                                </div>


                                <div className="create-property__grid">

                                    <label className="create-property__field">

                                        <span>
                                            Check-in
                                        </span>

                                        <input
                                            type="time"
                                            name="check_in_time"
                                            value={this.state.check_in_time}
                                            onChange={this.handleChange}
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Check-out
                                        </span>

                                        <input
                                            type="time"
                                            name="check_out_time"
                                            value={this.state.check_out_time}
                                            onChange={this.handleChange}
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Minimum nights
                                        </span>

                                        <input
                                            type="number"
                                            name="minimum_nights"
                                            value={this.state.minimum_nights}
                                            onChange={this.handleChange}
                                            min="1"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Pricing
                                    </h4>

                                    <p>
                                        Set the default nightly rate and cleaning fee.
                                    </p>

                                </div>


                                <div className="create-property__grid">

                                    <label className="create-property__field">

                                        <span>
                                            Base price
                                        </span>

                                        <input
                                            type="number"
                                            name="base_price"
                                            value={this.state.base_price}
                                            onChange={this.handleChange}
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Cleaning fee
                                        </span>

                                        <input
                                            type="number"
                                            name="cleaning_fee"
                                            value={this.state.cleaning_fee}
                                            onChange={this.handleChange}
                                            min="0"
                                            step="0.01"
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__section">

                                <div className="create-property__section-heading">

                                    <h4>
                                        Policies
                                    </h4>

                                    <p>
                                        Configure booking and guest policies.
                                    </p>

                                </div>


                                <div className="create-property__grid">

                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            Cancellation policy
                                        </span>

                                        <textarea
                                            name="cancellation_policy"
                                            value={this.state.cancellation_policy}
                                            onChange={this.handleChange}
                                            rows="4"
                                        />

                                    </label>


                                    <label className="create-property__field create-property__field--full">

                                        <span>
                                            House rules
                                        </span>

                                        <textarea
                                            name="house_rules"
                                            value={this.state.house_rules}
                                            onChange={this.handleChange}
                                            rows="4"
                                        />

                                    </label>


                                    <label className="create-property__field">

                                        <span>
                                            Status
                                        </span>

                                        <select
                                            name="status"
                                            value={this.state.status}
                                            onChange={this.handleChange}
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                            <option value="draft">
                                                Draft
                                            </option>

                                        </select>

                                    </label>


                                    <label className="create-property__checkbox">

                                        <input
                                            type="checkbox"
                                            name="instant_booking"
                                            checked={this.state.instant_booking}
                                            onChange={this.handleChange}
                                        />

                                        <span>
                                            Allow instant booking
                                        </span>

                                    </label>

                                </div>

                            </div>


                            <div className="create-property__actions">

                                <button
                                    className="create-property__submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                >

                                    {
                                        isSubmitting
                                            ? (
                                                <>
                                                    <span
                                                        className="create-property__spinner"
                                                        aria-hidden="true"
                                                    />

                                                    Creating property...
                                                </>
                                            )
                                            : "Create property"
                                    }

                                </button>

                            </div>

                        </fieldset>

                    </form>

                </section>

            </div>
        );

    };

};