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

/**
 * Functionality exported by the W3C HTML validation tool
 * @todo auto-docs to fill in README
 * @todo add `exported-test`
 */
const w3c = {
  addHTMLDonut: validate.addHTMLDonut,
  composer,
  ...errors,
  validate,
};
delete w3c.validate.addHTMLDonut;

module.exports = w3c;
