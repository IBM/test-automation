/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Example test suite of a basic test functionaility
 * @module testing/examples/tests.basic
 */
const capcon = require('capture-console');
const expect = require('chai').expect;

const { add } = require('../basic');

describe('Basic example', () => {
  describe('All functions exist', () => {
    it('must have functions', () => {
      expect(add).to.exist;
      expect(add).to.be.a('function');
    });
  });
  describe('Should accept only a number as input', () => {
    it('Parameter must be a number', () => {
      let response;
      const stderr = capcon.captureStderr(() => {
        response = add('this is a string');
      });

      expect(response).to.be.undefined
      expect(stderr.trim(), 'will be the contents of `console.error`')
        .to.equal('Error response: not a number');
    });
    it('Parameter can be blank', () => {
      it('Parameter defaults to zero', () => {
        expect(add(), 'should be zero + 1').to.equal(1)
      })
    })
  });
  describe('Should increment an input number', () => {
    it('One plus one is two', () => {
      expect(add(1), 'should be 1 + 1').to.equal(2)
    })
    it('Decimals get carried over', () => {
      expect(add(10.8), 'should be 10.8 + 1').to.equal(11.8)
    })
  });
});
