/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('chai').expect;
const nock = require('nock');

const w3c = require('../');
const fixtures = require('./fixtures');

const mockW3CValidator = () => {
  nock('https://fake.validator')
    .post(/\//)
    .reply(200, {
      messages: fixtures.zeroErrors.expected.messages,
      context: fixtures.zeroErrors.fixture,
    });
  nock('https://fake.validator.fail')
    .post(/\//)
    .reply(200, {
      messages: fixtures.fourErrors.expected.messages,
      context: fixtures.fourErrors.fixture,
    });
};

/**
 * Assertions for the fixture with four errors
 * @param {w3c-validation/validate.error[]} err - non-wrapped response from validator
 */
const fourErrorsAssertions = err => {
  expect(err).to.be.an('array');
  expect(err).to.have.a.lengthOf(4);
  err.forEach((msg, index) => {
    expect(msg.message).to.equal(
      fixtures.fourErrors.expected.messages[index].message
    );
  });
};

describe('W3C HTML testing', () => {
  describe('All functions exist', () => {
    it('must have functions', () => {
      expect(w3c.validate).to.exist;
      expect(w3c.validate).to.be.a('function');
      expect(w3c.addHTMLDonut).to.exist;
      expect(w3c.addHTMLDonut).to.be.a('function');
      expect(w3c.composer).to.exist;
      expect(w3c.composer).to.be.a('function');
    });
  });

  describe('W3C HTML testing allows configuration', () => {
    beforeEach(() => {
      mockW3CValidator();
    });
    it('Allows different validator URL', () => {
      return w3c
        .validate(fixtures.zeroErrors.fixture, {
          url: 'https://fake.validator',
        })
        .then(res => {
          expect(res).to.be.true;
        });
    });
    it('Can return unencoded error message', () => {
      return w3c
        .validate(fixtures.fourErrors.fixture, {
          response: false,
        })
        .then(res => fourErrorsAssertions(res));
    });
    it('Allows full W3C response', () => {
      return w3c
        .validate(fixtures.fourErrors.fixture, {
          response: 'full',
        })
        .then(res => {
          expect(res.source).to.exist;
          expect(res.source).to.be.an('object');
          expect(res.source.type).to.exist;
          expect(res.source.encoding).to.exist;
          expect(res.source.code).to.exist;
          expect(res.source.code).to.equal(
            w3c.addHTMLDonut(fixtures.fourErrors.fixture)
          );
          fourErrorsAssertions(res.messages);
        });
    });
    it('Allows skipping the HTML wrapper', () => {
      return w3c
        .validate(fixtures.htmlFile.fixture, {
          wrapHTML: false,
          response: 'encoded',
        })
        .then(res => {
          expect(res).to.be.a('string');
          fixtures.htmlFile.expected.messages.forEach(msg => {
            expect(res).to.include(msg.message);
          });
        });
    });
  });

  describe('Test HTML for conformance to W3C, return encoded errors', () => {
    it('Correctly determines HTML non-conformance', () => {
      return w3c.validate(fixtures.fourErrors.fixture, {
        response: 'encoded',
      }).then(res => {
        expect(res).to.be.a('string');
        fixtures.fourErrors.expected.messages.forEach(msg => {
          expect(res).to.include(msg.message);
        });
      });
    });
    it('Correctly determines HTML conformance', () => {
      return w3c.validate(fixtures.zeroErrors.fixture).then(res => {
        expect(res).to.be.true;
      });
    });
  });
});
