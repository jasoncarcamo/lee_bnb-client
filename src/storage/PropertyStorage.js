const PropertyStorage = {

    getProperties(){

        const properties = window.localStorage.getItem(
            "properties"
        );


        if(!properties){

            return null;

        };


        try{

            return JSON.parse(
                properties
            );

        }
        catch(error){

            this.deleteProperties();

            return null;

        };

    },


    hasProperties(){

        return this.getProperties() !== null;

    },


    setProperties(properties){

        return window.localStorage.setItem(
            "properties",
            JSON.stringify(properties)
        );

    },


    updateProperties(properties){

        return this.setProperties(
            properties
        );

    },


    deleteProperties(){

        return window.localStorage.removeItem(
            "properties"
        );

    }

};


module.exports = PropertyStorage;