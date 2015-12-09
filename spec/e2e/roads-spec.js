var arrayContaining = jasmine.arrayContaining;
var objectContaining = jasmine.objectContaining;

describe('roads client library', function() {
  var googleMaps = require('./service');

  it('gets points snapped to roads', function(done) {
    googleMaps.snapToRoads({
      path: [
        [60.170880, 24.942795],
        [60.170879, 24.942796],
        [60.170877, 24.942796]
      ],
      interpolate: true
    })
    .asPromise(function(response) {
      expect(response.json.snappedPoints).toEqual(
          arrayContaining([
            objectContaining({
              originalIndex: 0,
              placeId: 'ChIJNX9BrM0LkkYRIM-cQg265e8'
            })
          ]));
    })
    .then(done, fail);
  });

  it('gets speed limits for place IDs', function(done) {
    googleMaps.speedLimits({
      placeId: [
        'ChIJ58xCoGlNFmsRUEZUbW7qABM',
        'ChIJ9RhaiGlNFmsR0IxAbW7qABM',
        'ChIJabjuhGlNFmsREIxAbW7qABM'
      ],
      units: 'KPH'
    })
    .asPromise(function(response) {
      expect(response.json.speedLimits).toEqual(
          arrayContaining([
            objectContaining({
              speedLimit: 60,
              units: 'KPH'
            })
          ]));
    })
    .then(done, fail);
  });

  it('gets speed limits for a path', function(done) {
    googleMaps.snappedSpeedLimits({
      path: [
        [60.170880, 24.942795],
        [60.170879, 24.942796],
        [60.170877, 24.942796]
      ],
      units: 'MPH'
    })
    .asPromise()
    .then(function(response) {
      expect(response.json.speedLimits).toEqual(
          arrayContaining([
            objectContaining({
              speedLimit: closeTo(19, 1),
              units: 'MPH'
            })
          ]));
    })
    .then(done, fail);
  });

  function closeTo(expected, delta) {
    return {asymmetricMatch: function(actual) {
      return Math.abs(actual - expected) < delta;
    }};
  }

});
