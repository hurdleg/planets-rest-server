var express = require('express');

var planetRouter = express.Router();

var planets = [
    {
        "id": 0,
        "name": "Mercury",
        "overview": "The Swiftest Planet",
        "image": "images/mercury.png",
        "description": "Mercury's eccentric orbit takes the small planet as close as 47 million km (29 million miles) and as far as 70 million km (43 million miles) from the sun. If one could stand on the scorching surface of Mercury when it is at its closest point to the sun, the sun would appear more than three times as large as it does when viewed from Earth.",
        "distance_from_sun": 0.39,
        "number_of_moons": 0
    },
    {
        "id": 1,
        "name": "Venus",
        "overview": "Planetary Hot Spot",
        "image": "images/venus.png",
        "description": "Similar in structure and size to Earth, Venus' thick, toxic atmosphere traps heat in a runaway greenhouse effect. A permanent layer of clouds traps heat, creating surface temperatures hot enough to melt lead. Glimpses below the clouds reveal volcanoes and deformed mountains. Venus spins slowly in the opposite direction of most planets.",
        "distance_from_sun": 0.72,
        "number_of_moons": 0
    },
    {
        "id": 2,
        "name": "Earth",
        "overview": "Our Home Planet",
        "image": "images/earth.png",
        "description": "Earth, our home planet, is the only planet in our solar system known to harbor life - life that is incredibly diverse. All the things we need to survive exist under a thin layer of atmosphere that separates us from the cold, airless void of space.",
        "distance_from_sun": 1,
        "number_of_moons": 1
    },
    {
        "id": 3,
        "name": "Mars",
        "overview": "The Red Planet",
        "image": "images/mars.png",
        "description": "Mars is a cold desert world. It is half the diameter of Earth and has the same amount of dry land. Like Earth, Mars has seasons, polar ice caps, volcanoes, canyons and weather, but its atmosphere is too thin for liquid water to exist for long on the surface. There are signs of ancient floods on Mars, but evidence for water now exists mainly in icy soil and thin clouds.",
        "distance_from_sun": 1.52,
        "number_of_moons": 2
    },
    {
        "id": 4,
        "name": "Jupiter",
        "overview": "King of the Planets",
        "image": "images/jupiter.png",
        "description": "Jupiter, the most massive planet in our solar system -- with dozens of moons and an enormous magnetic field -- forms a kind of miniature solar system. Jupiter does resemble a star in composition, but it did not grow big enough to ignite. The planet's swirling cloud stripes are punctuated by massive storms such as the Great Red Spot, which has raged for hundreds of years.",
        "distance_from_sun": 5.2,
        "number_of_moons": 67
    },
    {
        "id": 5,
        "name": "Saturn",
        "overview": "Jewel of Our Solar System",
        "image": "images/saturn.png",
        "description": "Adorned with thousands of beautiful ringlets, Saturn is unique among the planets. All four gas giant planets have rings -- made of chunks of ice and rock -- but none are as spectacular or as complicated as Saturn's. Like the other gas giants, Saturn is mostly a massive ball of hydrogen and helium.",
        "distance_from_sun": 9.5,
        "number_of_moons": 62
    },
    {
        "id": 6,
        "name": "Uranus",
        "overview": "The Sideways Planet",
        "image": "images/uranus.png",
        "description": "Uranus is the only giant planet whose equator is nearly at right angles to its orbit. A collision with an Earth-sized object may explain the unique tilt. Nearly a twin in size to Neptune, Uranus has more methane in its mainly hydrogen and helium atmosphere than Jupiter or Saturn. Methane gives Uranus its blue tint.",
        "distance_from_sun": 19.19,
        "number_of_moons": 27
    },
    {
        "id": 7,
        "name": "Neptune",
        "overview": "The Windiest Planet",
        "image": "images/neptune.png",
        "description": "Dark, cold and whipped by supersonic winds, Neptune is the last of the hydrogen and helium gas giants in our solar system. More than 30 times as far from the sun as Earth, the planet takes almost 165 Earth years to orbit our sun. In 2011 Neptune completed its first orbit since its discovery in 1846.",
        "distance_from_sun": 30.07,
        "number_of_moons": 14
    }
];

planetRouter.route('/')
.get(function (req, res, next) {
    if ( !planets ) {
        var noPlanets = new Error( "No planets!" );
        noPlanets.status = 500;
        return next( noPlanets );
    }
    res.json( planets );
});

planetRouter.route('/:planetId')
.get(function (req, res, next) {
    if ( !planets ) {
        var noPlanets = new Error( "No planets!" );
        noPlanets.status = 500;
        return next( noPlanets );
    }

    // Find the planet
    var numberOfPlanets = planets.length;
    for( var i = 0; i < numberOfPlanets; i++ ) {
        if ( planets[i].id == req.params.planetId ) {
            return res.json( planets[i] );
        }
    }

    // Error: planetId not found
    var err = new Error("Planet with Id " + req.params.planetId + " not found!");
    err.status = 500;
    return next( err );
});

module.exports = planetRouter;
