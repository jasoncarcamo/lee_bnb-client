import React from "react";

import "./AdminTabs.css";


export default class AdminTabs extends React.Component{

    tabs = [
        {
            id: "dashboard",
            label: "Dashboard"
        },
        {
            id: "properties",
            label: "Properties"
        },
        {
            id: "amenities",
            label: "Amenities"
        },
        {
            id: "availability",
            label: "Availability"
        },
        {
            id: "pricing",
            label: "Pricing"
        },
        {
            id: "guests",
            label: "Guests"
        },
        {
            id: "reservations",
            label: "Reservations"
        },
        {
            id: "payments",
            label: "Payments"
        },
        {
            id: "refunds",
            label: "Refunds"
        },
        {
            id: "conversations",
            label: "Conversations"
        },
        {
            id: "inquiries",
            label: "Inquiries"
        },
        {
            id: "reviews",
            label: "Reviews"
        },
        {
            id: "notifications",
            label: "Notifications"
        }
    ];


    handleTabClick = (tabId)=>{

        this.props.handleTabChange(
            tabId
        );

    };


    render(){

        const {
            activeTab
        } = this.props;


        return (
            <nav
                className="admin-tabs"
                aria-label="Admin dashboard navigation"
            >

                {
                    this.tabs.map( tab => {

                        const isActive = activeTab === tab.id;


                        return (
                            <button
                                key={tab.id}
                                className={
                                    isActive
                                        ? "admin-tabs__button admin-tabs__button--active"
                                        : "admin-tabs__button"
                                }
                                type="button"
                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }
                                onClick={
                                    ()=>this.handleTabClick(tab.id)
                                }
                            >
                                {tab.label}
                            </button>
                        );

                    })
                }

            </nav>
        );

    };
};