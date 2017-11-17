var express = require('express');
var path = require('path');
var busboy = require('connect-busboy');
var fs = require('fs');

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
    // Validation rule: mandatory properties
    if (!(request.body.name)) {
        response.status( 500 )
        .send( "Error: missing name (string)" );
        return;
    }
    if (!(request.body.overview)) {
        response.status( 500 )
        .send( "Error: missing overview (string)" );
        return;
    }
    if (!(request.body.description)) {
        response.status( 500 )
        .send( "Error: missing description (string)" );
        return;
    }
    if (!(request.body.distance_from_sun)) {
        response.status( 500 )
        .send( "Error: missing distance from sun (float)" );
        return;
    }

    if (request.body.planetId) {
        request.body.planetId = 0;
    }

    console.log( request.body );
    if ( !(request.body.image)) {
        request.body.image = 'images/noimagefound.jpg';
    }
    planetsDB.save( request.body );
    response.json( request.body );
    console.log( 'POST (create) planet: ' + request.body.name );
});

/**
 * HTTP GET /planets/:planetId
 * Param: :planetId is the unique identifier of the planet you want to retrieve
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exist
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
 * HTTP PUT /planets/:planetId
 * Param: :planetId is the unique identifier of the planet you want to update
 * Returns: the updated planet in JSON
 * Error: 404 HTTP code if the planet doesn't exist
 * Error: 500 HTTP code if the plance can't be updated
 */
.put(function (request, response, next) {
    try {
        thePlanet = planetsDB.find( request.params.planetId );
        // Validation rule: mandatory properties
        if (!(request.body.name)) {
            response.status( 500 )
            .send( "Error: missing name (string)" );
            return;
        }
        if (!(request.body.overview)) {
            response.status( 500 )
            .send( "Error: missing overview (string)" );
            return;
        }
        if (!(request.body.description)) {
            response.status( 500 )
            .send( "Error: missing description (string)" );
            return;
        }
        if (!(request.body.distance_from_sun)) {
            response.status( 500 )
            .send( "Error: missing distance from sun (float)" );
            return;
        }
        if (!(request.body.image)) {
            response.status( 500 )
            .send( "Error: missing image (string))" );
            return;
        }

        if (request.body.planetId) {
            request.body.planetId = request.params.planetId;
        }

        console.log( request.body );
        planetsDB.save( request.body );
        response.json( request.body );
        console.log( 'PUT (update) planet: ' + request.body.name );
    } catch (expection) {
        console.log( expection );
        response.status( 404 )
                .send( "Planet with Id " + request.params.planetId + " not found!" );
    }
})

/**
 * HTTP DELETE /planets/:planetId
 * Param: :planetId is the unique identifier of the planet you want to delete
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exist
 * Error: 500 HTTP code if the planet Id is not 8 (for Pluto)
 */
.delete(function (request, response, next) {
    try {
        // Validation rule: prevent deleting Mars..Earth..Neptune
        if ( request.params.planetId <= 7 ) {
            response.status( 500 )
            .send( "Error: cannot delete this planet." );
            return;
        }

        thePlanet = planetsDB.find( request.params.planetId );
        planetsDB.remove( request.params.planetId );
        if ( (thePlanet.image != 'images/noimagefound.jpg') &&
             (thePlanet.image != 'images/pluto.jpeg') ) {
            fs.unlinkSync('public/' + thePlanet.image);
        }
        response.json( thePlanet );
    } catch (exception) {
        console.log(exception);
        response.status( 404 )
                .send( "Planet with Id " + request.params.planetId + " not found!" );
    }
});

/**
 * HTTP GET /planets/:planetId/image
 * Param: :planetId is the unique identifier of the planet
 * Returns: the image for :planetId in binary format
 * Error: 404 HTTP code if the planet doesn't exist
 * Reference: expressjs.com API for res.sendFile()
 */
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
})

/**
 * HTTP POST /planets/:planetId/image
 * Param: :planetId is the unique identifier of the planet
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exist
 */
.post(function (req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetypes) {
        console.log("Fieldname, filename, encoding, mimetypes: "
                   + fieldname + " " + filename + " " + encoding + " " + mimetypes);
        if ( mimetypes != 'image/jpeg' && mimetypes != 'image/png' ) {
            return res.status(500).json({message: "Error: must upload image/jpeg or image/png for the building's image."});
        }
        fstream = fs.createWriteStream('./public/images/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            try {
                thePlanet = planetsDB.find( req.params.planetId );
                thePlanet.image = 'images/' + filename;
                planetsDB.save( thePlanet );
                res.send( thePlanet );
            } catch (exception) {
                console.log(exception);
                if (req.params.planetId >= 8) {
                    fs.unlinkSync('public/images/' + filename);
                }
                res.status( 404 )
                        .send( "Planet with Id " + req.params.planetId + " not found!" );
            }
        });
    });
});

module.exports = planetRouter;
