const PropertyAvailabilityStorage = {

    CACHE_DURATION: 60 * 1000,

    STORAGE_KEY: "propertyAvailabilityMonths",


    getMonths(){

        try{

            const months = window.localStorage.getItem(
                this.STORAGE_KEY
            );


            if(!months){

                return {};

            };


            return JSON.parse(months);

        }
        catch(error){

            this.deleteMonths();

            return {};

        };

    },


    getMonth(propertyId, year, month){

        const months = this.getMonths();

        const key = [
            propertyId,
            year,
            month
        ].join(":");


        const cachedMonth = months[key];


        if(!cachedMonth){

            return null;

        };


        if(
            Date.now() - cachedMonth.savedAt >=
                this.CACHE_DURATION ||
            cachedMonth.savedAt > Date.now()
        ){

            delete months[key];

            this.setMonths(months);

            return null;

        };


        return cachedMonth.data;

    },


    hasMonth(propertyId, year, month){

        return this.getMonth(
            propertyId,
            year,
            month
        ) !== null;

    },


    setMonths(months){

        try{

            window.localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(months)
            );

            return true;

        }
        catch(error){

            return false;

        };

    },


    setMonth(propertyId, year, month, monthData){

        const months = this.getMonths();

        const key = [
            propertyId,
            year,
            month
        ].join(":");


        months[key] = {

            savedAt: Date.now(),

            data: monthData

        };


        return this.setMonths(months);

    },


    updateMonth(propertyId, year, month, monthData){

        return this.setMonth(
            propertyId,
            year,
            month,
            monthData
        );

    },


    deleteMonth(propertyId, year, month){

        const months = this.getMonths();

        const key = [
            propertyId,
            year,
            month
        ].join(":");


        delete months[key];


        return this.setMonths(months);

    },


    deletePropertyMonths(propertyId){

        const months = this.getMonths();

        Object.keys(months).forEach(key => {

            if(key.startsWith(`${propertyId}:`)){

                delete months[key];

            };

        });


        return this.setMonths(months);

    },


    deleteMonths(){

        try{

            window.localStorage.removeItem(
                this.STORAGE_KEY
            );

            return true;

        }
        catch(error){

            return false;

        };

    }

};


module.exports = PropertyAvailabilityStorage;