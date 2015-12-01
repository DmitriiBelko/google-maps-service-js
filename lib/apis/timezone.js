var utils = require('../internal/utils');
var v = require('../internal/validate');

exports.timezone = {
	url: 'https://maps.googleapis.com/maps/api/timezone/json',
	validator: v.object({
	  location: utils.latLng,
	  retryOptions: v.optional(utils.retryOptions),
	  timestamp: utils.timeStamp
	})
}
