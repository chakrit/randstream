
// index.js - Main randstream exports
exports = module.exports = (function() {

  var inherits = require('util').inherits
    , Readable = require('readable-stream')
    , generators = require('./generators');

  // core firehose
  function RandStream(options) {
    var defaultSize = 4096
      , generator = generators.random;

    // valdiate options
    options = options || { };
    if (typeof options.defaultSize !== 'undefined') defaultSize = options.defaultSize;
    if (typeof options.mode !== 'undefined') generator = generators[options.mode];

    if (typeof defaultSize !== 'number')
      throw new Error('defaultSize option must be a number.');
    if (typeof generator !== 'function')
      throw new Error('invalid mode specified.');

    // _read implementation based on specified mode
    this._generator = generator;
    this._read = function(size) {
      var me = this;
      size = size || defaultSize;

      return this._generator(size, function(e, buffer) {
        if (me.push(buffer)) process.nextTick(function() {
          return me._read(size); // nextTick prevent call stack explode for fast tty
        });
      });
    };

    Readable.call(this, options);
  };

  inherits(RandStream, Readable);
  return RandStream;

})();

