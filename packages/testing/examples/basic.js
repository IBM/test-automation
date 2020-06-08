/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Example functions which show how to write assertions which
 *    which test a simple function's inputs and outputs
 * @module testing/examples/basic
 */

/**
 * Adds a 1 to the number
 * @param {number} [num=0]
 * @returns {number} the input number incremented by 1
 */
const add = (num=0) => {
  if (typeof num !== 'number') {
    console.error('Error response: not a number');
    return;
  }

  return num + 1;
}


module.exports.add = add;
