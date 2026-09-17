import React from "react";

import AuthContext from "../../../contexts/AuthContext";

import "./AdminDashboard.css";


export default class AdminDashboard extends React.Component{

    static contextType = AuthContext;


    handleLogOut = ()=>{

        this.context.logOutAdmin();

    };


    render(){

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


                <div className="admin-dashboard__content">

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Your Lee BnB management dashboard is ready.
                    </p>

                </div>

            </section>
        );

    };
};