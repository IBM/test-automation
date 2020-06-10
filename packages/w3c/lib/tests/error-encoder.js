/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('chai').expect;

const encoder = require('../error-encoder');
const fixtures = require('./fixtures');

describe('W3C error encoding', () => {
  describe('All items exist', () => {
    it('must have functionality', () => {
      expect(encoder.errorStrings).to.exist;
      expect(encoder.errorStrings).to.be.an('object');
      expect(encoder.encode).to.exist;
      expect(encoder.encode).to.be.a('function');
      expect(encoder.decode).to.exist;
      expect(encoder.decode).to.be.a('function');
    });
  });

  describe('W3C messages are encoded', () => {
    it('W3C encodes messages', () => {
      const encoded = encoder.encode(fixtures.fourErrors.expected.messages);

      expect(encoded).to.be.a('string');
      expect(encoded).to.equal(fixtures.fourErrors.expected.encoded);
      expect(encoded).to.include(encoder.errorStrings.logStart);
      expect(encoded).to.include(encoder.errorStrings.logEnd);
      expect(encoded).to.include(encoder.errorStrings.error);
    });
  });

  describe('W3C messages can be decoded', () => {
    it('W3C decodes encoded messages', () => {
      const decoded = encoder.decode(fixtures.fourErrors.expected.encoded);

      expect(decoded).to.be.an('array');
      expect(decoded).to.deep.equal(fixtures.fourErrors.expected.messages);
    });

    it('W3C decodes encoded messages', () => {
      const decoded = encoder.decode('w3cErrorLogStartw3cError{}');

      expect(decoded).to.be.an('array');
      expect(decoded).to.deep.equal([]);
    });
  });
});
