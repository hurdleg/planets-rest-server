var express = require('express');
var path = require('path');
var planetsDB = require('../data/planets.js').PlanetRepository;

var planetRouter = express.Router();

/**
 * HTTP GET /planets
 * Returns: the list of planets in JSON format
 */
planetRouter.route('/')
.get(function (request, response, next) {
    response.json( {planets: planetsDB.findAll()} );
});

/**
 * HTTP GET /planets/:planetId
 * Param: :planetId is the unique identifier of the planet you want to retrieve
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exists
 */
planetRouter.route('/:planetId')
.get(function (request, response, next) {
    try {
        response.json( planetsDB.find(request.params.planetId) );
    } catch (exception) {
        response.status( 404 )
                .send( "Planet with Id " + request.params.planetId + " not found!" );
    }
});

// Reference: expressjs.com API for res.sendFile()
planetRouter.route('/:planetId/image')
.get(function (request, response, next) {
    try {
        thePlanet = planetsDB.find( request.params.planetId );
        var options = {
            root: path.resolve( 'public/' ),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        response.sendFile( thePlanet.image, options, function(err) {
            if ( err ) {
                console.log( err );
                response.status(err.status).end();
            } else {
                console.log( 'Sent', thePlanet.image );
            }
        });
    } catch (exception) {
        console.log(exception);
        response.status( 404 )
                .send( "Planet with Id " + request.params.planetId + " not found!" );
    }
});

module.exports = planetRouter;
