import React from "react";

import PropertyRequest from "../../services/PropertyServices";
import PropertyStorage from "../../storage/PropertyStorage";


const PropertyContext = React.createContext({
    properties: {},
    propertyIds: [],
    isLoading: false,
    error: "",

    getProperties: ()=>{},
    getPropertyById: ()=>{},
    getPropertyBySlug: ()=>{},
    createProperty: ()=>{},
    updateProperty: ()=>{},
    deleteProperty: ()=>{}
});


export default PropertyContext;


export class PropertyContextProvider extends React.Component{

    state = {
        properties: {},
        propertyIds: [],
        isLoading: false,
        error: ""
    };


    componentDidMount(){

        const storedProperties = PropertyStorage.getProperties();

        if(storedProperties){

            this.setState({
                properties: storedProperties.properties || {},
                propertyIds: storedProperties.propertyIds || [],
                error: ""
            });

        };

        this.getProperties()
            .catch( error => {

                console.error(
                    "Unable to refresh properties:",
                    error
                );

            });

    };

    normalizeProperties = (properties)=>{

        const normalizedProperties = {};
        const propertyIds = [];


        properties.forEach( property => {

            normalizedProperties[property.id] = property;

            propertyIds.push(
                property.id
            );

        });


        return {
            properties: normalizedProperties,
            propertyIds
        };

    };


    saveProperties = (
        properties,
        propertyIds
    )=>{

        PropertyStorage.setProperties({
            properties,
            propertyIds
        });

    };


    getProperties = ()=>{

        this.setState({
            isLoading: true,
            error: ""
        });


        return PropertyRequest.getAllProperties()
            .then( response => {

                const normalizedData = this.normalizeProperties(
                    response.properties
                );


                this.saveProperties(
                    normalizedData.properties,
                    normalizedData.propertyIds
                );


                this.setState({
                    properties: normalizedData.properties,
                    propertyIds: normalizedData.propertyIds,
                    isLoading: false,
                    error: ""
                });


                return response.properties;

            })
            .catch( error => {

                this.setState({
                    isLoading: false,
                    error: error.error || "Unable to load properties"
                });


                return Promise.reject(error);

            });

    };


    getPropertyById = (id)=>{

        const property = this.state.properties[id];


        if(property){

            return Promise.resolve(
                property
            );

        };


        return PropertyRequest.getPropertyById(id)
            .then( response => {

                this.setProperty(
                    response.property
                );


                return response.property;

            });

    };


    getPropertyBySlug = (slug)=>{

        const property = Object.values(
            this.state.properties
        ).find( property => property.slug === slug );


        if(property){

            return Promise.resolve(
                property
            );

        };


        return PropertyRequest.getPropertyBySlug(slug)
            .then( response => {

                this.setProperty(
                    response.property
                );


                return response.property;

            });

    };


    setProperty = (property)=>{

        this.setState( prevState => {

            const propertyExists = !!prevState.properties[property.id];


            const properties = {
                ...prevState.properties,

                [property.id]: property
            };


            const propertyIds = propertyExists
                ? prevState.propertyIds
                : [
                    ...prevState.propertyIds,
                    property.id
                ];


            this.saveProperties(
                properties,
                propertyIds
            );


            return {
                properties,
                propertyIds
            };

        });

    };


    createProperty = (newProperty)=>{

        return PropertyRequest.createProperty(newProperty)
            .then( response => {

                this.setProperty(
                    response.property
                );


                return response.property;

            });

    };


    updateProperty = (id, updatedProperty)=>{

        return PropertyRequest.updateProperty(
            id,
            updatedProperty
        )
            .then( response => {

                this.setProperty(
                    response.property
                );


                return response.property;

            });

    };


    deleteProperty = (id)=>{

        return PropertyRequest.deleteProperty(id)
            .then( response => {

                this.setState( prevState => {

                    const properties = {
                        ...prevState.properties
                    };


                    delete properties[id];


                    const propertyIds = prevState.propertyIds.filter(
                        propertyId => propertyId !== id
                    );


                    this.saveProperties(
                        properties,
                        propertyIds
                    );


                    return {
                        properties,
                        propertyIds
                    };

                });


                return response.property;

            });

    };


    render(){

        const value = {
            properties: this.state.properties,
            propertyIds: this.state.propertyIds,
            isLoading: this.state.isLoading,
            error: this.state.error,

            getProperties: this.getProperties,
            getPropertyById: this.getPropertyById,
            getPropertyBySlug: this.getPropertyBySlug,
            createProperty: this.createProperty,
            updateProperty: this.updateProperty,
            deleteProperty: this.deleteProperty
        };


        return (
            <PropertyContext.Provider value={value}>
                {this.props.children}
            </PropertyContext.Provider>
        );

    };
};