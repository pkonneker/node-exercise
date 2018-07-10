var express = require('express');
var requestLib = require('request-promise-native');

var app = express();

// Serve two endpoints
// both return json
// both hit a swapi endpoint and get all the things in it
// planets will then recursively swapi down and grab all the people on a planet
//   and replace their urls with their full name

const getAllFromSWAPIEndpoint = async (endpoint) => {
    // response = await

    return JSON.parse(await requestLib(`https://swapi.co/api/${endpoint}/`));
};

app.get('/', async function (req, res, next) {
  res.json(await getAllFromSWAPIEndpoint('planets'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// For debugging functions
module.exports = {
    getAllFromSWAPIEndpoint
};
