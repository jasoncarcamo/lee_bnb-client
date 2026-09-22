import React from "react";

import {
    PropertyAvailabilityContext
} from "../../../../../contexts/AppContext/PropertyAvailabilityContext";

import "./InquiryStayCalendar.css";


export default class InquiryStayCalendar extends React.Component {

    static contextType = PropertyAvailabilityContext;


    state = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        isLoading: false,
        isCheckingRange: false,
        error: ""
    };


    requestId = 0;

    componentIsMounted = false;


    componentDidMount(){

        this.componentIsMounted = true;

        if(this.props.propertyId){

            this.loadMonth();

        };

    };


    componentDidUpdate(previousProps){

        if(
            previousProps.propertyId !== this.props.propertyId
        ){

            this.requestId += 1;


            const today = new Date();


            this.setState({

                year: today.getFullYear(),

                month: today.getMonth(),

                isLoading: false,

                isCheckingRange: false,

                error: ""

            }, () => {

                if(this.props.propertyId){

                    this.loadMonth();

                };

            });

        };

    };


    componentWillUnmount(){

        this.componentIsMounted = false;

        this.requestId += 1;

    };


    formatDate = (year, month, day)=>{

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    getDateString = date => {

        return this.formatDate(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    };


    getToday = ()=>{

        return this.getDateString(
            new Date()
        );

    };


    getMonthKey = (propertyId, year, month)=>{

        return JSON.stringify([
            String(propertyId),
            year,
            month
        ]);

    };


    getCurrentMonth = ()=>{

        const {
            year,
            month
        } = this.state;


        const key = this.getMonthKey(
            this.props.propertyId,
            year,
            month
        );


        return this.context.monthsByKey[key] || null;

    };


    getBlockedDates = ()=>{

        const currentMonth = this.getCurrentMonth();

        const blockedDates = {};


        if(
            !currentMonth ||
            currentMonth.status !== "ready"
        ){

            return blockedDates;

        };


        Object.keys(
            currentMonth.availabilityByDate
        ).forEach(date => {

            const availability =
                currentMonth.availabilityByDate[date];


            if(
                availability &&
                availability.is_available === false
            ){

                blockedDates[date] = true;

            };

        });


        return blockedDates;

    };


    loadMonth = ()=>{

        const propertyId = this.props.propertyId;

        const requestId = ++this.requestId;


        if(!propertyId){

            this.setState({
                isLoading: false,
                isCheckingRange: false,
                error: ""
            });

            return;

        };


        const {
            year,
            month
        } = this.state;


        this.setState({
            isLoading: true,
            isCheckingRange: false,
            error: ""
        });


        this.context.loadMonth(
            propertyId,
            year,
            month
        )
            .then(monthData => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                if(
                    !monthData ||
                    monthData.status !== "ready"
                ){

                    this.setState({
                        isLoading: false,
                        error: "Availability needs to be reloaded."
                    });

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
                    requestId !== this.requestId ||
                    propertyId !== this.props.propertyId
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
            this.state.isCheckingRange
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

            month: nextMonth.getMonth(),

            error: ""

        }, this.loadMonth);

    };


    getDateAvailability = date => {

        const propertyId = this.props.propertyId;


        if(!propertyId){

            return {
                loaded: false,
                unavailable: true
            };

        };


        const [
            year,
            month
        ] = date.split("-").map(Number);


        const key = this.getMonthKey(
            propertyId,
            year,
            month - 1
        );


        const monthData =
            this.context.monthsByKey[key];


        if(
            !monthData ||
            monthData.status !== "ready"
        ){

            return {
                loaded: false,
                unavailable: true
            };

        };


        const availability =
            monthData.availabilityByDate[date];


        return {

            loaded: true,

            unavailable: !!(
                (
                    availability &&
                    availability.is_available === false
                ) ||
                monthData.reservedDates[date]
            )

        };

    };


    isUnavailable = date => {

        return this.getDateAvailability(
            date
        ).unavailable;

    };


    isRangeAvailable = (checkIn, checkOut)=>{

        if(
            !checkIn ||
            !checkOut ||
            checkOut <= checkIn
        ){

            return false;

        };


        const date = new Date(
            `${checkIn}T12:00:00`
        );


        // Check-out is exclusive.
        // Only the nights before check-out are checked.

        while(
            this.getDateString(date) < checkOut
        ){

            const night = this.getDateString(
                date
            );


            if(this.isUnavailable(night)){

                return false;

            };


            date.setDate(
                date.getDate() + 1
            );

        };


        return true;

    };


    isRangeAvailableFromMonths = (
        checkIn,
        checkOut,
        months
    )=>{

        if(
            !checkIn ||
            !checkOut ||
            checkOut <= checkIn
        ){

            return false;

        };


        const availabilityByDate = {};

        const reservedDates = {};


        for(
            let index = 0;
            index < months.length;
            index++
        ){

            const monthData = months[index];


            if(
                !monthData ||
                monthData.status !== "ready"
            ){

                return false;

            };


            Object.assign(
                availabilityByDate,
                monthData.availabilityByDate
            );


            Object.assign(
                reservedDates,
                monthData.reservedDates
            );

        };


        const date = new Date(
            `${checkIn}T12:00:00`
        );


        while(
            this.getDateString(date) < checkOut
        ){

            const night = this.getDateString(
                date
            );


            const availability =
                availabilityByDate[night];


            if(
                (
                    availability &&
                    availability.is_available === false
                ) ||
                reservedDates[night]
            ){

                return false;

            };


            date.setDate(
                date.getDate() + 1
            );

        };


        return true;

    };


    handleDateClick = date => {

        const {
            propertyId,
            checkIn,
            checkOut,
            onChange
        } = this.props;


        const currentMonth =
            this.getCurrentMonth();


        if(
            !propertyId ||
            typeof onChange !== "function" ||
            this.state.isLoading ||
            this.state.isCheckingRange ||
            !currentMonth ||
            currentMonth.status !== "ready" ||
            date < this.getToday()
        ){

            return;

        };


        // First click, or restart an existing selection.

        if(
            !checkIn ||
            checkOut ||
            date <= checkIn
        ){

            if(this.isUnavailable(date)){

                return;

            };


            // Cancel any older asynchronous selection.

            this.requestId += 1;


            this.setState({
                isCheckingRange: false,
                error: ""
            });


            onChange({
                check_in: date,
                check_out: ""
            });


            return;

        };


        // Second click: select check-out.
        //
        // The checkout day itself may be blocked or reserved.
        // Only the occupied nights must be available.

        const requestId = ++this.requestId;


        this.setState({
            isCheckingRange: true,
            error: ""
        });


        this.context.loadRange(
            propertyId,
            checkIn,
            date
        )
            .then(months => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId ||
                    propertyId !== this.props.propertyId ||
                    checkIn !== this.props.checkIn ||
                    this.props.checkOut
                ){

                    return;

                };


                const isAvailable =
                    this.isRangeAvailableFromMonths(
                        checkIn,
                        date,
                        months
                    );


                this.setState({
                    isCheckingRange: false,
                    error: isAvailable
                        ? ""
                        : "The selected stay includes unavailable nights."
                });


                if(!isAvailable){

                    return;

                };


                onChange({
                    check_in: checkIn,
                    check_out: date
                });

            })
            .catch(error => {

                if(
                    !this.componentIsMounted ||
                    requestId !== this.requestId ||
                    propertyId !== this.props.propertyId
                ){

                    return;

                };


                this.setState({
                    isCheckingRange: false,
                    error:
                        error.error ||
                        error.message ||
                        "Unable to check the selected stay."
                });

            });

    };


    renderDays(){

        const {
            year,
            month,
            isLoading,
            isCheckingRange
        } = this.state;


        const {
            checkIn,
            checkOut
        } = this.props;


        const currentMonth =
            this.getCurrentMonth();


        const monthReady = !!(
            currentMonth &&
            currentMonth.status === "ready"
        );


        const blockedDates =
            this.getBlockedDates();


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
                    className="inquiry-stay-calendar__empty"
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


            const isPast =
                date < this.getToday();


            const isReserved =
                !!reservedDates[date];


            const isBlocked =
                !!blockedDates[date];


            const isCheckIn =
                date === checkIn;


            const isCheckOut =
                date === checkOut;


            const isInRange = !!(
                checkIn &&
                checkOut &&
                date > checkIn &&
                date < checkOut
            );


            // A checkout candidate is allowed even if its
            // own date is blocked or reserved. The full
            // occupied-night range is checked on click.

            const isCheckoutCandidate = !!(
                checkIn &&
                !checkOut &&
                date > checkIn
            );


            const canSelect = !!(
                !isPast &&
                !isLoading &&
                !isCheckingRange &&
                monthReady &&
                (
                    isCheckoutCandidate ||
                    !this.isUnavailable(date)
                )
            );


            const status = isReserved

                ? "Reserved"

                : isBlocked

                    ? "Blocked"

                    : "Available";


            const classNames = [

                "inquiry-stay-calendar__day",

                `inquiry-stay-calendar__day--${status.toLowerCase()}`

            ];


            if(isCheckIn){

                classNames.push(
                    "inquiry-stay-calendar__day--check-in"
                );

            };


            if(isCheckOut){

                classNames.push(
                    "inquiry-stay-calendar__day--check-out"
                );

            };


            if(isInRange){

                classNames.push(
                    "inquiry-stay-calendar__day--range"
                );

            };


            cells.push(

                <button

                    key={date}

                    type="button"

                    className={
                        classNames.join(" ")
                    }

                    onClick={
                        () => this.handleDateClick(date)
                    }

                    disabled={!canSelect}

                    aria-pressed={
                        isCheckIn ||
                        isCheckOut
                    }

                    aria-label={
                        `${date}: ${status}` +
                        (
                            isCheckIn

                                ? ", check-in"

                                : isCheckOut

                                    ? ", check-out"

                                    : ""
                        )
                    }

                    title={
                        isCheckIn

                            ? "Check-in"

                            : isCheckOut

                                ? "Check-out"

                                : status
                    }

                >

                    <strong>
                        {day}
                    </strong>


                    <span>

                        {
                            isCheckIn

                                ? "Check-in"

                                : isCheckOut

                                    ? "Check-out"

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
            isCheckingRange,
            error
        } = this.state;


        const {
            propertyId,
            checkIn,
            checkOut
        } = this.props;


        const monthLabel = new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        ).format(
            new Date(year, month, 1)
        );


        if(!propertyId){

            return (

                <p className="inquiry-stay-calendar__notice">

                    Select a property to view available dates.

                </p>

            );

        };


        return (

            <section
                className="inquiry-stay-calendar"
                aria-label="Select inquiry stay dates"
            >

                <p className="inquiry-stay-calendar__instructions">

                    {
                        !checkIn

                            ? "Select check-in."

                            : !checkOut

                                ? "Select check-out."

                                : "Stay selected. Select another date to start over."
                    }

                </p>


                <div className="inquiry-stay-calendar__navigation">

                    <button
                        type="button"
                        onClick={
                            () => this.changeMonth(-1)
                        }
                        disabled={
                            isLoading ||
                            isCheckingRange
                        }
                        aria-label="Previous month"
                    >
                        ‹
                    </button>


                    <h4 aria-live="polite">
                        {monthLabel}
                    </h4>


                    <button
                        type="button"
                        onClick={
                            () => this.changeMonth(1)
                        }
                        disabled={
                            isLoading ||
                            isCheckingRange
                        }
                        aria-label="Next month"
                    >
                        ›
                    </button>

                </div>


                <div className="inquiry-stay-calendar__legend">

                    <span>
                        Available
                    </span>

                    <span>
                        Blocked
                    </span>

                    <span>
                        Reserved
                    </span>

                </div>


                {
                    error &&

                    <p
                        role="alert"
                        className="inquiry-stay-calendar__error"
                    >
                        {error}
                    </p>
                }


                {
                    isLoading &&

                    <p role="status">
                        Loading availability...
                    </p>
                }


                {
                    isCheckingRange &&

                    <p role="status">
                        Checking selected stay...
                    </p>
                }


                {
                    !isLoading &&

                    <>

                        <div className="inquiry-stay-calendar__weekdays">

                            {
                                [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat"
                                ].map(day => {

                                    return (

                                        <span key={day}>
                                            {day}
                                        </span>

                                    );

                                })
                            }

                        </div>


                        <div className="inquiry-stay-calendar__days">

                            {
                                this.renderDays()
                            }

                        </div>

                    </>

                }


                <p className="inquiry-stay-calendar__selection">

                    Check-in: {
                        checkIn || "Not selected"
                    }

                    {" · "}

                    Check-out: {
                        checkOut || "Not selected"
                    }

                </p>


                <p className="inquiry-stay-calendar__note">

                    Check-out is not an occupied night.

                </p>

            </section>

        );

    };

};