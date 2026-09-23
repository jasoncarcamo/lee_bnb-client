import React from "react";

import AdminGuestRequest from "../../services/AdminGuestService";


const AdminGuestContext = React.createContext({

    guests: {},
    guestIds: [],

    isLoading: false,
    error: "",

    getGuests: ()=>Promise.resolve([]),
    getGuestById: ()=>Promise.resolve(null),

    setGuest: ()=>{},

    createGuest: ()=>Promise.resolve(null),
    updateGuest: ()=>Promise.resolve(null),
    deleteGuest: ()=>Promise.resolve(null)

});


export default AdminGuestContext;


export class AdminGuestContextProvider extends React.Component{

    state = {

        guests: {},
        guestIds: [],

        isLoading: false,
        error: ""

    };


    getErrorMessage = (error, fallback)=>{

        if(typeof error === "string"){

            return error;

        };


        return error?.error ||
            error?.message ||
            fallback;

    };


    normalizeGuests = (guestList)=>{

        const guests = {};
        const guestIds = [];


        guestList.forEach(guest => {

            if(!guest || !guest.id){

                return;

            };


            guests[guest.id] = guest;

            guestIds.push(guest.id);

        });


        return {
            guests,
            guestIds
        };

    };


    getGuests = ()=>{

        this.setState({
            isLoading: true,
            error: ""
        });


        return AdminGuestRequest
            .getAllGuests()
            .then(({guests}) => {

                const normalized = this.normalizeGuests(
                    guests
                );


                this.setState({

                    ...normalized,

                    isLoading: false,
                    error: ""

                });


                return guests;

            })
            .catch(error => {

                this.setState({

                    isLoading: false,

                    error: this.getErrorMessage(
                        error,
                        "Unable to load guests."
                    )

                });


                return Promise.reject(error);

            });

    };


    getGuestById = (id)=>{

        if(!id){

            return Promise.resolve(null);

        };


        const cachedGuest = this.state.guests[id];


        if(cachedGuest){

            return Promise.resolve(cachedGuest);

        };


        return AdminGuestRequest
            .getGuestById(id)
            .then(({guest}) => {

                this.setGuest(guest);

                return guest;

            });

    };


    setGuest = (guest)=>{

        if(!guest || !guest.id){

            return;

        };


        this.setState(previousState => ({

            guests: {

                ...previousState.guests,

                [guest.id]: guest

            },

            guestIds: previousState.guestIds.includes(
                guest.id
            )
                ? previousState.guestIds
                : [
                    ...previousState.guestIds,
                    guest.id
                ]

        }));

    };


    createGuest = (newGuest)=>{

        return AdminGuestRequest
            .createGuest(newGuest)
            .then(({guest}) => {

                this.setGuest(guest);

                return guest;

            });

    };


    updateGuest = (id, updatedGuest)=>{

        return AdminGuestRequest
            .updateGuest(id, updatedGuest)
            .then(({guest}) => {

                this.setGuest(guest);

                return guest;

            });

    };


    deleteGuest = (id)=>{

        return AdminGuestRequest
            .deleteGuest(id)
            .then(({guest}) => {

                this.setState(previousState => {

                    const guests = {
                        ...previousState.guests
                    };


                    delete guests[id];


                    return {

                        guests,

                        guestIds: previousState.guestIds.filter(
                            guestId => guestId !== id
                        )

                    };

                });


                return guest;

            });

    };


    render(){

        const value = {

            ...this.state,

            getGuests: this.getGuests,

            getGuestById: this.getGuestById,

            setGuest: this.setGuest,

            createGuest: this.createGuest,

            updateGuest: this.updateGuest,

            deleteGuest: this.deleteGuest

        };


        return (

            <AdminGuestContext.Provider value={value}>

                {this.props.children}

            </AdminGuestContext.Provider>

        );

    };

};