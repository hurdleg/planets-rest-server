# REST API Server for the Planets of Our Solar System

## Suported REST API

| Title                  | URL                | Request type | Parameters | Expected Responses         |
|------------------------|:------------------:|:------------:|:----------:|:--------------------------:|
| Get list of planets    | /planets           | GET          | n/a        | Success: 200, Failure: 404 |
| Get planet by ID       | /planets/:id       | GET          | planetId   | Success: 200, Failure: 404 |
| Get image for planetId | /planets/:id/image | GET          | planetId   | Success: 200, Failure: 404 |

## Installation (Bluemix)
1. build and test app http://localhost:3000
2. add: mainfest.yml
3. edit: ./bin/www > var port = normalizePort(process.env.VCAP_APP_PORT || '3000');
4. edit: package.json > add: cf modules
5. copy: .cfignore
6. cf login # email / pw
7. cf push

Enjoy!

## Installation (localhost)
Grab all of the required node modules for this app.
1. npm install

> This step is done once.

## Usage (Bluemix)
1. Open a browser
   * https://planets-hurdleg.mybluemix.net
   * https://planets-hurdleg.mybluemix.net/planets
   * https://planets-hurdleg.mybluemix.net/planets/{0..7}
   * https://planets-hurdleg.mybluemix.net/planets/{0..7}/image

## Usage (localhost)
1. npm start
2. Open a browser
   * http://localhost:3000
   * http://localhost:3000/planets
   * http://localhost:3000/planets/{0..7}
   * http://localhost:3000/planets/{0..7}/image
3. To stop the Express server, type `control-C`

## Error Handling
1. http://localhost:3000/bogus

   404 - Not Found

2. http://localhost:3000/planets/8

   404 - Planet with Id 8 not found!

## References
All of the planet information and images were downloaded from:
1. [Solar System Exploration](http://solarsystem.nasa.gov/planets/) by [NASA](http://www.nasa.gov)

