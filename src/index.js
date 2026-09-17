import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import App from "./App";
import ContextContainer from "./contexts/ContextContainer/ContextContainer";

import "./index.css";

import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(
    document.getElementById("root")
);


root.render(
    <React.StrictMode>

        <BrowserRouter>

            <ContextContainer>

                <App/>

            </ContextContainer>

        </BrowserRouter>

    </React.StrictMode>
);


reportWebVitals();