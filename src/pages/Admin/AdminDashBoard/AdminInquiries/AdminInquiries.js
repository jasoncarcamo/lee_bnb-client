
import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";
import InquiryStayCalendar from "./InquiryStayCalendar/InquiryStayCalendar";
import "./AdminInquiries.css";


const EMPTY_FORM = {
    first_name: "",
    email: "",
    property_id: "",
    check_in: "",
    check_out: "",
    guests_count: "",
    message: ""
};


const STATUS_LABELS = {
    new: "New",
    pending_confirmation: "Pending confirmation",
    confirmed: "Confirmed",
    canceled: "Canceled"
};


export default class AdminInquiries extends React.Component{

    static contextType = AppContext;


    state = {
        activeStatus: "all",
        search: "",
        selectedInquiryId: null,
        showForm: false,
        editingInquiryId: null,
        form: {...EMPTY_FORM},
        isSubmitting: false,
        busyInquiryId: null,
        deleteInquiryId: null,
        error: "",
        success: ""
    };
    
    successTimeout = null;


    showSuccess = (message)=>{

        clearTimeout(this.successTimeout);

        this.setState({
            success: message,
            error: ""
        });

        this.successTimeout = setTimeout(()=>{

            this.setState({
                success: ""
            });

            this.successTimeout = null;

        }, 2000);

    };


    componentDidMount(){

        this.loadInquiries();

    };
    
    componentWillUnmount(){

        clearTimeout(this.successTimeout);

    };


    loadInquiries = ()=>{

        this.context.inquiryContext
            .getInquiries()
            .catch( error => {

                console.error(
                    "Unable to load inquiries:",
                    error
                );

            });

    };


    getErrorMessage = (error, fallback)=>{

        if(typeof error === "string"){

            return error;

        };


        return error?.error ||
            error?.message ||
            fallback;

    };


    formatDate = (value)=>{

        if(!value){

            return "—";

        };


        const date = new Date(value);


        if(Number.isNaN(date.getTime())){

            return String(value);

        };


        return date.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        });

    };


    getPropertyName = (propertyId)=>{

        if(!propertyId){

            return "No property selected";

        };


        const property =
            this.context.propertyContext.properties[propertyId];


        return property
            ? property.name
            : "Property unavailable";

    };


    getInquiries = ()=>{

        const {
            inquiries,
            inquiryIds
        } = this.context.inquiryContext;


        const {
            activeStatus,
            search
        } = this.state;


        const searchValue =
            search.trim().toLowerCase();


        return inquiryIds
            .map( id => inquiries[id] )
            .filter(Boolean)
            .filter( inquiry => {

                return activeStatus === "all" ||
                    inquiry.status === activeStatus;

            })
            .filter( inquiry => {

                if(!searchValue){

                    return true;

                };


                const searchableText = [
                    inquiry.first_name,
                    inquiry.email,
                    inquiry.message,
                    this.getPropertyName(inquiry.property_id)
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                return searchableText.includes(searchValue);

            })
            .sort( (a, b) => {

                return new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime();

            });

    };


    getStatusCount = (status)=>{

        const {
            inquiries,
            inquiryIds
        } = this.context.inquiryContext;


        if(status === "all"){

            return inquiryIds.length;

        };


        return inquiryIds.filter( id => {

            const inquiry = inquiries[id];

            return inquiry &&
                inquiry.status === status;

        }).length;

    };


    handleStatusChange = (activeStatus)=>{

        this.setState({
            activeStatus
        });

    };


    handleSearchChange = (event)=>{

        this.setState({
            search: event.target.value
        });

    };


    openInquiry = (id)=>{

        this.setState({
            selectedInquiryId: id,
            error: "",
            success: ""
        });

    };


    closeInquiry = ()=>{

        if(this.state.busyInquiryId){

            return;

        };


        this.setState({
            selectedInquiryId: null,
            error: "",
            success: ""
        });

    };


    openCreateForm = ()=>{

        this.setState({
            showForm: true,
            editingInquiryId: null,
            form: {...EMPTY_FORM},
            error: "",
            success: ""
        });

    };


    openEditForm = (inquiry)=>{

        this.setState({
            showForm: true,
            editingInquiryId: inquiry.id,

            form: {
                first_name: inquiry.first_name || "",
                email: inquiry.email || "",
                property_id: inquiry.property_id || "",
                check_in: inquiry.check_in
                    ? String(inquiry.check_in).slice(0, 10)
                    : "",
                check_out: inquiry.check_out
                    ? String(inquiry.check_out).slice(0, 10)
                    : "",
                guests_count: inquiry.guests_count ?? "",
                message: inquiry.message || ""
            },

            error: "",
            success: ""
        });

    };


    closeForm = ()=>{

        if(this.state.isSubmitting){

            return;

        };


        this.setState({
            showForm: false,
            editingInquiryId: null,
            form: {...EMPTY_FORM},
            success: "",
            error: ""
        });

    };


    handleFormChange = (event)=>{

        const {
            name,
            value
        } = event.target;

        this.setState(previousState => ({

            form: {
                ...previousState.form,

                [name]: value,

                ...(name === "property_id"
                    ? {
                        check_in: "",
                        check_out: ""
                    }
                    : {}
                )
            },

            error: ""

        }));

    };


    handleStayChange = ({check_in, check_out})=>{

        this.setState(previousState => ({

            form: {
                ...previousState.form,
                check_in,
                check_out
            },

            error: ""

        }));

    };


    handleSubmit = (event)=>{

        event.preventDefault();


        if(this.state.isSubmitting){

            return;

        };


        const {
            editingInquiryId,
            form
        } = this.state;


        const payload = {
            first_name: form.first_name.trim(),
            email: form.email.trim(),
            property_id: form.property_id || null,
            check_in: form.check_in || null,
            check_out: form.check_out || null,
            guests_count: form.guests_count === ""
                ? null
                : Number(form.guests_count),
            message: form.message.trim()

        };


        if(
            !payload.first_name ||
            !payload.email ||
            !payload.message
        ){

            this.setState({
                error: "Name, email, and message are required."
            });

            return;

        };
        
        if(
            payload.check_in &&
            payload.check_out &&
            payload.check_out <= payload.check_in
        ){

            this.setState({
                error: "Check-out must be after check-in."
            });

            return;

        };


        if(
            payload.guests_count !== null &&
            (
                !Number.isInteger(payload.guests_count) ||
                payload.guests_count < 1
            )
        ){

            this.setState({
                error: "Number of guests must be at least 1."
            });

            return;

        };

        const {
            inquiryContext
        } = this.context;


        this.setState({
            isSubmitting: true,
            error: "",
            success: ""
        });


        const request = editingInquiryId
            ? inquiryContext.updateInquiry(
                editingInquiryId,
                payload
            )
            : inquiryContext.createInquiry(
                payload
            );


        request
            .then( inquiry => {

                this.setState({

                    isSubmitting: false,
                    showForm: false,
                    editingInquiryId: null,
                    form: {...EMPTY_FORM},

                    selectedInquiryId: inquiry.id,

                    success: editingInquiryId
                        ? "Inquiry updated successfully."
                        : "Inquiry created successfully.",

                    error: ""

                });
                
                window.setTimeout(()=>{
                    this.closeForm();
                    
                    this.setState({
                        success: ""
                    })
                }, 1800);

            })
            .catch( error => {

                this.setState({

                    isSubmitting: false,

                    error: this.getErrorMessage(
                        error,
                        "Unable to save inquiry."
                    )

                });

            });

    };


    handleSend = (inquiry)=>{

        if(this.state.busyInquiryId){

            return;

        };


        if(
            inquiry.status !== "new" &&
            inquiry.status !== "pending_confirmation"
        ){

            return;

        };


        this.setState({
            busyInquiryId: inquiry.id,
            error: "",
            success: ""
        });


        this.context.inquiryContext
            .sendInquiry(inquiry.id)
            .then(()=>{

                this.setState({

                    busyInquiryId: null,

                    success: inquiry.sent_at
                        ? "A new confirmation email was sent."
                        : "Confirmation email sent.",

                    error: ""

                });
                
                window.setTimeout(()=>{
                    this.closeForm();
                    
                    this.setState({
                        success: ""
                    })
                }, 1800);

            })
            .catch( error => {

                this.setState({

                    busyInquiryId: null,

                    error: this.getErrorMessage(
                        error,
                        "Unable to send confirmation email."
                    )

                });

            });

    };


    openDeleteConfirmation = (id)=>{

        this.setState({
            deleteInquiryId: id,
            error: "",
            success: ""
        });

    };


    closeDeleteConfirmation = ()=>{

        if(this.state.busyInquiryId){

            return;

        };


        this.setState({
            deleteInquiryId: null
        });

    };


    handleDelete = ()=>{

        const id = this.state.deleteInquiryId;


        if(!id || this.state.busyInquiryId){

            return;

        };


        this.setState({
            busyInquiryId: id,
            error: "",
            success: ""
        });


        this.context.inquiryContext
            .deleteInquiry(id)
            .then(()=>{

                this.setState({

                    busyInquiryId: null,
                    deleteInquiryId: null,
                    selectedInquiryId: null,

                    success: "Inquiry deleted successfully.",
                    error: ""

                });
                
                window.setTimeout(()=>{
                    this.closeForm();
                    this.closeInquiry();
                }, 1800);

            })
            .catch( error => {

                this.setState({

                    busyInquiryId: null,

                    error: this.getErrorMessage(
                        error,
                        "Unable to delete inquiry."
                    )

                });

            });

    };


    renderStatusFilters(){

        const statuses = [
            ["all", "All"],
            ["new", "New"],
            ["pending_confirmation", "Pending"],
            ["confirmed", "Confirmed"],
            ["canceled", "Canceled"]
        ];


        return (
            <div
                className="admin-inquiries__filters"
                role="group"
                aria-label="Filter inquiries by status"
            >

                {
                    statuses.map( ([status, label]) => (

                        <button
                            key={status}
                            type="button"
                            className={
                                this.state.activeStatus === status
                                    ? "admin-inquiries__filter admin-inquiries__filter--active"
                                    : "admin-inquiries__filter"
                            }
                            aria-pressed={
                                this.state.activeStatus === status
                            }
                            onClick={
                                ()=>this.handleStatusChange(status)
                            }
                        >

                            {label}

                            <span>
                                {this.getStatusCount(status)}
                            </span>

                        </button>

                    ))
                }

            </div>
        );

    };


    renderInquiries(){

        const inquiries = this.getInquiries();


        if(!inquiries.length){

            return (
                <div className="admin-inquiries__empty">

                    <h3>No inquiries found</h3>

                    <p>
                        Try another filter or create a new inquiry.
                    </p>

                </div>
            );

        };


        return (
            <div className="admin-inquiries__list">

                {
                    inquiries.map( inquiry => (

                        <article
                            className="admin-inquiries__card"
                            key={inquiry.id}
                        >

                            <div className="admin-inquiries__card-main">

                                <div className="admin-inquiries__card-top">

                                    <h3>
                                        {inquiry.first_name}
                                    </h3>

                                    <span
                                        className={
                                            `admin-inquiries__status admin-inquiries__status--${inquiry.status}`
                                        }
                                    >
                                        {
                                            STATUS_LABELS[inquiry.status] ||
                                            inquiry.status
                                        }
                                    </span>

                                </div>


                                <p className="admin-inquiries__email">
                                    {inquiry.email}
                                </p>


                                <p className="admin-inquiries__property">
                                    {
                                        this.getPropertyName(
                                            inquiry.property_id
                                        )
                                    }
                                </p>


                                <p className="admin-inquiries__message">
                                    {inquiry.message}
                                </p>


                                <p className="admin-inquiries__date">
                                    Received {
                                        this.formatDate(
                                            inquiry.created_at
                                        )
                                    }
                                </p>

                            </div>


                            <div className="admin-inquiries__card-actions">

                                <button
                                    type="button"
                                    onClick={
                                        ()=>this.openInquiry(inquiry.id)
                                    }
                                >
                                    View details
                                </button>

                            </div>

                        </article>

                    ))
                }

            </div>
        );

    };


    formatCurrency(amount, currency = "USD") {

        if (amount === null || amount === undefined) {

            return "—";

        }

        return new Intl.NumberFormat("en-US", {

            style: "currency",

            currency: currency || "USD"

        }).format(Number(amount));

    }

    renderInquiryDetails(){

        const {
            selectedInquiryId,
            busyInquiryId
        } = this.state;


        if(!selectedInquiryId){

            return null;

        };


        const inquiry =
            this.context.inquiryContext
                .inquiries[selectedInquiryId];


        if(!inquiry){

            return null;

        };


        const canSend =
            inquiry.status === "new" ||
            inquiry.status === "pending_confirmation";


        const isBusy =
            busyInquiryId === inquiry.id;

        return (
            <div className="admin-inquiries__overlay">

                <section
                    className="admin-inquiries__dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inquiry-details-title"
                >

                    <header className="admin-inquiries__dialog-header">

                        <div>

                            <h3 id="inquiry-details-title">
                                Inquiry details
                            </h3>

                            <p>
                                {inquiry.first_name}
                            </p>

                        </div>


                        <button
                            type="button"
                            className="admin-inquiries__close"
                            onClick={this.closeInquiry}
                            aria-label="Close inquiry details"
                            disabled={isBusy}
                        >
                            ×
                        </button>

                    </header>


                    <div className="admin-inquiries__dialog-body">

                        <span
                            className={
                                `admin-inquiries__status admin-inquiries__status--${inquiry.status}`
                            }
                        >
                            {
                                STATUS_LABELS[inquiry.status] ||
                                inquiry.status
                            }
                        </span>


                        <dl className="admin-inquiries__details">

                            <div>
                                <dt>Name</dt>
                                <dd>{inquiry.first_name}</dd>
                            </div>

                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={`mailto:${inquiry.email}`}>
                                        {inquiry.email}
                                    </a>
                                </dd>
                            </div>

                            <div>
                                <dt>Property</dt>
                                <dd>
                                    {
                                        this.getPropertyName(
                                            inquiry.property_id
                                        )
                                    }
                                </dd>
                            </div>
                            
                            <div>

                                <dt>Check-in</dt>

                                <dd>
                                    {
                                        this.formatDate(inquiry.check_in)
                                    }
                                </dd>

                            </div>


                            <div>

                                <dt>Check-out</dt>

                                <dd>
                                    {
                                        this.formatDate(inquiry.check_out)
                                    }
                                </dd>

                            </div>


                            <div>

                                <dt>Number of guests</dt>

                                <dd>
                                    {inquiry.guests_count ?? "—"}
                                </dd>

                            </div>
                            
                            {inquiry.quote && (
                                <>
                                    <div>
                                        <dt>Nights</dt>
                                        <dd>{inquiry.quote.nights}</dd>
                                    </div>

                                    <div>
                                        <dt>Nightly subtotal</dt>
                                        <dd>
                                            {this.formatCurrency(
                                                inquiry.quote.nightly_subtotal,
                                                inquiry.quote.currency
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Cleaning fee</dt>
                                        <dd>
                                            {this.formatCurrency(
                                                inquiry.quote.cleaning_fee,
                                                inquiry.quote.currency
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Service fee</dt>
                                        <dd>
                                            {this.formatCurrency(
                                                inquiry.quote.service_fee,
                                                inquiry.quote.currency
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Taxes</dt>
                                        <dd>
                                            {this.formatCurrency(
                                                inquiry.quote.taxes,
                                                inquiry.quote.currency
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Discount</dt>
                                        <dd>
                                            {this.formatCurrency(
                                                inquiry.quote.discount,
                                                inquiry.quote.currency
                                            )}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Total price</dt>
                                        <dd>
                                            <strong>
                                                {this.formatCurrency(
                                                    inquiry.quote.total_price,
                                                    inquiry.quote.currency
                                                )}
                                            </strong>
                                        </dd>
                                    </div>
                                </>
                            )}

                            <div>
                                <dt>Created by</dt>
                                <dd>
                                    {inquiry.created_by || "—"}
                                </dd>
                            </div>

                            <div>
                                <dt>Received</dt>
                                <dd>
                                    {
                                        this.formatDate(
                                            inquiry.created_at
                                        )
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt>Email sent</dt>
                                <dd>
                                    {
                                        this.formatDate(
                                            inquiry.sent_at
                                        )
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt>Customer responded</dt>
                                <dd>
                                    {
                                        this.formatDate(
                                            inquiry.responded_at
                                        )
                                    }
                                </dd>
                            </div>

                        </dl>


                        <div className="admin-inquiries__message-block">

                            <h4>Message</h4>

                            <p>
                                {inquiry.message}
                            </p>

                        </div>

                    </div>


                    <footer className="admin-inquiries__dialog-actions">

                        <button
                            type="button"
                            onClick={
                                ()=>this.openEditForm(inquiry)
                            }
                            disabled={isBusy}
                        >
                            Edit
                        </button>


                        {
                            canSend &&
                            <button
                                type="button"
                                className="admin-inquiries__primary"
                                onClick={
                                    ()=>this.handleSend(inquiry)
                                }
                                disabled={isBusy}
                            >
                                {
                                    isBusy
                                        ? "Sending..."
                                        : inquiry.sent_at
                                            ? "Resend email"
                                            : "Send email"
                                }
                            </button>
                        }


                        <button
                            type="button"
                            className="admin-inquiries__danger"
                            onClick={
                                ()=>this.openDeleteConfirmation(
                                    inquiry.id
                                )
                            }
                            disabled={isBusy}
                        >
                            Delete
                        </button>

                    </footer>

                </section>

            </div>
        );

    };


    renderForm(){

        const {
            showForm,
            editingInquiryId,
            form,
            isSubmitting
        } = this.state;


        if(!showForm){

            return null;

        };


        const {
            properties,
            propertyIds
        } = this.context.propertyContext;


        return (
            <div className="admin-inquiries__overlay">

                <section
                    className="admin-inquiries__dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inquiry-form-title"
                >

                    <header className="admin-inquiries__dialog-header">

                        <h3 id="inquiry-form-title">
                            {
                                editingInquiryId
                                    ? "Edit inquiry"
                                    : "Create inquiry"
                            }
                        </h3>


                        <button
                            type="button"
                            className="admin-inquiries__close"
                            onClick={this.closeForm}
                            disabled={isSubmitting}
                            aria-label="Close inquiry form"
                        >
                            ×
                        </button>

                    </header>


                    <form
                        className="admin-inquiries__form"
                        onSubmit={this.handleSubmit}
                    >

                        <fieldset disabled={isSubmitting}>

                            <label>

                                <span>Customer name</span>

                                <input
                                    type="text"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={this.handleFormChange}
                                    required
                                />

                            </label>


                            <label>

                                <span>Email</span>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={this.handleFormChange}
                                    required
                                />

                            </label>


                            <label>

                                <span>Property</span>

                                <select
                                    name="property_id"
                                    value={form.property_id}
                                    onChange={this.handleFormChange}
                                >

                                    <option value="">
                                        No property selected
                                    </option>

                                    {
                                        propertyIds.map( id => {

                                            const property =
                                                properties[id];


                                            if(!property){

                                                return null;

                                            };


                                            return (
                                                <option
                                                    key={id}
                                                    value={id}
                                                >
                                                    {property.name}
                                                </option>
                                            );

                                        })
                                    }

                                </select>

                            </label>

                            <InquiryStayCalendar
                                propertyId={form.property_id}
                                checkIn={form.check_in}
                                checkOut={form.check_out}
                                onChange={this.handleStayChange}
                            />


                            <label>

                                <span>Number of guests</span>

                                <input
                                    type="number"
                                    name="guests_count"
                                    value={form.guests_count}
                                    onChange={this.handleFormChange}
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                />

                            </label>

                            <label>

                                <span>Message</span>

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={this.handleFormChange}
                                    rows="5"
                                    required
                                />

                            </label>

                        </fieldset>


                        <footer className="admin-inquiries__dialog-actions">

                            <button
                                type="button"
                                onClick={this.closeForm}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="admin-inquiries__primary"
                                disabled={isSubmitting}
                            >
                                {
                                    isSubmitting
                                        ? "Saving..."
                                        : editingInquiryId
                                            ? "Save changes"
                                            : "Create inquiry"
                                }
                            </button>

                        </footer>

                    </form>

                </section>

            </div>
        );

    };


    renderDeleteConfirmation(){

        const {
            deleteInquiryId,
            busyInquiryId
        } = this.state;


        if(!deleteInquiryId){

            return null;

        };


        return (
            <div className="admin-inquiries__overlay">

                <section
                    className="admin-inquiries__dialog admin-inquiries__dialog--small"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="delete-inquiry-title"
                >

                    <header className="admin-inquiries__dialog-header">

                        <h3 id="delete-inquiry-title">
                            Delete inquiry?
                        </h3>

                    </header>


                    <p>
                        This will permanently remove the inquiry.
                        This action cannot be undone.
                    </p>


                    <footer className="admin-inquiries__dialog-actions">

                        <button
                            type="button"
                            onClick={this.closeDeleteConfirmation}
                            disabled={!!busyInquiryId}
                        >
                            Keep inquiry
                        </button>


                        <button
                            type="button"
                            className="admin-inquiries__danger"
                            onClick={this.handleDelete}
                            disabled={!!busyInquiryId}
                        >
                            {
                                busyInquiryId
                                    ? "Deleting..."
                                    : "Delete inquiry"
                            }
                        </button>

                    </footer>

                </section>

            </div>
        );

    };


    render(){

        const {
            isLoading,
            error
        } = this.context.inquiryContext;


        return (
            <section className="admin-inquiries">

                <header className="admin-inquiries__header">

                    <div>

                        <h2>Inquiries</h2>

                        <p>
                            Manage customer inquiries and
                            confirmation emails.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-inquiries__primary"
                        onClick={this.openCreateForm}
                    >
                        + Create inquiry
                    </button>

                </header>


                {
                    this.state.success &&
                    <p
                        className="admin-inquiries__success"
                        role="status"
                    >
                        {this.state.success}
                    </p>
                }


                {
                    (this.state.error || error) &&
                    <p
                        className="admin-inquiries__error"
                        role="alert"
                    >
                        {this.state.error || error}
                    </p>
                }


                <div className="admin-inquiries__toolbar">

                    {this.renderStatusFilters()}


                    <label className="admin-inquiries__search">

                        <span className="admin-inquiries__visually-hidden">
                            Search inquiries
                        </span>

                        <input
                            type="search"
                            placeholder="Search inquiries..."
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                        />

                    </label>

                </div>


                {
                    isLoading
                        ? (
                            <p
                                className="admin-inquiries__loading"
                                role="status"
                            >
                                Loading inquiries...
                            </p>
                        )
                        : this.renderInquiries()
                }


                {this.renderInquiryDetails()}

                {this.renderForm()}

                {this.renderDeleteConfirmation()}

            </section>
        );

    };

};