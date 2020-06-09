/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const getReleaseRules = require('./commit-analyzer');

/**
 * @fileoverview Functionality for the `@semantic-release/release-notes-generator` plugin
 */

/**
 * Returns the Changelog title for a specific commit type
 * @param {string} type - type of commit following the Angular convention (<type>(<scope>): <description>).
 *   This value is parsed from the commit via the release-notes-generator plugin
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @param {boolean} doDiscard - override the `removeFromLogs` property defined in `config` typically used
 *   when there is a breaking change for a commit type that typically not part of Changelog notes.
 * @returns {false | string} returns false if the commit should be discarded or
 *   the title used in the Changelog for the specific commit type
 */
const getCommitType = (type, config, doDiscard) =>
    doDiscard && config[type].removeFromLogs ? false : config[type].title;

/**
 * Determines if a commit should trigger a breaking change (major release)
 * @param {object} commit - parsed commit from the `release-notes-generator` plugin. This function uses the
 *    `scope` and `type` properties.
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @returns {boolean} based on if the commit contains a breaking change
 */
const isBreakingChange = (commit, config) => {
  const rules = getReleaseRules(config);
  let isBreaking = false;
  const commitScope = commit.scope || '';


  rules.forEach(rule => {
    if (rule.release === 'major') {
      const ruleScope = (rule.scope || '').replace('*', '');

      if (commit.type === rule.type || commitScope.startsWith(ruleScope)) {
        isBreaking = true;
      }
    }
  })

  return isBreaking;
};

/**
 * Returns an array of all scope rules found in a configuration object
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @returns {scopeConfig[]} all scope configs within `config`
 * @private
 */
const getAllScopes = (config) => {
  let scopes = [];

  Object.values(config).forEach(prop => {
    if (Array.isArray(prop.scopes)) {
      scopes = scopes.concat(prop.scopes);
    }
  });

  return scopes;
}

/**
 * Cleans up the scope string to produce cleaner Changelog notes. This allows projects to use keywords
 *    within a scope to trigger different release types without having to have those keywords displayed
 *    in the release notes
 * @param {string} scope - scope of commit following the Angular convention (<type>(<scope>): <description>).
 *   This value is parsed from the commit via the release-notes-generator plugin
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @returns {string} Scope wording to use within the Changelog note
 */
const cleanupScopes = (scope, config) => {
  const scopes = getAllScopes(config);
  let tempScope = scope;

  scopes.forEach(scopeConfig => {
    if (typeof scopeConfig.cleanupLogs === 'string') {
      const ruleScope = scopeConfig.scope.replace('*', '');
      if (tempScope.startsWith(ruleScope)) {
        tempScope = tempScope.replace(ruleScope, scopeConfig.cleanupLogs)
      }
    }
  })

  return tempScope;
}

module.exports = {
  getCommitType,
  isBreakingChange,
  cleanupScopes,
};
