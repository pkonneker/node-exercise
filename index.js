var express = require('express');
var rp = require('request-promise');

var app = express();

// Serve two endpoints
// both return json
// both hit a swapi endpoint and get all the things in it
// planets will then recursively swapi down and grab all the people on a planet
//   and replace their urls with their full name

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
