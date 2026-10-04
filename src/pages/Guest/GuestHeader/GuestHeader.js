import React from "react";

import "./GuestHeader.css";


export default class GuestHeader extends React.Component{

    render(){

        return (
            <header className="guest-header">

                <div className="guest-header__container">

                    <a
                        className="guest-header__brand"
                        href="/guest"
                        aria-label="Lee BnB home"
                    >
                        Lee BnB
                    </a>

                </div>

            </header>
        );

    };
};