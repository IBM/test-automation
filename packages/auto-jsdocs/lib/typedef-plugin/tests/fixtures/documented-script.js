/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Script which is documented with JSDoc and being used as a fixture
 * @module documented-file
 * @typicalname A documented file
 */

/**
 * Typedef nine
 * @typedef {typedefEight} typedefNine
 */

/**
 * Script that has `typedefOne` as a parameter
 * @param {typedefOne} typedefOne - type def one is received
 * @returns {typedefTwo} type def two is given back
 */
const functionOne = typedefOne => typedefOne;

/**
 * Script that has `typedefSeven` as a parameter
 * @param {typedefSeven} typedefSeven - type def seven is received
 * @returns {typedefFour} type def four is given back
 */
const functionSeven = typedefSeven => typedefSeven;

module.exports = {
  functionOne,
  functionSeven,
}
