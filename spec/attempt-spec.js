describe('attempt', () => {
  var closeTo = (average, jitter) => ({
    asymmetricMatch: (actual) => (
        average * (1 - jitter) <= actual &&
        average * (1 + jitter) >= actual
    )
  });

  var timeoutDurations, theTime;
  var attempt;
  beforeEach(() => {
    theTime = 123456;
    timeoutDurations = [];
    var fakeSetTimeout = (callback, duration) => {
      timeoutDurations.push(duration);
      setImmediate(() => {
        theTime += duration;
        callback();
      });
    };
    attempt = require('../lib/attempt')
        .inject(fakeSetTimeout, () => theTime)
        .attempt;
  });

  var doSomething, equalTo200;
  beforeEach(() => {
    doSomething = jasmine.createSpy('doSomething');
    equalTo200 = jasmine.createSpy('equalTo200')
        .and.callFake((result) => (result === 200));
  });

  it('calls doSomething asynchronously', () => {
    attempt({'do': doSomething, until: equalTo200}, () => {});
    expect(doSomething).not.toHaveBeenCalled();
  });

  it('asynchronously calls the callback with an error', (done) => {
    doSomething.and.callFake((callback) => {
      callback(new Error('uh-oh!'));
    });

    var called = false;

    attempt({'do': doSomething, until: equalTo200}, (err, result) => {
      called = true;
      expect(err).toMatch('uh-oh!');
      expect(result).toBe(null);
      expect(equalTo200).not.toHaveBeenCalled();
      done();
    });

    expect(called).toBe(false);
  });

  describe('(when the first attempt succeeds)', () => {

    beforeEach(() => {
      doSomething.and.callFake((callback) => {
        callback(null, 200);
      });
    });

    it('asynchronously calls the callback with the successful result', (done) => {
      var called = false;

      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        called = true;
        expect(err).toBe(null);
        expect(result).toBe(200);
        done();
      });

      expect(called).toBe(false);
    });


    it('gives the result to the success tester', (done) => {
      attempt({'do': doSomething, until: equalTo200}, () => {
        expect(equalTo200).toHaveBeenCalledWith(200);
        done();
      });
    });
  });

  describe('(when the second attempt succeeds)', () => {
    beforeEach(() => {
      var attemptCount = 0
      doSomething.and.callFake((callback) => {
        var result = (attemptCount++ === 0) ? 500 : 200;
        callback(null, result);
      });
    });

    it('calls doSomething twice', (done) => {
      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        expect(doSomething.calls.count()).toBe(2);
        done();
      });
    });

    it('calls equalTo200 with both results', (done) => {
      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        expect(equalTo200.calls.allArgs()).toEqual([[500], [200]]);
        done();
      });
    });

    it('calls the callback with the successful result', (done) => {
      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        expect(err).toBe(null);
        expect(result).toBe(200);
        done();
      });
    });

    it('waits approximately 500 ms', (done) => {
      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        var closeTo500 = {
          asymmetricMatch: (actual) => (250 <= actual && actual <= 750)
        };
        expect(timeoutDurations).toEqual([closeTo(500, 0.5)]);
        done();
      });
    });
  });

  describe('(when multiple attempts fail)', () => {
    beforeEach(() => {
      doSomething.and.callFake((callback) => { callback(null, 500); });
    });

    it('does exponential backoff', (done) => {
      var TIMEOUT = 5000;
      var INTERVAL = 700;
      var INCREMENT = 1.2;
      var JITTER = 0.2;

      var startTime = theTime;

      attempt({
        'do': doSomething,
        until: equalTo200,
        timeout: TIMEOUT,
        interval: INTERVAL,
        increment: INCREMENT,
        jitter: JITTER
      }, (err, result) => {
        expect(result).toBe(null);
        expect(err).toMatch('timeout');

        var waitTime = INTERVAL;
        timeoutDurations.forEach(function(duration, i) {
          expect(duration).toEqual(closeTo(waitTime, JITTER));
          waitTime *= INCREMENT;
        });
        expect(theTime).toBeLessThan(startTime + TIMEOUT);
        expect(theTime + (1 + JITTER) * waitTime)
            .toBeGreaterThan(startTime + TIMEOUT);

        done();
      });
    });

    it('can be cancelled', (done) => {
      attempt({'do': doSomething, until: equalTo200}, (err, result) => {
        expect(result).toBe(null);
        expect(err).toMatch('cancelled');
        done();
      }).cancel();
    });
  });
});
