
// index.js - Main randstream exports
exports = module.exports = (function() {

  var randomBytes = require('crypto').randomBytes
    , inherits = require('util').inherits
    , Readable = require('readable-stream');

  inherits(RandStream, Readable);

  function RandStream() { Readable.call(this); };
  RandStream.prototype._read = randomBytes;

  return RandStream;

})();


if (require && require.main === module) (function(RandStream) {

  var firehose = new RandStream();
  firehose.on('data', function(chunk) {
    return process.stdout.write(chunk.toString('ascii'));
  });

  process.on('SIGINT', function() {
    firehose.pause();
    firehose.removeAllListeners('data');
  });

})(module.exports);

