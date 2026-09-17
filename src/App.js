import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Admin from "./pages/Admin/Admin";
import Guest from "./pages/Guest/Guest";

import "./App.css";


export default class App extends React.Component{

    render(){

        return (
            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/guest"
                            replace
                        />
                    }
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
                    path="*"
                    element={
                        <Navigate
                            to="/guest"
                            replace
                        />
                    }
                />

            </Routes>
        );

    };
};