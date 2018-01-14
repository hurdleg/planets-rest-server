var express = require('express');
var path = require('path');
var busboy = require('connect-busboy');
var fs = require('fs');
var multer = require('multer');                        // for parsing multipart/form-data
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/images/upload'); // set the destination
    },
    filename: function(req, file, callback){
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        if (ext == "") {
            switch (file.mimetype) {
                case 'image/jpeg':
                    ext = '.jpeg';
                    break;
                case 'image/png':
                    ext = '.png';
                    break;
            }
            callback(null, file.originalname + ext); // set the file name and extension
        } else {
            callback(null, file.originalname);
        }
    }
});
var upload = multer({storage: storage});

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
    if ( request.body.name == null ) {
        response.status( 500 )
        .send( "Error: missing name (string)" );
        return;
    }
    if ( request.body.overview == null ) {
        response.status( 500 )
        .send( "Error: missing overview (string)" );
        return;
    }
    if ( request.body.description == null ) {
        response.status( 500 )
        .send( "Error: missing description (string)" );
        return;
    }
    if ( request.body.distanceFromSun == null ) {
        response.status( 500 )
        .send( "Error: missing distance from Sun (double)" );
        return;
    }
    if ( request.body.numberOfMoons == null ) {
        response.status( 500 )
        .send( "Error: missing number of moons (int)" );
        return;
    }

    // Validation rule: force planetId (if exists)
    if ( request.body.planetId != null ) {
        request.body.planetId = 0;
    }

    // Default image if not found in body
    if ( request.body.image != null ) {
        request.body.image = 'images/noimagefound.jpg';
    }

    planetsDB.save( request.body );
    response.json( request.body );
    console.log( 'POST (create) planet: ' + request.body.name );
    console.log( request.body );
});

/**
 * HTTP POST /planets/form
 * Create a new planet AND upload image
 * Param: planet JSONObject
 * Returns: the newly created planet in JSON
 * Error: 500 HTTP code if the planet cannot be created
 */
planetRouter.route('/form')
.post(upload.single('image'), function (req, res, next) {
    console.log("HERE");
    // validate mime-type of image file
    if ( req.file.mimetype != 'image/jpeg' && req.file.mimetype != 'image/png' ) {
        return res.status(500).json({message: "Error: must upload image/jpeg or image/png for the planet's image."});
    }

    // Validation rule: mandatory properties
    if ( request.body.name == null ) {
        response.status( 500 )
        .send( "Error: missing name (string)" );
        return;
    }
    if ( request.body.overview == null ) {
        response.status( 500 )
        .send( "Error: missing overview (string)" );
        return;
    }
    if ( request.body.description == null ) {
        response.status( 500 )
        .send( "Error: missing description (string)" );
        return;
    }
    if ( request.body.distanceFromSun == null ) {
        response.status( 500 )
        .send( "Error: missing distance from Sun (double)" );
        return;
    }
    if ( request.body.numberOfMoons == null ) {
        response.status( 500 )
        .send( "Error: missing number of moons (int)" );
        return;
    }

    // Validation rule: force planetId (if exists)
    if (req.body.planetId != null) {
        req.body.planetId = 0;
    }

    req.body.image = "images/upload/" + req.file.originalname;

    planetsDB.save( req.body );
    res.json( req.body );
    console.log( 'POST (form) planet: ' + req.body.name );
    console.log( req.body );
    console.log( req.file );
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
        if ( request.body.name == null ) {
            response.status( 500 )
            .send( "Error: missing name (string)" );
            return;
        }
        if ( request.body.overview == null ) {
            response.status( 500 )
            .send( "Error: missing overview (string)" );
            return;
        }
        if ( request.body.description == null ) {
            response.status( 500 )
            .send( "Error: missing description (string)" );
            return;
        }
        if ( request.body.distanceFromSun == null ) {
            response.status( 500 )
            .send( "Error: missing distance from Sun (double)" );
            return;
        }
        if ( request.body.numberOfMoons == null ) {
            response.status( 500 )
            .send( "Error: missing number of moons (int)" );
            return;
        }
        if ( request.body.image == null ) {
            response.status( 500 )
            .send( "Error: missing image (string))" );
            return;
        }

        // Validation rule: body's planetId must match query param's planetId
        if ( request.body.planetId != null ) {
            if (request.body.planetId != request.params.planetId) {
                response.status( 500 )
                .send( "Error: planetId does not match" );
                return;
            }
        }

        console.log( request.body );
        planetsDB.save( request.body );
        response.json( request.body );
        console.log( 'PUT (update) planet: ' + request.body.name );
        console.log( request.body );

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
 * Error: 500 HTTP code if the planet Id <= 7
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
        console.log( 'DELETE planet Id: ' + thePlanet.planetId );
        console.log( JSON.stringify(thePlanet) );
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
        fstream = fs.createWriteStream('./public/images/upload/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            try {
                thePlanet = planetsDB.find( req.params.planetId );
                thePlanet.image = 'images/upload/' + filename;
                planetsDB.save( thePlanet );
                res.json( thePlanet );
                console.log( 'POST (uploaded) image: ' + thePlanet.image );
            } catch (exception) {
                console.log(exception);
                if (req.params.planetId >= 8) {
                    fs.unlinkSync('public/images/upload' + filename);
                }
                res.status( 404 )
                        .send( "Planet with Id " + req.params.planetId + " not found!" + " " + exception );
            }
        });
    });
});

module.exports = planetRouter;
