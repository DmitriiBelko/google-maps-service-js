Node.js Client for Google Maps Services
=======================================

Use Node.js? Want to [geocode][Geocoding API] something? Looking
for [directions][Directions API]? Maybe [matrices of directions][Distance Matrix API]?
This library brings the [Google Maps API Web Services] to your Node.js
application. ![Analytics](https://ga-beacon.appspot.com/UA-12846745-20/google-maps-services-js/readme?pixel)

The Node.js Client for Google Maps Services is a Node.js Client library
for the following Google Maps APIs:

 - [Directions API]
 - [Distance Matrix API]
 - [Elevation API]
 - [Geocoding API]
 - [Time Zone API]
 - [Roads API]
 - [Places API]

Keep in mind that the same [terms and conditions](https://developers.google.com/maps/terms)
apply to usage of the APIs when they're accessed through this library.

## Support

This library is community supported. We're comfortable enough with the
stability and features of the library that we want you to build real
production applications on it. We will try to support, through Stack
Overflow, the public and protected surface of the library and maintain
backwards compatibility in the future; however, while the library is in
version 0.x, we reserve the right to make backwards-incompatible
changes. If we do remove some functionality (typically because better
functionality exists or if the feature proved infeasible), our intention
is to deprecate and give developers a year to update their code.

If you find a bug, or have a feature suggestion, please
[log an issue][issues]. If you'd like to contribute, please read
[How to Contribute][contrib].

## Requirements

 - Node.js v0.12 or later.
 - A Google Maps API key.

### API keys

Each Google Maps Web Service requires an API key or Client ID. API keys
are freely available with a Google Account at
https://developers.google.com/console. To generate a server key for
your project:

 1. Visit https://developers.google.com/console and log in with
    a Google Account.
 1. Select an existing project, or create a new project.
 1. Click **Enable an API**.
 1. Browse for the API, and set its status to "On". The Node.js Client for Google Maps Services
    accesses the following APIs:
    * Directions API
    * Distance Matrix API
    * Elevation API
    * Geocoding API
    * Time Zone API
    * Roads API
 1. Once you've enabled the APIs, click **Credentials** from the left navigation of the Developer
    Console.
 1. In the "Public API access", click **Create new Key**.
 1. Choose **Server Key**.
 1. If you'd like to restrict requests to a specific IP address, do so now.
 1. Click **Create**.

Your API key should be 40 characters long, and begin with `AIza`.

**Important:** This key should be kept secret on your server.

## Installation

    $ npm install @google/maps

## Developer Documentation

Additional documentation for the included web services is available at
https://developers.google.com/maps/.

 - [Directions API]
 - [Distance Matrix API]
 - [Elevation API]
 - [Geocoding API]
 - [Time Zone API]
 - [Roads API]
 - [Places API]

## Usage

This example uses the [Geocoding API].


```js
var config = {
  key: 'Add Your Key here'
};
var googlemaps = require('@google/maps').init(config);

// Geocoding an address
var query = {
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
};
googlemaps.geocode(query, function(err, response) {
  if (err != null) {
    console.log(response.json.results);
  }
});

// Look up an address with reverse geocoding
var query = {
  latlng: [40.714224, -73.961452]
};
googlemaps.reverseGeocode(query, function(err, response) {
  if (err != null) {
    console.log(response.json.results);
  }
});

// Request directions via public transit
var now = new Date();
var query = {
  origin: 'Sydney Town Hall',
  destination: 'Parramatta, NSW',
  mode: 'transit',
  departure_time: now.getTime()
};
googlemaps.directions(query, function(err, response) {
  if (err != null) {
    console.log(response.json.routes);
  }
});
```

For more usage examples, check out [the tests](spec/e2e).

## Features

### Retry on Failure

Automatically retry when intermittent failures occur. That is, when any of the retriable 5xx errors
are returned from the API.

### Keys *and* Client IDs

Maps API for Work customers can use their [client ID and secret][clientid] to authenticate. Free
customers can use their [API key][apikey], too.

[apikey]: https://developers.google.com/maps/faq#keysystem
[clientid]: https://developers.google.com/maps/documentation/business/webservices/auth

[Google Maps API Web Services]: https://developers.google.com/maps/documentation/webservices/
[Directions API]: https://developers.google.com/maps/documentation/directions/
[Distance Matrix API]: https://developers.google.com/maps/documentation/distancematrix/
[Elevation API]: https://developers.google.com/maps/documentation/elevation/
[Geocoding API]: https://developers.google.com/maps/documentation/geocoding/
[Time Zone API]: https://developers.google.com/maps/documentation/timezone/
[Roads API]: https://developers.google.com/maps/documentation/roads/
[Places API]: https://developers.google.com/places/

[issues]: https://github.com/googlemaps/google-maps-services-js/issues
[contrib]: https://github.com/googlemaps/google-maps-services-js/blob/master/CONTRIB.md
