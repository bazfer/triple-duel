// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// Helper functions for making API Calls
var helper = {

  // This function hits our own server to retrieve the record of query results
  authenticate: function(username, password) {
    return axios.post("/login", { username: username, password: password });
  },

  // This function posts new searches to our database.
  /*postHistory: function(location) {
    return axios.post("/api", { location: location });
  }*/
};

// We export the API helper
module.exports = helper;
