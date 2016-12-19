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
    response.json( planetsDB.findAll() );
})

/**
 * HTTP POST /planets
 * Create a new planet.
 * Param: planet JSONObject
 * Returns: the newly created planet in JSON
 * Error: 500 HTTP code if the planet cannot be created
 */
.post(function (request, response, next) {
    try {
        console.log( request.body );
        planetsDB.save( request.body );
        response.json( request.body );
        console.log( 'POST (create) planet: ' + request.body.name );
    } catch (expection) {
        console.log( expection );
        response.status( 500 )
                .send( "Error: could not create planet: " + request.body.name );
    }
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
})

/**
 * HTTP PUT /planets
 * Create a new planet.
 * Returns: the newly created planet in JSON
 * Error: 500 HTTP code if the planet cannot be updated
 */
.put(function (request, response, next) {
    try {
        console.log( request.body );
        planetsDB.save( request.body );
        response.json( request.body );
        console.log( 'PUT (update) planet: ' + request.body.name );
    } catch (expection) {
        console.log( expection );
        response.status( 500 )
                .send( "Error: could not update planet: " + request.body.name );
    }
})

/**
 * HTTP DELETE /planets/:planetId
 * Param: :planetId is the unique identifier of the planet you want to delete
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exists
 */
.delete(function (request, response, next) {
    try {
        planetsDB.remove( request.params.planetId );
        response.json( request.params.planetId );
    } catch (exception) {
        response.status( 500 )
                .send( "Error: could not delete planetId: " + request.params.planetId );
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
