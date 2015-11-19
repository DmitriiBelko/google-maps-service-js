var InvalidValueError = require('../invalid-value-error');
var utils = require('../utils');
var v = require('../validate');

var path = '/maps/api/distancematrix/json';

var validateDistanceMatrixQuery = v.object({
  arrival_time: v.optional(utils.timeStamp),
  avoid: v.optional(utils.pipedArrayOf(v.oneOf([
    'tolls', 'highways', 'ferries', 'indoor'
  ]))),
  departure_time: v.optional(utils.timeStamp),
  destinations: utils.pipedArrayOf(utils.latLng),
  mode: v.optional(v.oneOf(['driving', 'walking', 'bicycling', 'transit'])),
  retryOptions: v.optional(utils.retryOptions),
  transit_mode: v.optional(utils.pipedArrayOf(v.oneOf[
    'bus', 'subway', 'train', 'tram', 'rail'
  ])),
  origins: utils.pipedArrayOf(utils.latLng)
});

exports.inject = function(makeApiCall) {
  return {

    distanceMatrix: function(query, callback) {

      query = validateDistanceMatrixQuery(query);

      if (query.departure_time && query.arrival_time) {
        throw new InvalidValueError(
            'should not specify both departure_time and arrival_time');
      }

      return makeApiCall(path, query, callback);
    }

  };
};
