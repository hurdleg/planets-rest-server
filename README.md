# RESTful API Server for the Planets of Our Solar System

## Suported RESTful API

| Title                  | URL                | Request type | Parameters | Expected Responses         |
|------------------------|:------------------:|:------------:|:----------:|:--------------------------:|
| Get list of planets    | /planets           | GET          | n/a        | Success: 200, Failure: 404 |
| Get planet by ID       | /planets/:id       | GET          | planetId   | Success: 200, Failure: 404 |
| Get image for planetId | /planets/:id/image | GET          | planetId   | Success: 200, Failure: 404 |

## Installation (localhost)
1. git clone https://github.com/hurdleg/planets-rest-server
2. cd planets-rest-server
3. npm install

> This step is done once.

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

## Installation (IBM Cloud)
1. build and test app http://localhost:3000
2. add: mainfest.yml
3. edit: ./bin/www > var port = normalizePort(process.env.VCAP_APP_PORT || '3000');
4. edit: package.json > add: cf modules
5. copy: .cfignore
6. ibmcloud login
7. imbcloud target -o MADandD -s prod
8. ibmcloud target ## verify settings
9. ibmcloud cf push

## Usage (IBM Cloud)
1. Open a browser
   * https://planets.mybluemix.net
   * https://planets.mybluemix.net/planets
   * https://planets.mybluemix.net/planets/{0..7}
   * https://planets.mybluemix.net/planets/{0..7}/image

#### Enjoy!
*hurdleg*

## Source Code
Available from GitHub:
https://github.com/hurdleg/planets-rest-server

## References
All of the planet information and images were downloaded from:
1. [Solar System Exploration](http://solarsystem.nasa.gov/planets/) by [NASA](http://www.nasa.gov)

