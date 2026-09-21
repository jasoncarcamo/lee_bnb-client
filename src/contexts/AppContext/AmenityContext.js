import React from "react";

const AmenityRequest = require("../../services/AmenityService");

const PropertyAmenityRequest =
    require("../../services/PropertyAmenityServices");

const AmenityStorage =
    require("../../storage/AmenityStorage");


const AmenityContext = React.createContext({

    amenities: {},

    amenityIds: [],

    amenitiesByPropertyId: {},

    isLoading: false,

    error: "",

    getAmenities: ()=>{},

    getAmenitiesByPropertyId: ()=>{},

    getAmenityById: ()=>{},

    createAmenity: ()=>{},

    updateAmenity: ()=>{},

    deleteAmenity: ()=>{},

    addAmenityToProperty: ()=>{},

    removeAmenityFromProperty: ()=>{}

});


export default AmenityContext;


export class AmenityContextProvider extends React.Component{

    state = {

        amenities: {},

        amenityIds: [],

        amenitiesByPropertyId: {},

        isLoading: false,

        error: ""

    };


    componentDidMount(){

        const storedAmenities =
            AmenityStorage.getAmenities();


        if(storedAmenities){

            this.setState({

                amenities:
                    storedAmenities.amenities || {},

                amenityIds:
                    storedAmenities.amenityIds || [],

                amenitiesByPropertyId:
                    storedAmenities.amenitiesByPropertyId || {}

            });

        };


        this.getAmenities();

    };


    normalizeAmenities = (amenities)=>{

        const normalizedAmenities = {};

        const amenityIds = [];


        amenities.forEach( amenity => {

            normalizedAmenities[amenity.id] =
                amenity;

            amenityIds.push(
                amenity.id
            );

        });


        return {
            amenities: normalizedAmenities,
            amenityIds
        };

    };


    saveAmenities = (
        amenities,
        amenityIds,
        amenitiesByPropertyId
    )=>{

        AmenityStorage.saveAmenities({

            amenities,

            amenityIds,

            amenitiesByPropertyId

        });

    };


    getAmenities = ()=>{

        this.setState({
            isLoading: true,
            error: ""
        });


        return AmenityRequest
            .getAllAmenities()
            .then( response => {

                const normalized =
                    this.normalizeAmenities(
                        response.amenities || []
                    );


                this.setState(
                    {
                        amenities:
                            normalized.amenities,

                        amenityIds:
                            normalized.amenityIds,

                        isLoading: false,

                        error: ""
                    },
                    ()=>{

                        this.saveAmenities(
                            this.state.amenities,
                            this.state.amenityIds,
                            this.state.amenitiesByPropertyId
                        );

                    }
                );


                return normalized;

            })
            .catch( error => {

                this.setState({
                    isLoading: false,

                    error:
                        error.error ||
                        "Unable to load amenities"
                });


                return Promise.reject(error);

            });

    };


    getAmenityById = (amenityId)=>{

        const existingAmenity =
            this.state.amenities[amenityId];


        if(existingAmenity){

            return Promise.resolve(
                existingAmenity
            );

        };


        return AmenityRequest
            .getAmenityById(amenityId)
            .then( response => {

                const amenity =
                    response.amenity;


                this.setAmenity(
                    amenity
                );


                return amenity;

            });

    };


    getAmenitiesByPropertyId = (propertyId)=>{

        return PropertyAmenityRequest
            .getAmenitiesByPropertyId(propertyId)
            .then( response => {

                const propertyAmenities =
                    response.amenities || [];

                const propertyAmenityIds =
                    propertyAmenities.map(
                        amenity => amenity.id
                    );

                return new Promise( resolve => {

                    this.setState(
                        previousState => {

                            const amenities = {
                                ...previousState.amenities
                            };

                            const amenityIds = [
                                ...previousState.amenityIds
                            ];

                            propertyAmenities.forEach( amenity => {

                                amenities[amenity.id] = amenity;

                                if(!amenityIds.includes(amenity.id)){

                                    amenityIds.push(amenity.id);

                                };

                            });

                            return {
                                amenities,

                                amenityIds,

                                amenitiesByPropertyId: {
                                    ...previousState.amenitiesByPropertyId,

                                    [propertyId]:
                                        propertyAmenityIds
                                }
                            };

                        },
                        ()=>{

                            this.saveAmenities(
                                this.state.amenities,
                                this.state.amenityIds,
                                this.state.amenitiesByPropertyId
                            );

                            resolve(propertyAmenityIds);

                        }
                    );

                });

            });

    };


    setAmenity = (amenity)=>{

        if(!amenity || !amenity.id){

            return;

        };


        const amenities = {
            ...this.state.amenities,

            [amenity.id]:
                amenity
        };


        const amenityIds =
            this.state.amenityIds.includes(
                amenity.id
            )
                ? this.state.amenityIds
                : [
                    ...this.state.amenityIds,
                    amenity.id
                ];


        this.setState(
            {
                amenities,
                amenityIds
            },
            ()=>{

                this.saveAmenities(
                    this.state.amenities,
                    this.state.amenityIds,
                    this.state.amenitiesByPropertyId
                );

            }
        );

    };


    createAmenity = (newAmenity)=>{

        return AmenityRequest
            .createAmenity(newAmenity)
            .then( response => {

                const amenity =
                    response.amenity;


                this.setAmenity(
                    amenity
                );


                return amenity;

            });

    };


    updateAmenity = (
        amenityId,
        updatedAmenity
    )=>{

        return AmenityRequest
            .updateAmenity(
                amenityId,
                updatedAmenity
            )
            .then( response => {

                const amenity =
                    response.amenity;


                this.setAmenity(
                    amenity
                );


                return amenity;

            });

    };


    deleteAmenity = (amenityId)=>{

        return AmenityRequest
            .deleteAmenity(amenityId)
            .then( response => {

                const amenities = {
                    ...this.state.amenities
                };


                delete amenities[
                    amenityId
                ];


                const amenityIds =
                    this.state.amenityIds.filter(
                        id => id !== amenityId
                    );


                const amenitiesByPropertyId = {};


                Object.keys(
                    this.state.amenitiesByPropertyId
                )
                    .forEach( propertyId => {

                        amenitiesByPropertyId[
                            propertyId
                        ] =
                            this.state
                                .amenitiesByPropertyId[
                                    propertyId
                                ]
                                .filter(
                                    id =>
                                        id !== amenityId
                                );

                    });


                this.setState(
                    {
                        amenities,
                        amenityIds,
                        amenitiesByPropertyId
                    },
                    ()=>{

                        this.saveAmenities(
                            this.state.amenities,
                            this.state.amenityIds,
                            this.state.amenitiesByPropertyId
                        );

                    }
                );


                return response.amenity;

            });

    };


    addAmenityToProperty = (
        propertyId,
        amenityId
    )=>{

        return PropertyAmenityRequest
            .addAmenityToProperty(
                propertyId,
                amenityId
            )
            .then( response => {

                const currentAmenityIds =
                    this.state
                        .amenitiesByPropertyId[
                            propertyId
                        ] || [];


                const propertyAmenityIds =
                    currentAmenityIds.includes(
                        amenityId
                    )
                        ? currentAmenityIds
                        : [
                            ...currentAmenityIds,
                            amenityId
                        ];


                const amenitiesByPropertyId = {
                    ...this.state.amenitiesByPropertyId,

                    [propertyId]:
                        propertyAmenityIds
                };


                this.setState(
                    {
                        amenitiesByPropertyId
                    },
                    ()=>{

                        this.saveAmenities(
                            this.state.amenities,
                            this.state.amenityIds,
                            this.state.amenitiesByPropertyId
                        );

                    }
                );


                return response.propertyAmenity;

            });

    };


    removeAmenityFromProperty = (
        propertyId,
        amenityId
    )=>{

        return PropertyAmenityRequest
            .removeAmenityFromProperty(
                propertyId,
                amenityId
            )
            .then( response => {

                const currentAmenityIds =
                    this.state
                        .amenitiesByPropertyId[
                            propertyId
                        ] || [];


                const propertyAmenityIds =
                    currentAmenityIds.filter(
                        id => id !== amenityId
                    );


                const amenitiesByPropertyId = {
                    ...this.state.amenitiesByPropertyId,

                    [propertyId]:
                        propertyAmenityIds
                };


                this.setState(
                    {
                        amenitiesByPropertyId
                    },
                    ()=>{

                        this.saveAmenities(
                            this.state.amenities,
                            this.state.amenityIds,
                            this.state.amenitiesByPropertyId
                        );

                    }
                );


                return response.propertyAmenity;

            });

    };


    render(){

        const value = {

            amenities:
                this.state.amenities,

            amenityIds:
                this.state.amenityIds,

            amenitiesByPropertyId:
                this.state.amenitiesByPropertyId,

            isLoading:
                this.state.isLoading,

            error:
                this.state.error,

            getAmenities:
                this.getAmenities,

            getAmenitiesByPropertyId:
                this.getAmenitiesByPropertyId,

            getAmenityById:
                this.getAmenityById,

            createAmenity:
                this.createAmenity,

            updateAmenity:
                this.updateAmenity,

            deleteAmenity:
                this.deleteAmenity,

            addAmenityToProperty:
                this.addAmenityToProperty,

            removeAmenityFromProperty:
                this.removeAmenityFromProperty

        };


        return (
            <AmenityContext.Provider
                value={value}
            >
                {this.props.children}
            </AmenityContext.Provider>
        );

    };

};