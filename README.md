
# RANDSTREAM

A stream that sprays out [random bytes][0] at whoever's listening to its `data`.

The implementation is surprisingly trivial thanks to [isaacs/readable-stream][1] so I
didn't have any tests but you should just take a look at the code.

# API

The exported `RandStream` class accepts a single option hash which is passed along as an
[option to the inherited `Readable` class][2] with an exception of a few extra parameters:

```js
var RandStream = require('randstream');

var firehose = new RandStream(
  { mode: 'alpha'
  , defaultSize: 4096
  });

firehose.pipe(process.stdout);
```

The `mode` option maybe one of the following value:

* `0` - A zero-filled streams. Essentially no longer random.
* `01` - A zero-one stream. Useful to use as test streams that is a bit less boring :p
* `random` - Default mode, using [`crypto.randomBytes`][0] to generate data. The buffer is
  then pushed any reading clients untouched.
* `pseudo` - Uses [`crypto.pseudoRandomBytes`][3] instead.
* `alpha` - A stream of lowercase alphabets. Useful if you want to see the bytes being
  piped. The original sequence is generated using [`crypto.randomBytes`][0].
* `num` - Like `alpha` but generate a stream of digits.

The `defaultSize` is the default size of the buffer to allocate when the underlying
`_read` implementation is not given a size.

# CLI

This module can also be used from the command line if you install globally with `-g`

```sh
$ npm install -g randstream
$ rand | hexdump -v
```

# LICENSE

public domain.

[0]: http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
[1]: https://github.com/isaacs/readable-stream
[2]: https://github.com/isaacs/readable-stream#new-streamreadableoptions
[3]: http://nodejs.org/api/crypto.html#crypto_crypto_pseudorandombytes_size_callback

