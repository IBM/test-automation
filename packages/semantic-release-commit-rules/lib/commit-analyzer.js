/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Functionality for the `@semantic-release/commit-analyzer` plugin
 */

/**
 * Converts a commit message configuration object in to a Semantic Release
 * releaseRules array
 * @param {commitConfigs} config - see typedef in `defaults.js`
 * @returns {object[]} releaseRules array;
 *    see https://github.com/semantic-release/commit-analyzer#releaserules
 */
const getReleaseRules = config => {
  const rules = [];

  Object.keys(config).forEach(typeName => {
    const value = config[typeName];

    if (typeName !== 'none' && typeof value.release !== 'undefined') {
      rules.push({ type: typeName, release: value.release})
      if (value.scopes) {
        value.scopes.forEach((scopeConfig) => {
          rules.push({ type: typeName, scope: scopeConfig.scope, release: scopeConfig.release})
        })
      }
    } else if (Array.isArray(value.scopes)) {
      value.scopes.forEach((scopeConfig) => {
        rules.push({scope: scopeConfig.scope, release: scopeConfig.release})
      })
    }
  });

  return rules;
};

module.exports = getReleaseRules;
