/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Example functions which show how to write assertions which
 *    test functions that call an api
 * @module testing/examples/api-call
 */
const https = require('https');

/**
 * Cat facts API response
 *  see: {@link https://alexwohlbruck.github.io/cat-facts/|Cat facts API}
 *
 * @typedef {object} catFact
 * @property {object} user - person who added fact
 * @property {string} text - contents of fact
 * @property {string} type - subject of fact
 * @property {string} _id - unique key for fact
 * @property {number} upvotes - votes for the fact
 */

/**
 * Returns an array of cat facts
 * @returns {catFact[]}
 */
const getCatFacts = () => {
  return new Promise((resolve, reject) => {
    https.get('https://cat-fact.herokuapp.com/facts', (response) => {
      let body = ''
      response.on('data', (chunk) => body += chunk)
      response.on('end', () => resolve(JSON.parse(body).all))
    }).on('error', reject)
  })
}

/**
 * Get on random cat fact
 * @returns {catFact}
 */
const randomCatFact = async () => {
  const catFactsFromService = await getCatFacts();
  const fact = catFactsFromService[Math.floor(Math.random()*catFactsFromService.length)];

  return fact;
}

module.exports.getCatFacts = getCatFacts;
module.exports.randomCatFact = randomCatFact;
