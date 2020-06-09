/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview This feature allows developers using Angular's commit
 *  message convention and semantic release the ability have a single
 *  configuration object that generates semantic release plugin configurations
 */
const defaultConfig = require('defaults');
const getReleaseRules = require('./commit-analyzer');
const notes = require('./generate-notes');

module.exports = {
  defaultConfig,
  getReleaseRules,
  ...notes
};
