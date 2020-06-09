/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Commit message configuration definition and default configuration
 */

/**
 * Commit message scope configuration
 * @typedef {object} scopeConfig
 * @property {string} scope - commit scope to test against. Can use `*` as a wildcard
 *    (e.g. MYSCOPE-* will find commits that have a scope that starts with MYSCOPE-)
 * @property {string} release - release type to be generated when using commit type;
 *    Available options: 'minor', 'patch', 'major'
 * @property {string} cleanupLogs - string that replaces the value of `scope` when generating
 *    GitHub release notes (e.g. For scope definition `MYSCOPE-*`, using '' will remove `MYSCOPE-`
 *    from displaying)
 */

/**
 * Commit message type configuration
 * @typedef {object} typeConfig
 * @property {string} release - release type to be generated when using commit type;
 *    Available options: 'minor', 'patch', 'major', 'false'
 * @property {string} title - Title used in GitHub's release notes when grouping commits with a similar type
 * @property {boolean} [removeFromLogs=false] - turns off GitHub release note generate for commits with the defined type
 * @property {scopeConfig[]} scopes - additional configurations for specific scopes when used with the specified type
 */

/**
 * Commit message configurations for a package that are used to determine
 * Semantic Release version type and GitHub release notes
 * @typedef {object} commitConfigs
 * @property {typeConfig} * - property name is the commit-message type and the value is a typeConfig
 *      commitConfigs can have any number of properties as long as each follows this format; Using
 *      the keyword `none` as the property name with a `scopes` array allows the user to define type
 *      agnostic scope rules
 */

/**
 * Default commit message configurations
 * @typedef {commitConfigs} defaultCommitConfig
 * @property {typeConfig} feat - configurations for commits that have type `feat`
 * @property {typeConfig} build - configurations for commits that have type `build`
 * @property {typeConfig} perf - configurations for commits that have type `perf`
 * @property {typeConfig} fix - configurations for commits that have type `fix`
 * @property {typeConfig} test - configurations for commits that have type `test`
 * @property {typeConfig} ci - configurations for commits that have type `ci`
 * @property {typeConfig} docs - configurations for commits that have type `docs`
 * @property {typeConfig} style - configurations for commits that have type `style`
 * @property {typeConfig} refactor - configurations for commits that have type `refactor`
 * @property {typeConfig} none - scope configurations for commits of any type
 */
const defaultConfig = {
  feat: {
    release: 'minor',
    title: 'Features',
  },
  build: {
    release: 'patch',
    title: 'Build System',
    scopes: [
      {
        // Updating dependencies unless a breaking change will be a minor update
        scope: 'dep-*',
        release: 'minor',
      }
    ]
  },
  perf: {
    release: 'patch',
    title: 'Performance Improvements',
    scopes: [
      {
        // Removing files/dependencies unless a breaking change will be a minor update
        scope: 'dep-*',
        release: 'minor',
      }
    ]
  },
  fix: {
    release: 'patch',
    title: 'Bug Fixes',
  },
  test: {
    release: 'patch',
    title: 'Tests',
  },
  ci: {
    release: 'patch',
    title: 'Continuous Integration',
  },
  docs: {
    release: false,
    title: 'Documentation',
    removeFromLogs: true,
  },
  style: {
    release: false,
    title: 'Linting',
    removeFromLogs: true,
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
      {
        scope: 'patch-*',
        release: 'patch',
        cleanupLogs: '',
      },
      {
        scope: 'no-release',
        release: false,
        cleanupLogs: '',
      }
    ]
  },
};

module.exports = defaultConfig;
