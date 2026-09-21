import React from "react";

import AppContext from "../../../../../contexts/AppContext/AppContext";
import PropertyAvailability from "../PropertyAvailability/PropertyAvailability";
import "./EditProperty.css";


export default class EditProperty extends React.Component{

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
        originalAmenityIds: [],
        isSubmitting: false,
        error: "",
        success: "",
        showDeleteConfirmation: false,
        isDeleting: false,
        deleteError: "",
        activeView: "details",
        isLoadingAmenities: true,
        amenitiesError: "",
    };


    componentDidMount(){

        const { amenityContext } = this.context;

        amenityContext
            .getAmenitiesByPropertyId(this.props.propertyId)
            .then( amenityIds => {

                this.setPropertyState(amenityIds);

                this.setState({
                    isLoadingAmenities: false,
                    amenitiesError: ""
                });

            })
            .catch( error => {

                this.setPropertyState([]);

                this.setState({
                    isLoadingAmenities: false,

                    amenitiesError:
                        error.error ||
                        "Unable to load this property's amenities."
                });

            });

    };


    setPropertyState = (amenityIds)=>{

        const {
            propertyContext,
        } = this.context;


        const property =
            propertyContext.properties[
                this.props.propertyId
            ];


        if(!property){

            return;

        };


        this.setState({
            name:
                property.name || "",

            slug:
                property.slug || "",

            description:
                property.description || "",

            property_type:
                property.property_type || "",

            address_line_1:
                property.address_line_1 || "",

            address_line_2:
                property.address_line_2 || "",

            city:
                property.city || "",

            state:
                property.state || "",

            postal_code:
                property.postal_code || "",

            country:
                property.country || "USA",

            max_guests:
                property.max_guests ?? 1,

            bedrooms:
                property.bedrooms ?? 1,

            beds:
                property.beds ?? 1,

            bathrooms:
                property.bathrooms ?? 1,

            check_in_time:
                this.normalizeTime(
                    property.check_in_time,
                    "15:00"
                ),

            check_out_time:
                this.normalizeTime(
                    property.check_out_time,
                    "11:00"
                ),

            minimum_nights:
                property.minimum_nights ?? 1,

            base_price:
                property.base_price ?? "",

            cleaning_fee:
                property.cleaning_fee ?? 0,

            instant_booking:
                property.instant_booking === true,

            cancellation_policy:
                property.cancellation_policy || "",

            house_rules:
                property.house_rules || "",

            status:
                property.status || "active",

            selectedAmenityIds:
                [...amenityIds],

            originalAmenityIds:
                [...amenityIds],

            error: "",
            success: ""
        });

    };


    normalizeTime = (time, fallback)=>{

        if(!time){

            return fallback;

        };


        return time.slice(0, 5);

    };


    handleChange = (event)=>{

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        this.setState({
            [name]:
                type === "checkbox"
                    ? checked
                    : value,

            error: ""
        });

    };


    handleNameChange = (event)=>{

        const name =
            event.target.value;


        const slug =
            name
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
                    ? previousState
                        .selectedAmenityIds
                        .includes(value)
                            ? previousState
                                .selectedAmenityIds
                            : [
                                ...previousState
                                    .selectedAmenityIds,
                                value
                            ]
                    : previousState
                        .selectedAmenityIds
                        .filter(
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

        if(
            this.state.isSubmitting ||
            this.state.isDeleting
        ){

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


    getAddedAmenityIds = ()=>{

        const originalAmenityIds =
            new Set(
                this.state.originalAmenityIds
            );


        return this.state
            .selectedAmenityIds
            .filter(
                amenityId =>
                    !originalAmenityIds.has(
                        amenityId
                    )
            );

    };


    getRemovedAmenityIds = ()=>{

        const selectedAmenityIds =
            new Set(
                this.state.selectedAmenityIds
            );


        return this.state
            .originalAmenityIds
            .filter(
                amenityId =>
                    !selectedAmenityIds.has(
                        amenityId
                    )
            );

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


        const property =
            propertyContext.properties[
                this.props.propertyId
            ];


        if(!property){

            this.setState({
                error:
                    "Unable to find this property."
            });

            return;

        };


        const updatedProperty = {
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

            latitude:
                property.latitude ?? null,

            longitude:
                property.longitude ?? null,

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

            currency:
                property.currency || "USD",

            instant_booking:
                this.state.instant_booking,

            cancellation_policy:
                this.state
                    .cancellation_policy
                    .trim() || null,

            house_rules:
                this.state
                    .house_rules
                    .trim() || null,

            status:
                this.state.status
        };


        const addedAmenityIds =
            this.getAddedAmenityIds();


        const removedAmenityIds =
            this.getRemovedAmenityIds();


        this.setState({
            isSubmitting: true,
            error: "",
            success: ""
        });


        propertyContext
            .updateProperty(
                property.id,
                updatedProperty
            )
            .then( updatedPropertyResponse => {

                const addRequests =
                    addedAmenityIds.map(
                        amenityId => {

                            return amenityContext
                                .addAmenityToProperty(
                                    property.id,
                                    amenityId
                                );

                        }
                    );


                const removeRequests =
                    removedAmenityIds.map(
                        amenityId => {

                            return amenityContext
                                .removeAmenityFromProperty(
                                    property.id,
                                    amenityId
                                );

                        }
                    );


                return Promise.all([
                    ...addRequests,
                    ...removeRequests
                ])
                    .then(()=>{

                        return updatedPropertyResponse;

                    });

            })
            .then( updatedPropertyResponse => {

                this.setState({
                    originalAmenityIds: [
                        ...this.state.selectedAmenityIds
                    ],

                    isSubmitting: false,
                    error: "",

                    success:
                        `${updatedPropertyResponse.name} was updated successfully.`
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
                        "Unable to update property",

                    success: ""
                });

            });

    };

    renderAssignedAmenities(){

        const { amenities } =
            this.context.amenityContext;

        const { selectedAmenityIds } =
            this.state;

        if(!selectedAmenityIds.length){

            return (
                <p className="edit-property__no-amenities">
                    No amenities assigned to this property.
                </p>
            );

        };

        return selectedAmenityIds.map( amenityId => {

            const amenity = amenities[amenityId];

            if(!amenity){

                return null;

            };

            return (
                <div
                    className="edit-property__assigned-amenity edit-property__amenity-chip"
                    key={amenityId}
                >

                    <span>{amenity.name}</span>

                    <button
                        type="button"
                        onClick={
                            ()=>this.handleRemoveAmenity(amenityId)
                        }
                        aria-label={`Remove ${amenity.name}`}
                        className="edit-property__amenity-remove"
                    >
                        Remove
                    </button>

                </div>
            );

        });

    };
    
    handleAddAmenity = (amenityId)=>{

        this.setState( previousState => ({

            selectedAmenityIds:
                previousState.selectedAmenityIds.includes(
                    amenityId
                )
                    ? previousState.selectedAmenityIds
                    : [
                        ...previousState.selectedAmenityIds,
                        amenityId
                    ]

        }));

    };

    renderAmenities = ()=>{

        const {
            amenities,
            amenityIds
        } = this.context.amenityContext;

        const {
            selectedAmenityIds,
            isSubmitting
        } = this.state;

        const assignedAmenities = selectedAmenityIds
            .map( id => amenities[id] )
            .filter(Boolean)
            .sort(
                (a, b) => a.name.localeCompare(b.name)
            );

        const availableAmenities = amenityIds
            .filter(
                id => !selectedAmenityIds.includes(id)
            )
            .map( id => amenities[id] )
            .filter(Boolean)
            .sort(
                (a, b) => a.name.localeCompare(b.name)
            );

        return (
            <div className="edit-property__amenity-manager">


                <div className="edit-property__amenity-group">

                    <h5>Available Amenities</h5>

                    <p>
                        Add amenities to this property.
                    </p>

                    <div className="edit-property__amenity-list">

                        {
                            availableAmenities.length
                                ? availableAmenities.map(
                                    amenity => (

                                        <button
                                            key={amenity.id}
                                            type="button"
                                            className="edit-property__amenity-add"
                                            onClick={
                                                () => this.handleAddAmenity(
                                                    amenity.id
                                                )
                                            }
                                            disabled={isSubmitting}
                                        >
                                            <span aria-hidden="true">
                                                +
                                            </span>

                                            {amenity.name}

                                        </button>

                                    )
                                )
                                : (
                                    <p className="edit-property__no-amenities">
                                        No additional amenities available.
                                    </p>
                                )
                        }

                    </div>

                </div>

            </div>
        );

    };
    
    openDeleteConfirmation = ()=>{

        this.setState({
            showDeleteConfirmation: true,
            deleteError: ""
        });

    };


    closeDeleteConfirmation = ()=>{

        if(this.state.isDeleting){

            return;

        };


        this.setState({
            showDeleteConfirmation: false,
            deleteError: ""
        });

    };


    handleDeleteProperty = ()=>{

        if(this.state.isDeleting){

            return;

        };


        const {
            propertyContext
        } = this.context;


        const propertyId =
            this.props.propertyId;


        const property =
            propertyContext.properties[
                propertyId
            ];


        if(!property){

            this.setState({
                deleteError:
                    "Unable to find this property."
            });

            return;

        };


        this.setState({
            isDeleting: true,
            deleteError: ""
        });


        propertyContext
            .deleteProperty(
                propertyId
            )
            .then(()=>{

                this.setState({
                    isDeleting: false,
                    showDeleteConfirmation: false
                });


                if(this.props.handleClose){

                    this.props.handleClose();

                };

            })
            .catch( error => {

                this.setState({
                    isDeleting: false,

                    deleteError:
                        error.error ||
                        "Unable to delete property."
                });

            });

    };

    handleViewChange = (activeView)=>{

        if(
            this.state.isSubmitting ||
            this.state.isDeleting
        ){

            return;

        };


        this.setState({
            activeView,
            error: "",
            success: ""
        });

    };
    
    handleRemoveAmenity = (amenityId)=>{

        this.setState( previousState => ({

            selectedAmenityIds:
                previousState.selectedAmenityIds.filter(
                    id => id !== amenityId
                ),

            error: ""

        }));

    };

    render(){

        const {
            propertyContext
        } = this.context;


        const property =
            propertyContext.properties[
                this.props.propertyId
            ];


        if(!property){

            return null;

        };


        const {
            isSubmitting,
            error,
            success
        } = this.state;


        return (
            <div
                className="edit-property__overlay"
                onMouseDown={
                    this.handleOverlayClick
                }
            >

                <section
                    className="edit-property"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-property-title"
                >

                    <header className="edit-property__header">

                        <div>

                            <h3 id="edit-property-title">
                                Edit property
                            </h3>

                            <p>
                                Update the details for {property.name}.
                            </p>

                        </div>


                        <button
                            className="edit-property__close"
                            type="button"
                            onClick={this.handleClose}
                            disabled={isSubmitting}
                            aria-label="Close edit property"
                        >
                            ×
                        </button>

                    </header>
                    
                    <nav
                        className="edit-property__views"
                        aria-label="Property editor sections"
                    >

                        <button
                            type="button"
                            className={
                                this.state.activeView === "details"
                                    ? "edit-property__view edit-property__view--active"
                                    : "edit-property__view"
                            }
                            onClick={
                                ()=>this.handleViewChange("details")
                            }
                            disabled={
                                this.state.isSubmitting ||
                                this.state.isDeleting
                            }
                            aria-current={
                                this.state.activeView === "details"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Details
                        </button>


                        <button
                            type="button"
                            className={
                                this.state.activeView === "availability"
                                    ? "edit-property__view edit-property__view--active"
                                    : "edit-property__view"
                            }
                            onClick={
                                ()=>this.handleViewChange("availability")
                            }
                            disabled={
                                this.state.isSubmitting ||
                                this.state.isDeleting
                            }
                            aria-current={
                                this.state.activeView === "availability"
                                    ? "page"
                                    : undefined
                            }
                        >
                            Availability
                        </button>

                    </nav>


                    {
                        success &&
                        <div
                            className="edit-property__success"
                            role="status"
                            aria-live="polite"
                        >

                            <span
                                className="edit-property__success-icon"
                                aria-hidden="true"
                            >
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Property updated
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
                            className="edit-property__error"
                            role="alert"
                        >
                            {error}
                        </div>
                    }
                    
                    

                    {
                    this.state.activeView === "details" &&
                    <form
                        className="edit-property__form"
                        onSubmit={this.handleSubmit}
                    >

                        <fieldset disabled={isSubmitting}>

                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Basic information
                                    </h4>

                                    <p>
                                        Update the property's listing information.
                                    </p>

                                </div>


                                <div className="edit-property__grid">

                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            Property name
                                        </span>

                                        <input
                                            type="text"
                                            name="name"
                                            value={this.state.name}
                                            onChange={
                                                this.handleNameChange
                                            }
                                            autoFocus
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Property type
                                        </span>

                                        <input
                                            type="text"
                                            name="property_type"
                                            value={
                                                this.state.property_type
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            placeholder="House, apartment, condo..."
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            Description
                                        </span>

                                        <textarea
                                            name="description"
                                            value={
                                                this.state.description
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            rows="5"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Location
                                    </h4>

                                    <p>
                                        Update the address and location information.
                                    </p>

                                </div>


                                <div className="edit-property__grid">

                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            Address
                                        </span>

                                        <input
                                            type="text"
                                            name="address_line_1"
                                            value={
                                                this.state.address_line_1
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                        />

                                    </label>


                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            Address line 2
                                        </span>

                                        <input
                                            type="text"
                                            name="address_line_2"
                                            value={
                                                this.state.address_line_2
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            City
                                        </span>

                                        <input
                                            type="text"
                                            name="city"
                                            value={this.state.city}
                                            onChange={
                                                this.handleChange
                                            }
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            State
                                        </span>

                                        <input
                                            type="text"
                                            name="state"
                                            value={this.state.state}
                                            onChange={
                                                this.handleChange
                                            }
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Postal code
                                        </span>

                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={
                                                this.state.postal_code
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Country
                                        </span>

                                        <input
                                            type="text"
                                            name="country"
                                            value={this.state.country}
                                            onChange={
                                                this.handleChange
                                            }
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Capacity
                                    </h4>

                                    <p>
                                        Update sleeping and guest capacity.
                                    </p>

                                </div>


                                <div className="edit-property__grid edit-property__grid--numbers">

                                    <label className="edit-property__field">

                                        <span>
                                            Guests
                                        </span>

                                        <input
                                            type="number"
                                            name="max_guests"
                                            value={
                                                this.state.max_guests
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="1"
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Bedrooms
                                        </span>

                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={
                                                this.state.bedrooms
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="0"
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Beds
                                        </span>

                                        <input
                                            type="number"
                                            name="beds"
                                            value={this.state.beds}
                                            onChange={
                                                this.handleChange
                                            }
                                            min="0"
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Bathrooms
                                        </span>

                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={
                                                this.state.bathrooms
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="0.5"
                                            step="0.5"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Amenities
                                    </h4>

                                </div>


                                {
                                    this.state.isLoadingAmenities
                                        ? (
                                            <p>Loading property amenities...</p>
                                        )
                                        : (
                                            <>
                                                {
                                                    this.state.amenitiesError &&
                                                    <p
                                                        className="edit-property__error"
                                                        role="alert"
                                                    >
                                                        {this.state.amenitiesError}
                                                    </p>
                                                }

                                                {
                                                    !this.state.amenitiesError &&
                                                    <>
                                                        <div className="edit-property__assigned-amenities">

                                                            {this.renderAssignedAmenities()}

                                                        </div>

                                                        <div className="edit-property__amenities">

                                                            {this.renderAmenities()}

                                                        </div>
                                                    </>
                                                }
                                            </>
                                        )
                                }

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Stay details
                                    </h4>

                                    <p>
                                        Update arrival, departure, and minimum stay.
                                    </p>

                                </div>


                                <div className="edit-property__grid">

                                    <label className="edit-property__field">

                                        <span>
                                            Check-in
                                        </span>

                                        <input
                                            type="time"
                                            name="check_in_time"
                                            value={
                                                this.state.check_in_time
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Check-out
                                        </span>

                                        <input
                                            type="time"
                                            name="check_out_time"
                                            value={
                                                this.state.check_out_time
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Minimum nights
                                        </span>

                                        <input
                                            type="number"
                                            name="minimum_nights"
                                            value={
                                                this.state.minimum_nights
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="1"
                                            required
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Pricing
                                    </h4>

                                    <p>
                                        Update the nightly rate and cleaning fee.
                                    </p>

                                </div>


                                <div className="edit-property__grid">

                                    <label className="edit-property__field">

                                        <span>
                                            Base price
                                        </span>

                                        <input
                                            type="number"
                                            name="base_price"
                                            value={
                                                this.state.base_price
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Cleaning fee
                                        </span>

                                        <input
                                            type="number"
                                            name="cleaning_fee"
                                            value={
                                                this.state.cleaning_fee
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            min="0"
                                            step="0.01"
                                        />

                                    </label>

                                </div>

                            </div>


                            <div className="edit-property__section">

                                <div className="edit-property__section-heading">

                                    <h4>
                                        Policies
                                    </h4>

                                    <p>
                                        Update booking and guest policies.
                                    </p>

                                </div>


                                <div className="edit-property__grid">

                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            Cancellation policy
                                        </span>

                                        <textarea
                                            name="cancellation_policy"
                                            value={
                                                this.state
                                                    .cancellation_policy
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            rows="4"
                                        />

                                    </label>


                                    <label className="edit-property__field edit-property__field--full">

                                        <span>
                                            House rules
                                        </span>

                                        <textarea
                                            name="house_rules"
                                            value={
                                                this.state.house_rules
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                            rows="4"
                                        />

                                    </label>


                                    <label className="edit-property__field">

                                        <span>
                                            Status
                                        </span>

                                        <select
                                            name="status"
                                            value={this.state.status}
                                            onChange={
                                                this.handleChange
                                            }
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


                                    <label className="edit-property__checkbox">

                                        <input
                                            type="checkbox"
                                            name="instant_booking"
                                            checked={
                                                this.state
                                                    .instant_booking
                                            }
                                            onChange={
                                                this.handleChange
                                            }
                                        />

                                        <span>
                                            Allow instant booking
                                        </span>

                                    </label>

                                </div>

                            </div>
                            
                            
                            {/*Delete propeerty section*/ }
                            <div className="edit-property__danger">

                                {
                                    !this.state.showDeleteConfirmation &&
                                    <button
                                        className="edit-property__delete"
                                        type="button"
                                        onClick={
                                            this.openDeleteConfirmation
                                        }
                                    >
                                        Delete property
                                    </button>
                                }


                                {
                                    this.state.showDeleteConfirmation &&
                                    <div className="edit-property__delete-confirmation">

                                        <div>

                                            <strong>
                                                Are you sure?
                                            </strong>

                                            <p>
                                                This action cannot be undone.
                                            </p>

                                        </div>


                                        {
                                            this.state.deleteError &&
                                            <p
                                                className="edit-property__delete-error"
                                                role="alert"
                                            >
                                                {this.state.deleteError}
                                            </p>
                                        }


                                        <div className="edit-property__delete-actions">

                                            <button
                                                type="button"
                                                className="edit-property__delete-cancel"
                                                onClick={
                                                    this.closeDeleteConfirmation
                                                }
                                                disabled={
                                                    this.state.isDeleting
                                                }
                                            >
                                                Keep property
                                            </button>


                                            <button
                                                type="button"
                                                className="edit-property__delete-confirm"
                                                onClick={
                                                    this.handleDeleteProperty
                                                }
                                                disabled={
                                                    this.state.isDeleting
                                                }
                                            >

                                                {
                                                    this.state.isDeleting
                                                        ? "Deleting..."
                                                        : "Yes, delete property"
                                                }

                                            </button>

                                        </div>

                                    </div>
                                }

                            </div>


                            <div className="edit-property__actions">

                                <button
                                    className="edit-property__cancel"
                                    type="button"
                                    onClick={this.handleClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>


                                <button
                                    className="edit-property__submit"
                                    type="submit"
                                    disabled={
                                        isSubmitting ||
                                        this.state.isLoadingAmenities ||
                                        Boolean(this.state.amenitiesError)
                                    }
                                >

                                    {
                                        isSubmitting
                                            ? (
                                                <>
                                                    <span
                                                        className="edit-property__spinner"
                                                        aria-hidden="true"
                                                    />

                                                    Saving changes...
                                                </>
                                            )
                                            : "Save changes"
                                    }

                                </button>

                            </div>

                        </fieldset>

                    </form>
                    }


                    {
                        this.state.activeView === "availability" &&
                        <div className="edit-property__availability">

                            <PropertyAvailability
                                propertyId={this.props.propertyId}
                            />

                        </div>
                    }

                </section>

            </div>
        );

    };

};