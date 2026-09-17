import React from "react";

import AdminLogin from "./AdminLogin/AdminLogin";

import "./Admin.css";


export default class Admin extends React.Component{

    render(){

        return (
            <main className="admin">
                <AdminLogin/>
            </main>
        );

    };
};