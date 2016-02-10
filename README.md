Node.js Client for Google Maps Services
=======================================

Use Node.js? Want to [geocode][Geocoding API] something? Looking
for [directions][Directions API]?
This library brings the [Google Maps API Web Services] to your Node.js
application. ![Analytics](https://maps-ga-beacon.appspot.com/UA-12846745-20/google-maps-services-js/readme?pixel)

The Node.js Client for Google Maps Services is a Node.js Client library
for the following Google Maps APIs:

 - [Directions API]
 - [Distance Matrix API]
 - [Elevation API]
 - [Geocoding API]
 - [Places API]
 - [Roads API]
 - [Time Zone API]

Keep in mind that the same [terms and conditions](https://developers.google.com/maps/terms)
apply to usage of the APIs when they're accessed through this library.

## Features

 - **Retry on Failure** Automatically retry when intermittent failures occur.
   That is, when any of the retryable 5xx errors are returned from the API.

 - **Rate-limiting** Requests are rate-limited by the client, which helps
   prevent reaching the server-enforced rate limit.

## Quick Start

    $ npm install @google/maps

Create a new client object by calling `createClient()`

```js
var googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here'
});
```

Make requests to the Google Maps APIs by calling methods on the client object.

```js
// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});
```

For more usage examples, check out [the tests](spec/e2e/).

View the [reference documentation](https://googlemaps.github.io/google-maps-services-js/docs/)

Additional documentation for the included web services is available at
https://developers.google.com/maps/.

## API keys

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

Your API key should be 40 characters long, and begin with `AIza`. You can now
create a client object:

```js
var googleMapsClient = require('@google/maps').createClient({
  key: 'your API key here'
});
```

### Client IDs

Maps API for Work customers can use their [client ID and secret][clientid] to authenticate.

```js
var googleMapsClient = require('@google/maps').createClient({
  clientId: 'Add your client ID here',
  clientSecret: 'Add your client secret here',
});
```

**Important:** This key should be kept secret on your server.

## Developing

In order to run the end-to-end tests, you'll need to supply your API key via an
environment variable.

    $ export GOOGLE_MAPS_API_KEY=AIza-your-api-key
    $ npm test

## Support

This library is community supported. We're comfortable enough with the
stability and features of the library that we want you to build real
production applications on it. We will try to support, through Stack
Overflow, the public surface of the library and maintain
backwards compatibility in the future; however, while the library is in
version 0.x, we reserve the right to make backwards-incompatible
changes. If we do remove some functionality (typically because better
functionality exists or if the feature proved infeasible), our intention
is to deprecate and give developers a year to update their code.

If you find a bug, or have a feature suggestion, please
[log an issue][issues]. If you'd like to contribute, please read
[How to Contribute][contrib].

## Command-line Interface

Installing via npm also provides the `googlemaps` command-line utility,
which can then be used to pipe JSON results to other command-line programs:

```
$ googlemaps directions --origin 'Sydney Town Hall' --destination 'Parramatta, NSW'
```

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
