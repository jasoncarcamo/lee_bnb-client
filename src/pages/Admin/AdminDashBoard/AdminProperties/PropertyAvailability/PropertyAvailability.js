import React from "react";

import {
    PropertyAvailabilityContext
} from "../../../../../contexts/AppContext/PropertyAvailabilityContext";

import "./PropertyAvailability.css";


export default class PropertyAvailability extends React.Component {

    static contextType = PropertyAvailabilityContext;


    state = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        isLoading: false,
        savingDate: "",
        error: "",
        success: ""
    };


    requestId = 0;

    componentIsMounted = false;


    componentDidMount(){

        this.componentIsMounted = true;

        if(!this.isCreateMode()){

            this.loadMonth();

        };

    };


    componentDidUpdate(previousProps){

        if(
            previousProps.propertyId !== this.props.propertyId ||
            previousProps.mode !== this.props.mode
        ){

            this.requestId += 1;


            if(!this.isCreateMode()){

                this.loadMonth();

            }else{

                this.setState({
                    isLoading: false,
                    savingDate: "",
                    error: "",
                    success: ""
                });

            };

        };

    };


    componentWillUnmount(){

        this.componentIsMounted = false;

        this.requestId += 1;

    };


    isCreateMode = ()=>{

        return this.props.mode === "create";

    };


    formatDate = (year, month, day)=>{

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    isPastDate = date => {

        const today = new Date();

        const todayString = this.formatDate(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


        return date < todayString;

    };


    getCurrentMonth = ()=>{

        const {
            year,
            month
        } = this.state;


        const key = JSON.stringify([
            String(this.props.propertyId),
            year,
            month
        ]);


        return this.context.monthsByKey[key] || null;

    };


    loadMonth = ()=>{

        const propertyId = this.props.propertyId;

        const requestId = ++this.requestId;


        if(!propertyId){

            this.setState({
                isLoading: false,
                savingDate: "",
                error: "A property must be selected.",
                success: ""
            });

            return;

        };


        const {
            year,
            month
        } = this.state;


        this.setState({
            isLoading: true,
            savingDate: "",
            error: "",
            success: ""
        });


        this.context.loadMonth(
            propertyId,
            year,
            month
        )
            .then(() => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId
                ){

                    return;

                };


                this.setState({
                    isLoading: false,
                    error: ""
                });

            })
            .catch(error => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId
                ){

                    return;

                };


                this.setState({
                    isLoading: false,
                    error:
                        error.error ||
                        error.message ||
                        "Unable to load availability."
                });

            });

    };


    changeMonth = offset => {

        if(
            this.state.isLoading ||
            this.state.savingDate
        ){

            return;

        };


        const nextMonth = new Date(
            this.state.year,
            this.state.month + offset,
            1
        );


        this.setState({

            year: nextMonth.getFullYear(),

            month: nextMonth.getMonth()

        }, () => {

            if(!this.isCreateMode()){

                this.loadMonth();

            };

        });

    };


    handleDateClick = date => {

        if(
            this.state.isLoading ||
            this.state.savingDate ||
            this.isPastDate(date)
        ){

            return;

        };


        if(this.isCreateMode()){

            const blockedDates =
                this.props.blockedDates || [];


            const nextBlockedDates =
                blockedDates.includes(date)

                    ? blockedDates.filter(
                        blockedDate => blockedDate !== date
                    )

                    : [
                        ...blockedDates,
                        date
                    ];


            if(this.props.onBlockedDatesChange){

                this.props.onBlockedDatesChange(
                    nextBlockedDates
                );

            };


            return;

        };


        const currentMonth = this.getCurrentMonth();


        if(
            !currentMonth ||
            currentMonth.status !== "ready" ||
            currentMonth.reservedDates[date]
        ){

            return;

        };


        const existingAvailability =
            currentMonth.availabilityByDate[date];


        const isBlocked = !!(
            existingAvailability &&
            existingAvailability.is_available === false
        );


        const propertyId = this.props.propertyId;


        this.setState({
            savingDate: date,
            error: "",
            success: ""
        });


        const request = isBlocked

            ? this.context.unblockDate(
                propertyId,
                date
            )

            : this.context.blockDate(
                propertyId,
                date,
                existingAvailability
            );


        request
            .then(() => {

                if(
                    !this.componentIsMounted ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                this.setState({
                    savingDate: "",
                    error: "",
                    success: isBlocked
                        ? `${date} is available by default.`
                        : `${date} was blocked.`
                });

            })
            .catch(error => {

                if(
                    !this.componentIsMounted ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                this.setState({
                    savingDate: "",
                    error:
                        error.error ||
                        error.message ||
                        "Unable to update availability.",
                    success: ""
                });

            });

    };


    renderDays(){

        const {
            year,
            month,
            savingDate,
            isLoading
        } = this.state;


        const currentMonth = this.getCurrentMonth();

        const monthReady = !!(
            currentMonth &&
            currentMonth.status === "ready"
        );


        const availabilityByDate = monthReady
            ? currentMonth.availabilityByDate
            : {};


        const reservedDates = monthReady
            ? currentMonth.reservedDates
            : {};


        const firstWeekday = new Date(
            year,
            month,
            1
        ).getDay();


        const numberOfDays = new Date(
            year,
            month + 1,
            0
        ).getDate();


        const cells = [];


        for(
            let index = 0;
            index < firstWeekday;
            index++
        ){

            cells.push(

                <span
                    key={`empty-${index}`}
                    className="property-availability__empty"
                    aria-hidden="true"
                />

            );

        };


        for(
            let day = 1;
            day <= numberOfDays;
            day++
        ){

            const date = this.formatDate(
                year,
                month,
                day
            );


            const availability = this.isCreateMode()

                ? (
                    (this.props.blockedDates || []).includes(date)

                        ? {
                            date,
                            is_available: false
                        }

                        : null
                )

                : availabilityByDate[date];


            const isReserved =
                reservedDates[date] === true;


            const isPast = this.isPastDate(date);


            const isBlocked = !!(
                !isReserved &&
                availability &&
                availability.is_available === false
            );


            const status = isReserved

                ? "Reserved"

                : isBlocked

                    ? "Blocked"

                    : "Available";


            const isSaving =
                savingDate === date;


            const isDisabled = !!(
                isReserved ||
                savingDate ||
                isLoading ||
                (
                    !this.isCreateMode() &&
                    !monthReady
                )
            );


            cells.push(

                <button

                    key={date}

                    type="button"

                    className={
                        `property-availability__day ` +
                        `property-availability__day--${status.toLowerCase()}`
                    }

                    onClick={
                        () => this.handleDateClick(date)
                    }

                    disabled={isDisabled}

                    data-past={isPast}

                    aria-label={
                        `${date}: ${status}` +
                        (
                            isPast

                                ? ". Past date."

                                : isReserved

                                    ? ""

                                    : isBlocked

                                        ? ". Click to unblock."

                                        : ". Click to block."
                        )
                    }

                    title={
                        isReserved

                            ? "Reserved"

                            : isBlocked

                                ? "Unblock date"

                                : "Block date"
                    }

                >

                    <strong>
                        {day}
                    </strong>

                    <span>

                        {
                            isSaving

                                ? "Saving..."

                                : status
                        }

                    </span>

                </button>

            );

        };


        return cells;

    };


    render(){

        const {
            year,
            month,
            isLoading,
            savingDate,
            error,
            success
        } = this.state;


        const currentMonth = this.getCurrentMonth();


        const monthLabel = new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(
            new Date(year, month, 1)
        );


        return (

            <section
                className="property-availability"
                aria-label="Property availability"
            >

                <header className="property-availability__header">

                    <div>

                        <h4>
                            Availability
                        </h4>

                        <p>

                            {
                                this.isCreateMode()

                                    ? "Select dates to block before creating the property. Your selections will be saved when you click Create Property."

                                    : "Select an available date to block it. Select a blocked date to unblock it. Reserved nights cannot be changed here."
                            }

                        </p>

                    </div>

                </header>


                <div className="property-availability__navigation">

                    <button
                        type="button"
                        onClick={
                            () => this.changeMonth(-1)
                        }
                        disabled={
                            isLoading ||
                            !!savingDate
                        }
                        aria-label="Previous month"
                    >
                        ‹
                    </button>


                    <h5 aria-live="polite">
                        {monthLabel}
                    </h5>


                    <button
                        type="button"
                        onClick={
                            () => this.changeMonth(1)
                        }
                        disabled={
                            isLoading ||
                            !!savingDate
                        }
                        aria-label="Next month"
                    >
                        ›
                    </button>

                </div>


                <div className="property-availability__legend">

                    <span>

                        <i
                            className="property-availability__key property-availability__key--available"
                        />

                        Available

                    </span>


                    <span>

                        <i
                            className="property-availability__key property-availability__key--blocked"
                        />

                        Blocked

                    </span>


                    <span>

                        <i
                            className="property-availability__key property-availability__key--reserved"
                        />

                        Reserved

                    </span>

                </div>


                {
                    error &&

                    <p
                        className="property-availability__error"
                        role="alert"
                    >
                        {error}
                    </p>
                }


                {
                    success &&

                    <p
                        className="property-availability__success"
                        role="status"
                    >
                        {success}
                    </p>
                }


                {
                    isLoading

                        ? (

                            <p
                                className="property-availability__loading"
                                role="status"
                            >
                                Loading availability...
                            </p>

                        )

                        : (

                            <>

                                <div className="property-availability__weekdays">

                                    {
                                        [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ].map(weekday => {

                                            return (

                                                <span key={weekday}>
                                                    {weekday}
                                                </span>

                                            );

                                        })
                                    }

                                </div>


                                <div className="property-availability__calendar">

                                    {
                                        this.renderDays()
                                    }

                                </div>

                            </>

                        )
                }


                {
                    !this.isCreateMode() &&
                    !isLoading &&
                    currentMonth?.status !== "ready" &&
                    !error &&

                    <p
                        className="property-availability__error"
                        role="status"
                    >
                        Availability has not been loaded.
                    </p>
                }


                <p className="property-availability__note">

                    Reservation checkout dates are not
                    counted as occupied nights.

                </p>

            </section>

        );

    };

};