import React from "react";

import AuthContext from "../../../contexts/AuthContext";
import AdminTabs from "./AdminTabs/AdminTabs";
import AdminProperties from "./AdminProperties/AdminProperties";
import "./AdminDashboard.css";


export default class AdminDashboard extends React.Component{

    static contextType = AuthContext;


    state = {
        activeTab: "dashboard"
    };


    handleTabChange = (activeTab)=>{

        this.setState({
            activeTab
        });

    };


    handleLogOut = ()=>{

        this.context.logOutAdmin();

    };


    renderContent(){

        const {
            activeTab
        } = this.state;


        switch(activeTab){

            case "properties":

                return (<AdminProperties/>);


            case "amenities":

                return (
                    <h2>
                        Amenities
                    </h2>
                );


            case "availability":

                return (
                    <h2>
                        Availability
                    </h2>
                );


            case "pricing":

                return (
                    <h2>
                        Pricing
                    </h2>
                );


            case "guests":

                return (
                    <h2>
                        Guests
                    </h2>
                );


            case "reservations":

                return (
                    <h2>
                        Reservations
                    </h2>
                );


            case "payments":

                return (
                    <h2>
                        Payments
                    </h2>
                );


            case "refunds":

                return (
                    <h2>
                        Refunds
                    </h2>
                );


            case "conversations":

                return (
                    <h2>
                        Conversations
                    </h2>
                );


            case "inquiries":

                return (
                    <h2>
                        Inquiries
                    </h2>
                );


            case "reviews":

                return (
                    <h2>
                        Reviews
                    </h2>
                );


            case "notifications":

                return (
                    <h2>
                        Notifications
                    </h2>
                );


            default:

                return (
                    <h2>
                        Dashboard
                    </h2>
                );

        };

    };


    render(){

        const {
            activeTab
        } = this.state;


        const {
            admin
        } = this.context;


        return (
            <section className="admin-dashboard">

                <header className="admin-dashboard__header">

                    <div className="admin-dashboard__heading">

                        <p className="admin-dashboard__brand">
                            Lee BnB
                        </p>

                        <h1>
                            Admin Dashboard
                        </h1>

                        {
                            admin &&
                            <p className="admin-dashboard__welcome">
                                Welcome, {admin.first_name}
                            </p>
                        }

                    </div>


                    <button
                        className="admin-dashboard__logout"
                        type="button"
                        onClick={this.handleLogOut}
                    >
                        Sign out
                    </button>

                </header>


                <div className="admin-dashboard__layout">

                    <aside className="admin-dashboard__navigation">

                        <AdminTabs
                            activeTab={activeTab}
                            handleTabChange={this.handleTabChange}
                        />

                    </aside>


                    <main className="admin-dashboard__content">

                        {this.renderContent()}

                    </main>

                </div>

            </section>
        );

    };
};