
// index.js - Main randstream exports
exports = module.exports = (function() {

  var randomBytes = require('crypto').randomBytes
    , inherits = require('util').inherits
    , Readable = require('readable-stream');

  var OPTS =
    { mode: 'random'
    , defaultSize: 4096
    };

  // generator modes
  var generators =
    { '0':
      function(size, cb) {
        var buf = new Buffer(size);
        buf.fill(0);
        cb.call(this, null, buf);
      }

    , '01':
      function(size, cb) {
        var buf = new Buffer(size), i;

        for (i = 0; i < size; i++)
          buf[i] = [0, 1][i % 2];

        cb.call(this, null, buf);
      }

    , random:
      function(size, cb) {
        var me = this;
        randomBytes(size, function(e, buf) { cb.call(me, e, buf); });
      }

    , alpha:
      function(size, cb) {
        var me = this;
        generators.random(size, function(e, buf) {
          var i;
          for (i = 0; i < size; i++)
            buf[i] = 97 + buf[i] % 26; // 97 is ascii 'a'

          cb.call(me, e, buf);
        });
      }
    };

  // core firehose
  function RandStream(options) {
    var mode, defaultSize, generator;

    Readable.call(this, options);
    if (options) {
      mode = options.mode || OPTS.mode;
      defaultSize = options.defaultSize || OPTS.defaultSize;
    }

    this._generator = generators[mode];
    this._read = function(size) {
      var me = this;
      size = size || defaultSize;

      this._generator(size, function(e, buffer) {
        if (me.push(buffer)) process.nextTick(function() {
          return me._read(size);
        });
      });
    };
  };

  inherits(RandStream, Readable);
  return RandStream;

})();


if (require && require.main === module) (function(RandStream) {

  var mode = process.argv[2] || 'random'
    , firehose = new RandStream({ mode: mode });

  firehose.pipe(process.stdout);

  process.once('SIGINT', function() {
    firehose.pause()
    firehose.unpipe(process.stdout);
  });

})(module.exports);

