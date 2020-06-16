/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Helpers for processing JSDoc typedef content
 * @member plugin
 * @memberof typedef
 */
const expander = require('./expander').expandTypedefs;

exports.handlers = {
  parseComplete: e => {
    expander(e.doclets);

    return e
  }
}
