/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 /**
 * @fileoverview Commit message configuration used for testing
 */

/**
 * Testing commit message configuration
 * @typedef {commitConfigs} config
 * @property {typeConfig} feat - standard configuration with nothing fancy
 * @property {typeConfig} perf - configuration with additional scopes defined
 * @property {typeConfig} refactor - configuration that is not used in GH notes and does not generate a release
 * @property {typeConfig} none - configuration with the special `none` keyword
 */
const config = {
  feat: {
    release: 'minor',
    title: 'Features',
  },
  perf: {
    release: 'patch',
    title: 'Performance Improvements',
    scopes: [
      {
        scope: 'dep-*',
        release: 'minor',
      }
    ]
  },
  refactor: {
    release: false,
    title: 'Code Refactoring',
    removeFromLogs: true,
  },
  none: {
    scopes: [
      {
        scope: 'break-*',
        release: 'major',
        cleanupLogs: 'Breaking Changes: ',
      },
      {
        scope: 'minor-*',
        release: 'minor',
        cleanupLogs: '',
      },
    ]
  },
};

module.exports = config;
