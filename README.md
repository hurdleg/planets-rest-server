# REST API Server for the Planets of Our Solar System

## Suported REST API

| Verb | URL           |  Description        |
|------|:-------------:| ------------------ :|
| GET  | /planets/     | Get list of planets |
| GET  | /planets/:id  | Get planet by id    |

## Installation
Grab all of the required node modules for this app.
1. npm install

> This step is only performed once.

## Usage
1. npm start
2. Open a browser
   * http://localhost:3000/
   * http://localhost:3000/planets
   * http://localhost:3000/planets/{0..7}
3. To stop the Express server, type `control-C`

## Error Handling
1. http://localhost:3000/bogus

   404 - Not Found

2. http://localhost:3000/planets/8

   404 - Planet with Id 8 not found!

## References
All of the planet information and images were downloaded from:
1. [Solar System Exploration](http://solarsystem.nasa.gov/planets/) by [NASA](http://http://www.nasa.gov/)

