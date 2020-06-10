/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview {@link https://github.com/IBM/exported-tests|Exported Test} that can
 *    be imported for W3C standards HTML validation
 * @module w3c-validation/exported-test
 */

const expect = require('chai').expect;
const merge = require('lodash/merge');

const { getElement, rootNotFound } = require('../test-helpers/utilities');
const validate = require('./validate');

/**
 * Message strings which are used by Exported Tests
 *    to create suite, test, and assertion messaging
 * @typedef {object} w3cTestMessages
 * @property {string} suite - test suite name
 * @property {string} test - test name
 * @property {string} assertion - test assertion message
 * @typicalname Exported Test message strings
 * @private
 */

/**
 * Grabs HTML document fragment for HTML validation testing
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {string} selector - CSS selector to find HTML snippet
 * @returns {DocumentFragment} element gathered from the document fragment
 * @memberof w3c.exportedTest
 * @private
 */
const getFragment = (docFrag, selector) =>
  getElement(selector, docFrag) || rootNotFound(selector, docFrag);

/**
 * Configuration for the HTML validation Exported Test
 * @typedef {object} config
 * @property {boolean} [makeTestSuite=true] - whether the test should be part of
 *    a test suite.
 * @property {string} [selector='main'] - CSS selector of the document fragment to be tested
 * @property {w3cTestMessages} [w3cTestMessages] - message strings for W3C test and suite
 * @memberof w3c.exportedTest
 * @typicalname Exported Test configuration
 */

/**
 * Default configuration for the HTML validation Exported Test
 * @type {w3c.exportedTest.config}
 * @memberof w3c.exportedTest
 * @typicalname Default configuration
 */
const defaults = {
  makeTestSuite: true,
  selector: 'main',
  w3cTestMessages: {
    suite: 'HTML follows W3C standards',
    test: 'HTML is valid',
    assertion: 'HTML conforms to W3C HTML validation',
  },
};

/**
 * Creates a W3C validation Exported Test that can be used to validate
 *    HTML against the W3C standards
 * @param {w3c.exportedTest.config} configs
 * @returns {feature-test-object[]} test array
 * @memberof w3c.exportedTest
 * @typicalname Exported Test
 */
const w3cTests = (configs = {}) => {
  const settings = merge({}, defaults, configs);

  const tests = [
    {
      it: settings.w3cTestMessages.test,
      getResults: (context = document) =>
        new Promise(resolve => {
          resolve({
            html: getFragment(context, settings.selector).outerHTML,
          });
        }),
      comparison: results => {
        return validate(results.html)
          .then(resp => {
            // eslint-disable-next-line no-unused-expressions
            expect(resp, settings.w3cTestMessages.assertion).to.be.true;
          })
          .catch(err => {
            // eslint-disable-next-line no-unused-expressions
            expect(err, settings.w3cTestMessages.assertion).to.not.exist;
          });
      },
    },
  ];

  if (settings.makeTestSuite === false) {
    return tests;
  }

  return [
    {
      describe: settings.w3cTestMessages.suite,
      tests,
    },
  ];
};

module.exports = w3cTests;
