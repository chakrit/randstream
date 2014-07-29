
// generators.js - Define available generators
exports = module.exports = (function() {

  var randomBytes = require('crypto').randomBytes
    , pseudoRandom = require('crypto').pseudoRandomBytes
    , pregenBuf = null
    , $ = null;

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return $ = (

    { '0':
      function(size, cb) {
        var buf = new Buffer(size);
        buf.fill(0);
        return cb.call(this, null, buf);
      }

    , '01':
      function(size, cb) {
        for (var buf = new Buffer(size), i = 0; i < size; i++)
          buf[i] = [0, 1][i % 2];

        return cb.call(this, null, buf);
      }

    , random:
      function(size, cb) {
        var me = this;
        return randomBytes(size, function(e, buf) {
          return cb.call(me, e, buf);
        });
      }

    , pseudo:
      function(size, cb) {
        var me = this;
        return pseudoRandom(size, function(e, buf) {
          return cb.call(me, e, buf);
        });
      }

    , alpha:
      function(size, cb) {
        var me = this;
        return $.random(size, function(e, buf) {
          for (var i = 0; i < size; i++)
            buf[i] = 0x61 + buf[i] % 26; // 0x61 'a'

          return cb.call(me, e, buf);
        });
      }

    , num:
      function(size, cb) {
        var me = this;
        return $.random(size, function(e, buf) {
          for (var i = 0; i < size; i++)
            buf[i] = 0x30 + buf[i] % 10; // 0x30 '0'

          return cb.call(me, e, buf);
        });
      }

    , pregenerated:
      function(size, cb) {
        var me = this;
        if (!pregenbuf || pregenbuf.size < size*2) {
          return $.random(size*10, function(e, buf) {
            pregenbuf = buf;
            var retbuf = Buffer(size);
            pregenbuf.copy(buf, 0, 0, size);
            return cb.call(me, e, buf);
          });

        } else {
          var buf = Buffer(size);
          var startOffset = getRandomInt(0, pregenbuf.length - (size+1));
          pregenbuf.copy(buf, 0, startOffset, startOffset + size);
          return cb.call(this, null, buf);
        }
      }

    }

  ); // return

})();

