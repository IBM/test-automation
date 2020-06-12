/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview W3C HTML validation tools, helpers, and exported tests.
 * @module w3c-validation
 */

const composer = require('./docker/composer');
const validate = require('./validate');
const errors = require('./error-encoder');
const addHTMLDonut = require('./add-html-donut');

/**
 * Functionality exported by the W3C HTML validation tool
 * @todo auto-docs to fill in README
 * @todo add `exported-test`
 * @todo CLI function to call validation via command line
 */
const w3c = {
  addHTMLDonut,
  composer,
  ...errors,
  validate,
};

module.exports = w3c;
