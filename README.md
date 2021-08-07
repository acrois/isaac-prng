# About

*isaac-prng* is a TypeScript (JavaScript) implementation of the [ISAAC](http://www.burtleburtle.net/bob/rand/isaac.html) secure random number generator.

ISAAC is a [CSPRNG](http://en.wikipedia.org/wiki/CSPRNG) designed by [Robert J. Jenkins Jr.](http://burtleburtle.net/bob/) in 1996 and based on RC4. It is designed to be fast and secure.

*isaac-prng* is fully compatible with other implementations of ISAAC and can be used as a good alternative to the default javascript `Math.random()` function. It utilizes JavaScript's new [BigInt](https://v8.dev/features/bigint) data type to avoid having to work around the inherent limitations of JavaScript's [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) data type.

The implementation was adapted from Bob Jenkin's [Java port](https://burtleburtle.net/bob/java/rand/Rand.java) of his original C implementation. ISAAC, the algorithm/cipher/generator is a work released into the public domain. This software implementation, however, is released under the MIT license.

# Usage

## Install Package

### NPM

### GitHub Packages

## Import Package

### ES Module

### CommonJS

## Use ISAAC

### Seed Isaac

### Generate Signed Integer



# Development

## Testing

## Publishing