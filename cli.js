#!/usr/bin/env node

// cli.js - Expose randstream as a CLI command for generating random bytes.
if (!(require && require.main === module)) {
  console.error('Must be run from the command line.');
  return process.exit(1);
}

(function() {

  var mode = process.argv[2] || 'random'
    , bps = parseInt(process.argv[3], 10) || 64;

  var RandStream = require('./index')
    , Throttle = require('throttle')
    , firehose = new RandStream({ mode: mode })
    , throttle = new Throttle({ bps: bps }); // slow down to allow SIGINT to comes through

  var stop = function() {
    firehose.unpipe(throttle);
    throttle.unpipe(process.stdout);
    process.exit(1);
  };

  firehose.once('error', stop);
  throttle.once('error', stop);
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  firehose.pipe(throttle).pipe(process.stdout);

})();

