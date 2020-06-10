/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Example test suite which requires mocking an external API call
 * @module testing/examples/tests/api-call
 */
const expect = require('chai').expect;
const nock = require('nock');

const { getCatFacts, randomCatFact } = require('../api-call');
const fixtures = require('./fixtures/cat-facts-api');

/**
 * These are re-usable assertions which test the contents
 *    of a cat fact. Contents should match the `catFact`
 *    typedef's structure
 *
 * @param {catFact} fact
 */
const catFactAssertions = fact => {
  expect(fact.user).to.be.an('object')
  expect(fact.text).to.be.a('string')
  expect(fact.type).to.be.a('string')
  expect(fact._id).to.be.a('string')
  expect(fact.upvotes).to.be.a('number')
}

describe('API calls example', () => {
  describe('All functions exist', () => {
    it('must have functions', () => {
      expect(getCatFacts).to.exist;
      expect(getCatFacts).to.be.a('function');
      expect(randomCatFact).to.exist;
      expect(randomCatFact).to.be.a('function');
    });
  });
  describe('Should return cat facts', () => {
    /**
     * `getFacts` mocks any calls to the cat-api, replacing responses from the api
     *     with the mocked fixture responses
     */
    beforeEach(() => {
      fixtures.getFacts();
    });

    it('Returns all cat facts', async () => {
      const facts = await getCatFacts();

      expect(facts).to.be.an('array')
      expect(facts).to.have.a.lengthOf(Object.keys(fixtures.catFacts).length);

      // this will run each cat fact through the fact assertions
      facts.forEach(fact => catFactAssertions(fact));
    })
    it('Returns a random cat fact', async () => {
      const fact = await randomCatFact();
      expect(fact).to.be.an('object')

      // this will the randomw cat fact through the fact assertions
      catFactAssertions(fact);
    })
  });
});
