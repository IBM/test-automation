/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Handlebars helper which will generate an HTML element's attributes
 *    from an object of attributes
 * @module handlebars-helper-attrs
 */

/**
 * Determines if a variable is a number
 * @param {number} value - item that will be tested for whether or not
 *    it is a number
 * @returns {boolean} true is a number, false is not
 */
const isNumber = value => value instanceof Number || typeof value === 'number';

/**
 * Handlebars helper which will allow undefined attributes
 *
 * @param  {object} input content injected into helper
 * @returns {string} the attributes as html-attributes
 */
module.exports = (input = {}) => {
  let attributes = ' ';

  if (typeof input !== 'object' || Array.isArray(input)) {
    let itype = typeof input;
    if (Array.isArray(input)) {
      itype = 'array';
    }

    console.error(`attributes must be a non-array object, attrs helper received ${itype} instead`); // eslint-disable-line

    return '';
  }

  Object.keys(input).forEach(key => {
    attributes +=
      !isNumber(input[key]) && (!input[key] || input[key] === null)
        ? `${key} `
        : `${key}="${input[key].toString()}" `;
  });

  return attributes;
};
