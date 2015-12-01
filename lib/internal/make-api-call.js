var url = require('url');

exports.inject = function(options) {

  var key = options.key || process.env.GOOGLE_MAPS_API_KEY;
  var clientId = options.clientId || process.env.GOOGLE_MAPS_API_CLIENT_ID;
  var clientSecret = options.clientSecret || process.env.GOOGLE_MAPS_API_CLIENT_SECRET;

  var rate = options.rate || {};
  var rateLimit = rate.limit || 10;  // 10 requests per ratePeriod.
  var ratePeriod = rate.period || 1000;  // 1 second.

  var makeUrlRequest = options.makeUrlRequest || require('./make-url-request');
  var mySetTimeout = options.setTimeout || setTimeout;
  var getTime = options.getTime || function() {return new Date().getTime();};
  var attempt = require('./attempt').inject(mySetTimeout, getTime).attempt;
  var ThrottledQueue = require('./throttled-queue').inject(mySetTimeout, getTime);
  var requestQueue = ThrottledQueue.create(rateLimit, ratePeriod);

  /**
   * Makes an API request using the injected makeUrlRequest.
   *
   * Inserts the API key (or client ID and signature) into the query
   * parameters. Retries requests when the status code requires it.
   * Parses the response body as JSON.
   *
   * The callback is given either an error or a response. The response
   * is an object with the following entries:
   * {
   *   status: number,
   *   body: string,
   *   json: Object
   * }
   *
   * @param {string} path
   * @param {Object} query This function mutates the query object.
   * @param {Function} callback
   * @return {{
   *   cancel: function(),
   *   asPromise: function(): Promise  // TODO
   * }}
   */
  return function(path, query, callback) {

    var useClientId = query.supportsClientId && clientId && clientSecret;
    var retryOptions = query.retryOptions || options.retryOptions || {};

    delete query.retryOptions;
    delete query.supportsClientId;

    if (useClientId) {
      query.client = clientId;
    } else if (key && key.indexOf('AIza') == 0) {
      query.key = key;
    } else {
      throw 'Missing either a valid API key, or a client ID and secret';
    }

    var requestUrl = url.format({
      pathname: path,
      query: query
    });

    // When using client ID, generate and append the signature param.
    if (useClientId) {
      var secret = new Buffer(clientSecret, 'base64');
      var payload = url.parse(requestUrl).path;
      var signature = new Buffer(require('crypto').createHmac('sha1', secret)
          .update(payload).digest('base64')).toString()
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      while (signature.length % 4) {
        signature += '=';
      }
      requestUrl += '&signature=' + encodeURIComponent(signature);
    }

    var handle = attempt({
      'do': function(callback) {
        return requestQueue.add(function() {
          makeUrlRequest(requestUrl, callback);
        }, function(err, result) {
          if (err != null) {
            callback(err, null);
          }
          // Ignore the result of makeUrlRequest().
        });
      },
      until: function(response) {
        return response
        && response.status !== 500
        && response.status !== 503
        && response.status !== 504;
      },
      interval: retryOptions.interval,
      increment: retryOptions.increment,
      jitter: retryOptions.jitter,
      timeout: retryOptions.timeout
    }, function(err, response) {
      callback && callback(err, response);
      if (err) {
        pReject && pReject(err);
      } else {
        pResolve && pResolve(response);
      }
    });

    var pResolve, pReject;
    if (options.Promise) {
      var promise = new options.Promise(function(resolve, reject) {
        pResolve = resolve;
        pReject = reject;
      });
      handle.asPromise = function() {
        return promise;
      };
    }

    return handle;
  };
};