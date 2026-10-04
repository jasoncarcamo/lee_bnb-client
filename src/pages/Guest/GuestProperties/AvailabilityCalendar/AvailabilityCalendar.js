import React from "react";

import AppContext from "../../../../contexts/AppContext/AppContext";

import "./AvailabilityCalendar.css";


export default class AvailabilityCalendar extends React.Component{

    static contextType = AppContext;


    state = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),

        checkIn: "",
        checkOut: "",

        selectionError: ""
    };


    componentDidMount(){

        this.loadMonth();

    };


    componentDidUpdate(prevProps, prevState){

        if(
            prevProps.propertyId !== this.props.propertyId ||
            prevState.year !== this.state.year ||
            prevState.month !== this.state.month
        ){

            this.loadMonth();

        };

    };


    getMonthKey = (
        year = this.state.year,
        month = this.state.month
    )=>{

        return JSON.stringify([
            this.props.propertyId,
            year,
            month
        ]);

    };


    loadMonth = ()=>{

        const {
            propertyId
        } = this.props;

        const {
            year,
            month
        } = this.state;


        return this.context
            .propertyAvailabilityContext
            .loadMonth(
                propertyId,
                year,
                month
            )
            .catch(error => {

                console.error(
                    "Unable to load property availability:",
                    error
                );

            });

    };


    previousMonth = ()=>{

        this.setState(previous => {

            let year =
                previous.year;

            let month =
                previous.month - 1;


            if(month < 0){

                month = 11;

                year -= 1;

            };


            return {
                year,
                month
            };

        });

    };


    nextMonth = ()=>{

        this.setState(previous => {

            let year =
                previous.year;

            let month =
                previous.month + 1;


            if(month > 11){

                month = 0;

                year += 1;

            };


            return {
                year,
                month
            };

        });

    };


    formatDate = (
        day,
        year = this.state.year,
        month = this.state.month
    )=>{

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    getToday = ()=>{

        const today =
            new Date();


        return [
            today.getFullYear(),
            String(
                today.getMonth() + 1
            ).padStart(2, "0"),
            String(
                today.getDate()
            ).padStart(2, "0")
        ].join("-");

    };


    getNightCount = (
        checkIn,
        checkOut
    )=>{

        const start =
            new Date(
                `${checkIn}T12:00:00`
            );

        const end =
            new Date(
                `${checkOut}T12:00:00`
            );


        return Math.round(
            (
                end.getTime() -
                start.getTime()
            ) /
            86400000
        );

    };


    isDateUnavailable = (date)=>{

        const [
            year,
            month
        ] = date
            .split("-")
            .map(Number);


        const monthKey =
            this.getMonthKey(
                year,
                month - 1
            );


        const monthData =
            this.context
                .propertyAvailabilityContext
                .monthsByKey[monthKey];


        if(
            !monthData ||
            monthData.status !== "ready"
        ){

            return true;

        };


        const availability =
            monthData
                .availabilityByDate?.[date];


        const isReserved =
            !!monthData
                .reservedDates?.[date];


        const isBlocked =
            availability &&
            availability.is_available === false;


        return (
            isReserved ||
            isBlocked
        );

    };


    rangeHasUnavailableNight = (
        checkIn,
        checkOut
    )=>{

        const cursor =
            new Date(
                `${checkIn}T12:00:00`
            );

        const end =
            new Date(
                `${checkOut}T12:00:00`
            );


        while(cursor < end){

            const date = [
                cursor.getFullYear(),
                String(
                    cursor.getMonth() + 1
                ).padStart(2, "0"),
                String(
                    cursor.getDate()
                ).padStart(2, "0")
            ].join("-");


            if(
                this.isDateUnavailable(date)
            ){

                return true;

            };


            cursor.setDate(
                cursor.getDate() + 1
            );

        };


        return false;

    };


    selectDate = (date)=>{

        const {
            checkIn,
            checkOut
        } = this.state;


        const minimumNights =
            Number(
                this.props.minimumNights
            ) || 1;


        if(
            date < this.getToday() ||
            this.isDateUnavailable(date)
        ){

            return;

        };


        if(
            !checkIn ||
            checkOut
        ){

            this.setState(
                {
                    checkIn: date,
                    checkOut: "",
                    selectionError: ""
                },
                ()=>{

                    this.notifyStayChange(
                        date,
                        ""
                    );

                }
            );


            return;

        };


                if(date <= checkIn){

                    this.setState(
            {
                checkIn: date,
                checkOut: "",
                selectionError: ""
            },
            ()=>{

                this.notifyStayChange(
                    date,
                    ""
                );

            }
        );


            return;

        };


        const nights =
            this.getNightCount(
                checkIn,
                date
            );


        if(nights < minimumNights){

            this.setState({
                selectionError:
                    `Minimum stay is ${minimumNights} ${
                        minimumNights === 1
                            ? "night"
                            : "nights"
                    }.`
            });


            return;

        };


        const {
            propertyId
        } = this.props;


        this.context
            .propertyAvailabilityContext
            .loadRange(
                propertyId,
                checkIn,
                date
            )
            .then(() => {

                if(
                    this.rangeHasUnavailableNight(
                        checkIn,
                        date
                    )
                ){

                    this.setState({
                        selectionError:
                            "Your selected stay includes an unavailable night."
                    });


                    return;

                };


                this.setState(
                {
                    checkOut: date,
                    selectionError: ""
                },
                ()=>{

                    this.notifyStayChange(
                        checkIn,
                        date
                    );

                }
            );

            })
            .catch(error => {

                console.error(
                    "Unable to validate stay:",
                    error
                );


                this.setState({
                    selectionError:
                        error.error ||
                        error.message ||
                        "Unable to validate these dates."
                });

            });

    };


    isDateInSelectedRange = (date)=>{

        const {
            checkIn,
            checkOut
        } = this.state;


        return (
            checkIn &&
            checkOut &&
            date > checkIn &&
            date < checkOut
        );

    };


    renderDays = (monthData)=>{

        const {
            year,
            month,
            checkIn,
            checkOut
        } = this.state;


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        const today =
            this.getToday();


        const days = [];


        for(
            let index = 0;
            index < firstDay;
            index += 1
        ){

            days.push(
                <div
                    className="availability-calendar__empty-day"
                    key={`empty-${index}`}
                    aria-hidden="true"
                />
            );

        };


        for(
            let day = 1;
            day <= daysInMonth;
            day += 1
        ){

            const date =
                this.formatDate(day);


            const availability =
                monthData
                    ?.availabilityByDate
                    ?.[date];


            const isReserved =
                !!monthData
                    ?.reservedDates
                    ?.[date];


            const isBlocked =
                availability &&
                availability.is_available === false;


            const isPast =
                date < today;


            const isUnavailable =
                isReserved ||
                isBlocked ||
                isPast;


            const isCheckIn =
                date === checkIn;


            const isCheckOut =
                date === checkOut;


            const isInRange =
                this.isDateInSelectedRange(
                    date
                );


            let className =
                "availability-calendar__day";


            if(isUnavailable){

                className +=
                    " availability-calendar__day--unavailable";

            };


            if(isInRange){

                className +=
                    " availability-calendar__day--range";

            };


            if(
                isCheckIn ||
                isCheckOut
            ){

                className +=
                    " availability-calendar__day--selected";

            };


            days.push(
                <button
                    type="button"
                    className={className}
                    key={date}
                    disabled={isUnavailable}
                    onClick={
                        ()=>this.selectDate(date)
                    }
                    aria-label={
                        `${date}${
                            isUnavailable
                                ? ", unavailable"
                                : ", available"
                        }`
                    }
                    aria-pressed={
                        isCheckIn ||
                        isCheckOut
                    }
                >
                    {day}
                </button>
            );

        };


        return days;

    };


    notifyStayChange = (
        checkIn,
        checkOut
    )=>{

        if(
            typeof this.props.onStayChange ===
            "function"
        ){

            this.props.onStayChange(
                checkIn,
                checkOut
            );

        };

    };

    render(){

        const {
            year,
            month,
            checkIn,
            checkOut,
            selectionError
        } = this.state;


        const {
            monthsByKey
        } = this.context
            .propertyAvailabilityContext;


        const monthKey =
            this.getMonthKey();


        const monthData =
            monthsByKey[monthKey];


        const monthName =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            ).format(
                new Date(
                    year,
                    month,
                    1
                )
            );


        return (
            <section
                className="availability-calendar"
                aria-labelledby="availability-calendar-title"
            >

                <header className="availability-calendar__header">

                    <button
                        type="button"
                        className="availability-calendar__navigation"
                        onClick={this.previousMonth}
                        aria-label="Previous month"
                    >
                        ←
                    </button>


                    <h3 id="availability-calendar-title">
                        {monthName}
                    </h3>


                    <button
                        type="button"
                        className="availability-calendar__navigation"
                        onClick={this.nextMonth}
                        aria-label="Next month"
                    >
                        →
                    </button>

                </header>

                <div
                    className="availability-calendar__legend"
                    aria-label="Availability legend"
                >

                    <span>

                        <span
                            className="availability-calendar__key availability-calendar__key--available"
                            aria-hidden="true"
                        />

                        Available

                    </span>


                    <span>

                        <span
                            className="availability-calendar__key availability-calendar__key--unavailable"
                            aria-hidden="true"
                        />

                        Unavailable

                    </span>


                    <span>

                        <span
                            className="availability-calendar__key availability-calendar__key--selected"
                            aria-hidden="true"
                        />

                        Selected

                    </span>

                </div>

                <div className="availability-calendar__weekdays">

                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>

                </div>


                {
                    !monthData ||
                    monthData.status === "loading"
                        ? (
                            <p
                                className="availability-calendar__message"
                                role="status"
                            >
                                Loading availability...
                            </p>
                        )
                        : monthData.status === "error"
                            ? (
                                <p
                                    className="availability-calendar__message availability-calendar__message--error"
                                    role="alert"
                                >
                                    {monthData.error}
                                </p>
                            )
                            : (
                                <div className="availability-calendar__days">
                                    {this.renderDays(monthData)}
                                </div>
                            )
                }


                <div
                    className="availability-calendar__selection"
                    aria-live="polite"
                >

                    <div>

                        <span>
                            Check-in
                        </span>

                        <strong>
                            {checkIn || "Select date"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Check-out
                        </span>

                        <strong>
                            {checkOut || "Select date"}
                        </strong>

                    </div>

                </div>


                {
                    selectionError &&

                    <p
                        className="availability-calendar__selection-error"
                        role="alert"
                    >
                        {selectionError}
                    </p>
                }

            </section>
        );

    };
};