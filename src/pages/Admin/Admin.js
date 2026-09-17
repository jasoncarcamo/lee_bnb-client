import React from "react";

import AuthContext from "../../contexts/AuthContext";

import AdminLogin from "./AdminLogin/AdminLogin";
import AdminDashboard from "./AdminDashBoard/AdminDashboard";

import "./Admin.css";


export default class Admin extends React.Component{

    static contextType = AuthContext;


    render(){

        const {
            isAuthenticated
        } = this.context;


        return (
            <main className="admin">

                {
                    isAuthenticated
                        ? <AdminDashboard/>
                        : <AdminLogin/>
                }

            </main>
        );

    };
};