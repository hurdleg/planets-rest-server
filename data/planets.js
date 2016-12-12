/**
 * PlanetRepository class deals with planet persistence
 *
 * References:
 * 1. A simple REST API with Node.js and Express (https://gist.github.com/erichonorez/4750663)
 * 2. Node.js Module Patterns using Simple Example (https://darrenderidder.github.io/talks/ModulePatterns/#/)
 */
var PlanetRepository = function () {
    this.planets = require( './planet-data.json' );
    this.nextId = this.planets.length;
}
/**
 * Find a planet by id
 * Param: id of the planet to find
 * Returns: the planet corresponding to the specified id
 */
PlanetRepository.prototype.find = function (id) {
    var planet = this.planets.filter(function(planet) {
        return planet.planetId == id;
    })[0];
    if (null == planet) {
        throw new Error('planet not found');
    }
    return planet;
}
/**
 * Find the index of a planet
 * Param: id of the planet to find
 * Returns: the index of the planet identified by id
 */
PlanetRepository.prototype.findIndex = function (id) {
    var index = null;
    this.planets.forEach(function(planet, key) {
        if (planet.planetId == id) {
            index = key;
        }
    });
    if (null == index) {
        throw new Error('planet not found');
    }
    return index;
}
/**
 * Retrieve all planets
 * Returns: array of planets
 */
PlanetRepository.prototype.findAll = function () {
    return this.planets;
}
/**
 * Save a planet (create or update)
 * Param: planet the planet to save
 */
PlanetRepository.prototype.save = function (planet) {
    if (planet.planetId == null || planet.planetId == 0) {
        if (this.nextId === 8) {    // only one more planet can be added (Pluto)
            planet.planetId = this.nextId;
            this.planets.push(planet);
            this.nextId++;
        }
    } else {
        if ( this.nextId <= 8 ) {   // prevent updating the original 8 planets
            return;                 // , and only update the extra planet (Pluto)
        }
        var index = this.findIndex(planet.planetId);
        this.planets[index] = planet;
    }
}
/**
 * Remove a planet
 * Param: id the of the planet to remove
 */
PlanetRepository.prototype.remove = function (id) {
    if ( this.nextId <= 8 ) {   // prevent deleting the original 8 planets
        return;                 // , and only delete the extra planet (Pluto)
    }
    var index = this.findIndex(id);
    this.planets.splice(index, 1);
    this.nextId = this.nextId - 1;
}

exports.PlanetRepository = new PlanetRepository();
