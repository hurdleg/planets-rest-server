var express = require('express');
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
 * Error: 404 HTTP code if the task doesn't exists
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

module.exports = planetRouter;
