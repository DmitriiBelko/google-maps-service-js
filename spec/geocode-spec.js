var apiKey = null;  // TODO(step): Read key out of environment.

describe('geocode client library', function() {
  var googleServices;
  beforeEach(function() {
    googleServices = require('../index').init(apiKey);
  });

  it('gets the coordinates for the Sydney Opera House', function(done) {
    googleServices.geocode({
      address: 'Sydney Opera House'
    }, function(responseJSON) {
      expect(responseJSON.results).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              place_id: 'ChIJidzEjmauEmsRwb535u6rCA4'
            })
          ]));
      done();
    }).on('error', function(e) {
      expect(e.message).toBeFalsy();
      done();
    });
  });
});
