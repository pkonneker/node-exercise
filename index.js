var express = require('express');
var requestLib = require('request-promise-native');

var app = express();

const getAllFromSWAPIEndpoint = async (endpoint) => {
    let response = JSON.parse(await requestLib(`https://swapi.co/api/${endpoint}/`));
    let results = response.results;

    while (response.next) {
        response = JSON.parse(await requestLib(response.next));

        results = results.concat(response.results);
    }

    return results
};

const sortResults = (results, sortKey) => {
    if(!sortKey) return results;

    const makeCompareFunction = (sortKey) => {
        return (a, b) => {
            if (sortKey === 'mass' || sortKey === 'height') {
                const intA =  parseInt(a[sortKey].replace(',', ''), 10);
                const intB =  parseInt(b[sortKey].replace(',', ''), 10);

                // Gracefully handle NaN
                if (isNaN(intA) && isNaN(intB)) return 0;

                if (isNaN(intA) && !isNaN(intB)) return 1;

                if (!isNaN(intA) && isNaN(intB)) return -1;

                // Handle base case
                return intA - intB;
            }
            else {
                if (a[sortKey] < b[sortKey]) return -1;

                if (a[sortKey] > b[sortKey]) return 1;

                return 0;
            }
        };
    };

    return results.sort(makeCompareFunction(sortKey));
};

const populateResidents = async (planets) => {
    const getResident = async(resident) => {
        return JSON.parse(await requestLib(resident)).name;
    };

    const populatePlanet = async (planet) => {
        return Object.assign(
            {},
            planet,
            {
                residents: await Promise.all(planet.residents.map(getResident))
            }
        );
    };

    return Promise.all(planets.map(populatePlanet));
};

app.get('/planets', async (req, res, next) => {
    const planets = await getAllFromSWAPIEndpoint('planets');

    res.json(await populateResidents(planets));
});

app.get('/people', async (req, res, next) => {
    const people = await getAllFromSWAPIEndpoint('people');

    res.json(sortResults(people, req.query.sortBy));
});

app.listen(3000, () => console.log('Node-exercise listening on port 3000.'))

// For debugging functions
module.exports = {
    getAllFromSWAPIEndpoint
};
