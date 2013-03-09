
# RANDSTREAM

A stream that sprays out [random bytes][0] at whoever's listening to its `data`.

The implementation is surprisingly trivial thanks to [isaacs/readable-stream][1] so I
didn't have any tests but you should just take a look at the code.

This code is in public domain.

[0]: http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
[1]: https://github.com/isaacs/readable-stream

