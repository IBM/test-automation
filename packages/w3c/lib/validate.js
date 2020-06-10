/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview HTML validation testing helper
 * @module w3c-validation/validate
 * @typicalname W3C HTML validator
 */
const fetch = require('node-fetch');
const FormData = require('form-data');

const encode = require('./error-encoder').encode;
const validateDefaults = require('./defaults').validate;

/**
 * W3C validator error message object breakdown
 * @typedef {object} error
 * @property {string} type - response message type
 * @property {number} firstLine - line that is the start of the source range of the invalid section
 *      If the attribute is missing, it is assumed to have the same value as `lastLine`.
 * @property {number} firstColumn - column that is the start of the source range of the invalid section
 * @property {number} lastLine - line that is the end of the source range of the invalid section
 * @property {number} lastColumn - column that is the end of the source range of the invalid section
 * @property {number} hiliteStart - unknown purpose
 * @property {number} hiliteLength - unknown purpose
 * @property {string} message - error message from W3C validator
 * @property {string} extract - relevant HTML snippet that contains invalid HTML
 * @typicalname Typedef: W3C validator error message
 */

/**
 * W3C validator details about tested content
 * @typedef {object} source
 * @property {string} type - type of content receieved
 * @property {string} encoding - content encoding
 * @property {DOMstring} code - content sent to validator
 * @typicalname Typedef: W3C validator content source
 */

/**
 * W3C validator full response
 * @typedef {object} response
 * @property {string} context - HTML snippet sent to W3C validator
 * @property {w3c-validation.error[]} messages - each message represents
 *    a separate error, this is an empty array if there are no errors
 * @property {w3c-validation.source} source - details on tested content
 * @typicalname Typedef: W3C validator response
 */

/**
 * Creates a full HTML document by wrapping a DOMstring in a W3C-compliant HTML donut.
 * @param  {DOMstring} html - HTML element to be injected into doc
 * @return {DOMstring} HTML element wrapped in a valid HTML document
 * @typicalname Add HTML donut
 */
const addHTMLDonut = html => {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Test</title></head><body>${html}</body></html>`;
};

/**
 * W3C validator for a given HTML snippet. Optionally wraps the snippet in W3C-valid HTML
 *   before testing. Validate is mimicking a user submitting HTML to W3C using the form
 *   included when viewing the validator URL in a browser.
 *
 * @param {DOMstring} html - HTML snippet that's being validated
 * @param {w3c-validation.w3cConfig} [config={}] - validate function configuration
 * @returns {Promise<string|w3c-validation.error[]|w3c-validation.response|boolean>}
 *    returns one of:
 *    encoded validation error messages _or_
 *    an array of error messages _or_
 *    the full W3C response _or_
 *    `true` if no errors are detected
 * @typicalname W3C HTML tester
 * @example
 * // Validating HTML using a Promise
 * const w3cValidation = require('@watson-health/tools/w3c').validate;
 *
 * return w3cValidation('<button><h1 id="meow">failing <h2 id="meow2">html</h2></h1></button>')
 *   .then(response => { // `response` will be a string encoded via `w3c.encode`.
 *     // `message` will be an array of error message objects defined by `w3c-validation.error`
 *     const messages = w3c.decode(response);
 *   })
 *
 * @example
 * // Get full error response from W3C
 * const w3c = require('@watson-health/tools/w3c');
 *
 * return w3cValidation('<button><h1>failing</h1> HTML</button>', { response: 'full' })
 *   .then(response => {
 *      // `response` the entire response object from W3C.
 *      return response;
 *   })
 */
const validate = (html, config = {}) => {
  const opts = Object.assign({}, validateDefaults, config);
  const form = new FormData();
  // always get `json` response from W3C
  form.append('out', 'json');
  // W3C expects `content` to be contained in a full HTML wrapper for testing
  if (opts.wrapHTML === true) {
    form.append('content', addHTMLDonut(html));
  } else {
    form.append('content', html);
  }

  return fetch(opts.url, { method: 'POST', body: form })
    .then(res => res.json())
    .then(response => {
      if (response.messages.length) {
        // return `messages` encoded into a string
        if (opts.response === 'encoded') return encode(response.messages);
        // return full W3C response object
        if (opts.response === 'full') return response;

        // return `messages` array
        return response.messages;
      }

      // if there were no messages, there were no violations
      return true;
    });
};

module.exports = validate;
module.exports.addHTMLDonut = addHTMLDonut;
