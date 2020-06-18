/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Helpers for processing JSDoc typedef content
 * @module typedef
 */
const plugin = require('./plugin');
const expander = require('./expander');


module.exports = {
  plugin,
  expander,
}
