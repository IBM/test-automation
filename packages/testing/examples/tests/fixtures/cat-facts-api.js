/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Fixtures and mock calls for the
 *    {@link https://alexwohlbruck.github.io/cat-facts/|Cat facts API}
 * @module testing/examples/tests/fixtures/api-call
 */
const nock = require('nock');

/**
 * Example cat facts which match the `Cat facts API` object structure
 */
const catFacts = [
  {
    _id: '123456abcdef',
    text: 'Jack the meow is a meow who is very meow',
    type: 'cat',
    user: {
      _id: '098765zyxwvu',
      name: { first: 'Jane', last: 'Doe' }
    },
    upvotes: 1
  },
  {
    _id: '098765zyxwvu',
    text: 'Charlote the meow meows like "eck eck eck...purrr"',
    type: 'cat',
    user: {
      _id: '098765zyxwvu',
      name: { first: 'Another', last: 'Human' }
    },
    upvotes: 10
  }
]

/**
 * Add `nock` paths for getting all facts
 */
const getFacts = () => {
  nock('https://cat-fact.herokuapp.com')
    .get('/facts')
    .reply(200, { all: catFacts });
};

module.exports.catFacts = catFacts;
module.exports.getFacts = getFacts;
