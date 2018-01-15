var express = require('express');
var path = require('path');
var busboy = require('connect-busboy');
var fs = require('fs');
var multer = require('multer');                        // for parsing multipart/form-data
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/images/upload/'); // set the destination
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
    // Prevent multiple Plutos from being created
    if ( planetsDB.count() > 8 ) {
        return response.status( 500 ).json( {message: "Error: Pluto already exits!"} );
    }

    // Validation rule: mandatory properties
    if ( request.body.name == null ) {
        return response.status( 500 ).json( {message: "Error: missing name (string)"} );
    }
    if ( request.body.overview == null ) {
        return response.status( 500 ).json( {message: "Error: missing overview (string)"} );
    }
    if ( request.body.description == null ) {
        return response.status( 500 ).json( {message: "Error: missing description (string)"} );
    }
    if ( request.body.distanceFromSun == null ) {
        return response.status( 500 ).json( {message: "Error: missing distance from Sun (double)"} );
    }
    if ( request.body.numberOfMoons == null ) {
        return response.status( 500 ).json( {message: "Error: missing number of moons (int)"} );
    }

    // Validation rule: force planetId (if exists)
    if ( request.body.planetId != null ) {
        request.body.planetId = 0;
    }

    request.body.image = 'images/noimagefound.jpg';

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
.post(upload.single('image'), function (request, response, next) {
    // Prevent multiple Plutos from being created
    if ( planetsDB.count() > 8 ) {
        return response.status( 500 ).json( {message: "Error: Pluto already exits!"} );
    }

    // Validation rule: mandatory properties
    if ( request.body.name == null ) {
        return response.status( 500 ).json( {message: "Error: missing name (string)"} );
    }
    if ( request.body.overview == null ) {
        return response.status( 500 ).json( {message: "Error: missing overview (string)"} );
    }
    if ( request.body.description == null ) {
        return response.status( 500 ).json( {message: "Error: missing description (string)"} );
    }
    if ( request.body.distanceFromSun == null ) {
        return response.status( 500 ).json( {message: "Error: missing distance from Sun (double)"} );
    }
    if ( request.body.numberOfMoons == null ) {
        return response.status( 500 ).json( {message: "Error: missing number of moons (int)"} );
    }

    // Validation rule: force planetId (if exists)
    if (request.body.planetId != null) {
        request.body.planetId = 0;
    }

    // validate mime-type of image file
    if ( request.file.mimetype != 'image/jpeg' && request.file.mimetype != 'image/png' ) {
        return response.status(500).json({message: "Error: must upload image/jpeg or image/png for the planet's image."});
    }
    request.body.image = "images/upload/" + request.file.originalname;

    planetsDB.save( request.body );
    response.json( request.body );
    console.log( 'POST (form) planet: ' + request.body.name );
    console.log( request.body );
    console.log( request.file );
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
                .json( {message: "Planet with Id " + request.params.planetId + " not found!"} );
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
            return response.status( 500 ).json( {message: "Error: missing name (string)"} );
        }
        if ( request.body.overview == null ) {
            return response.status( 500 ).json( {message: "Error: missing overview (string)"} );
        }
        if ( request.body.description == null ) {
            return response.status( 500 ).json( {message: "Error: missing description (string)"} );
        }
        if ( request.body.distanceFromSun == null ) {
            return response.status( 500 ).json( {message: "Error: missing distance from Sun (double)"} );
        }
        if ( request.body.numberOfMoons == null ) {
            return response.status( 500 ).json( {message: "Error: missing number of moons (int)"} );
        }
        if ( request.body.image == null ) {
            return response.status( 500 ).json( {message: "Error: missing image (string))"} );
        }

        // Validation rule: body's planetId must match query param's planetId
        if ( request.body.planetId != null ) {
            if (request.body.planetId != request.params.planetId) {
                return response.status( 500 )
                        .json( {message: "Error: planetId does not match"} );
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
                .json( {message: "Planet with Id " + request.params.planetId + " not found!"} );
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
            return response.status( 500 )
                           .json( {message: "Error: cannot delete this planet."} );
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
                .json( {message: "Planet with Id " + request.params.planetId + " not found!"} );
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
                .json( {message: "Planet with Id " + request.params.planetId + " not found!"} );
    }
})

/**
 * HTTP POST /planets/:planetId/image
 * Param: :planetId is the unique identifier of the planet
 * Returns: the planet with the specified :planetId in a JSON format
 * Error: 404 HTTP code if the planet doesn't exist
 */
.post(function (request, response) {
    var fstream;
    request.pipe(request.busboy);
    request.busboy.on('file', function (fieldname, file, filename, encoding, mimetypes) {
        console.log("Fieldname, filename, encoding, mimetypes: "
                   + fieldname + " " + filename + " " + encoding + " " + mimetypes);
        if ( mimetypes != 'image/jpeg' && mimetypes != 'image/png' ) {
            return response.status(500).json({message: "Error: must upload image/jpeg or image/png for the building's image."});
        }
        fstream = fs.createWriteStream('./public/images/upload/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            try {
                thePlanet = planetsDB.find( request.params.planetId );
                thePlanet.image = 'images/upload/' + filename;
                planetsDB.save( thePlanet );
                response.json( thePlanet );
                console.log( 'POST (uploaded) image: ' + thePlanet.image );
            } catch (exception) {
                console.log(exception);
                response.status( 404 )
                        .json( {message: "Planet with Id " + request.params.planetId + " not found!" + " " + exception} );
            }
        });
    });
});

module.exports = planetRouter;
