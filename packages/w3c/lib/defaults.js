/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Defaults for W3C validator
 * @module w3c-validation/defaults
 */

/**
 * W3C validator configuration property definitions
 * @typedef {object} w3cConfig
 * @property {string} [url=http://127.0.0.1:8888] - URL for the W3C validator
 * @property {boolean} [wrapHTML=true] - flag to have the validator wrap a passed in HTML fragment to make it a valid HTML document for testing.
 *      HTML to-be-tested
 * @property {string} [response=''] - flag to determine type of response;
 *    options:
 *      * `encoded` converts all violation messages into a string,
 *      * `full` returns the entire W3C response object,
 *      * (`undefined` || `''`) _default_ just the violation messages are returned as an array
 * @typicalname Object breakdown: W3C validator config
 */

/**
 * Validator defaults; includes the URL for the Docker version of the
 *  W3C validator
 * @type {w3c-validation.w3cConfig}
 * @typicalname Default config for validate function
 */
const defaults = {
  url: 'http://127.0.0.1:8888',
  wrapHTML: true,
  response: '',
};

module.exports = defaults;
