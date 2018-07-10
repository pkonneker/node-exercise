var express = require('express');
var requestLib = require('request-promise-native');

var app = express();

// Serve two endpoints
// both return json
// both hit a swapi endpoint and get all the things in it
// planets will then recursively swapi down and grab all the people on a planet
//   and replace their urls with their full name

const getAllFromSWAPIEndpoint = async (endpoint) => {
    let response = JSON.parse(await requestLib(`https://swapi.co/api/${endpoint}/`));
    let results = response.results;

    while (response.next) {
        response = JSON.parse(await requestLib(response.next));

        results = results.concat(response.results)
    }

    return results
};

const sortResults = async (endpoint) => {
    // Take in the unsorted list, and the req querystring and then sort accordingly
};

const populateResidents = async (planets) => {
    // For each planet
    //   For each resident
    //     Get the resident and replace with the fullname
    //   Set the residents to Promise.all the mapped async get function
};

app.get('/planets', async function (req, res, next) {
  res.json(await getAllFromSWAPIEndpoint('planets'));
});

app.get('/people', async function (req, res, next) {
  res.json(await getAllFromSWAPIEndpoint('people'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// For debugging functions
module.exports = {
    getAllFromSWAPIEndpoint
};
