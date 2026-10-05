import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";

import Guest from "./pages/Guest/Guest";
import GuestLogin from "./pages/Guest/GuestLogin/GuestLogin";
import GuestRegister from "./pages/Guest/GuestRegister/GuestRegister";

import Admin from "./pages/Admin/Admin";
import AdminRegister from "./pages/Admin/AdminRegister/AdminRegister";

import "./App.css";


export default class App extends React.Component{

    render(){

        return (
            <Routes>

                <Route
                    path="/"
                    element={<LandingPage/>}
                />


                <Route
                    path="/guest/login"
                    element={<GuestLogin/>}
                />


                <Route
                    path="/guest/register"
                    element={<GuestRegister/>}
                />


                <Route
                    path="/guest"
                    element={<Guest/>}
                />


                <Route
                    path="/admin"
                    element={<Admin/>}
                />


                <Route
                    path="/admin/register"
                    element={<AdminRegister/>}
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        );

    };
};