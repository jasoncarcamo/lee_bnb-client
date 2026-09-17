const AmenityStorage = {

    storageKey: "amenities",


    getAmenities(){

        const storedAmenities =
            localStorage.getItem(
                this.storageKey
            );


        if(!storedAmenities){

            return null;

        };


        try{

            return JSON.parse(
                storedAmenities
            );

        }
        catch(error){

            localStorage.removeItem(
                this.storageKey
            );


            return null;

        };

    },


    saveAmenities(amenityData){

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(amenityData)
        );

    },


    clearAmenities(){

        localStorage.removeItem(
            this.storageKey
        );

    }

};


module.exports = AmenityStorage;