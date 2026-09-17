module.exports = {
    url: process.env.REACT_APP_NODE_ENV === "development" ? process.env.REACT_APP_TEST_URL : process.env.REACT_APP_PROD_URL 
};