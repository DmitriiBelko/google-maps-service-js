/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Task = require('./task');

exports.inject = function(setTimeout, getTime) {
  return {

    // Takes a 'do' function that returns a task, and returns a new task that
    // repeatedly calls the 'do' function, until its result passes the 'until'
    // predicate.
    attempt: function(options) {
      var doSomething = options['do'];
      var isSuccessful = options.until;
      var timeout = options.timeout || 60 * 1000;
      var interval = options.interval || 500;
      var increment = options.increment || 1.5;
      var jitter = options.jitter || 0.5;

      var startTime = getTime();

      function tryItAndSee(err) {
        if (err) return Task.withValue(err);

        return doSomething()
        .thenDo(function(err, result) {
          if (err != null) {
            return Task.withValue(err, null);
          }
          if (isSuccessful(result)) {
            return Task.withValue(null, result);
          }

          var waitTime = interval * (1 + jitter * (2 * Math.random() - 1));
          interval *= increment;
          if (getTime() + waitTime >= startTime + timeout) {
            return Task.withValue(new Error('timeout'), null);
          }

          return Task.do(function(callback) {
            setTimeout(callback, waitTime);
          })
          .thenDo(tryItAndSee);
        });
      }

      return Task.withValue(null).thenDo(tryItAndSee);
    }

  };
};
