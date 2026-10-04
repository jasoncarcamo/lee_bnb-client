import React from "react";

import AppContext from "../../../contexts/AppContext/AppContext";

import "./AvailabilityCalendar.css";


export default class AvailabilityCalendar extends React.Component{

    static contextType = AppContext;


    state = {
        year: new Date().getFullYear(),
        month: new Date().getMonth()
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


    getMonthKey = ()=>{

        const {
            propertyId
        } = this.props;

        const {
            year,
            month
        } = this.state;


        return JSON.stringify([
            propertyId,
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

        const {
            propertyAvailabilityContext
        } = this.context;


        propertyAvailabilityContext
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


    formatDate = (day)=>{

        const {
            year,
            month
        } = this.state;


        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    };


    renderDays = (monthData)=>{

        const {
            year,
            month
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
                monthData?.availabilityByDate?.[date];


            const isReserved =
                !!monthData?.reservedDates?.[date];


            const isBlocked =
                availability &&
                availability.is_available === false;


            const isUnavailable =
                isReserved ||
                isBlocked;


            days.push(
                <div
                    className={
                        isUnavailable
                            ? "availability-calendar__day availability-calendar__day--unavailable"
                            : "availability-calendar__day"
                    }
                    key={date}
                >

                    <span>
                        {day}
                    </span>

                </div>
            );

        };


        return days;

    };


    render(){

        const {
            year,
            month
        } = this.state;


        const {
            monthsByKey
        } = this.context.propertyAvailabilityContext;


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

            </section>
        );

    };
};