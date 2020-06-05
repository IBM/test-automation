/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Defaults for monorepo-releaser
 * @module monorepo-releaes
 */

/**
 * Semantic Release branch config object
 * {@link https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#branches-properties|sementic-release branches object}
 * @typedef {object} semrelBranches
 * @property {string} name - branch name
 * @property {string} [channel] -
 *    {@link https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#channel|distribution channel}
 *    property used to modify the NPM distribution tag name
 * @property {string} [range] - regex-string used for number-based releases
 * @property {string} [prerelease] - used in pre-release version naming
 * @property {boolean} [main] - undocumented config variable which tells semantic-release/github that a branch is `main` so releases
 *    on that branch are not labeled `prerelease`
 */

/**
 * Semantic Release options object. See
 * {@link https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches|semantic-release options object}
 * note: this typedef does not contain all available options from semantic-release, just relevant properties.
 * See semantic-relase docs for more config options.
 * @typedef {object} semrelOptions
 * @property {object} repositoryUrl - from package.json
 * @property {object} githubUrl - root URL for Github - different on enterprise GitHub
 * @property {object} githubApiPathPrefix - API path for Github - different on enterprise GitHub
 * @property {object} [releaseNotes] - strings and data used when writing release notes
 * @property {semrelBranches[]} [branches] - release branches/channels config
 *  {@link https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches|config.branches}
 * @property {object} [plugins] - semantic-release plugins to use.
 *  {@link https://semantic-release.gitbook.io/semantic-release/usage/configuration#plugins|config.plugins}
 *  default: [
 *      '@semantic-release/commit-analyzer',
 *      '@semantic-release/release-notes-generator',
 *      '@semantic-release/npm',
 *      '@semantic-release/github'
 *    ],
 */

/**
 * This object contains all configurations which are unique to the test-automation repository
 * @type {object}
 * @property {semrelBranches} branches - test-automation branches configuration, different from semantic-release
 *    default branches config by exchanging `master` with `develop`
 * @property {string[]} packages - repo packages that should be released on merge, in order of dependency use. This
 *    array is to configure the order in which the packages should be released to npm. This array should include
 *    all packages which are released on merge. These are ordered to ensure a dependency is released
 *    before any module which will need to replace the wildcard with the latest version number.
 *    The wildcards are replaced via semantic-release-wildcards
 */
const testAutomation = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'develop',
    'next',
    'next-major',
    {
       'name': 'beta',
       'prerelease': true
    },
    {
       'name': 'alpha',
       'prerelease': true
    }
  ],
  packages: [
    // used to create the order the modules in this repo shouold be released
    'monorepo-releaser',
    'semantic-release-wildcards',
  ],
}

/**
 * Monorepo configuration which uses semantic-release-wildcards to update
 *    package versions
 *
 * @type {semrelOptions}
 */
const configMonorepo = {
  branches: testAutomation.branches,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['semantic-release-wildcards',
      {
        wildcards: testAutomation.packages
      }
    ],
    '@semantic-release/npm',
    '@semantic-release/github'
  ],
};

/**
 * Common configuration for using semantic-release on IBM's GitHub Enterprise (GHE)
 *  the `plugins` and `branches` properties will be semantic-release defaults
 *  when using this configuration
 *
 * @type {semrelOptions}
 */
const configGHE = {
  githubUrl: 'https://github.ibm.com',
  githubApiPathPrefix: 'api/v3',
  releaseNotes: {
    issueResolution: {
      template: '{baseUrl}/{owner}/{repo}/issues/{ref}',
      baseUrl: 'https://github.ibm.com',
      source: 'github.ibm.com',
    },
  },
};

/**
 * Monorepo configuration for using semantic-release on IBM's GitHub Enterprise (GHE)
 *
 * @type {semrelOptions}
 * @todo  [wildcards should be a more generic](CANONICALISSUES/5938)
 */
const configMonorepoGHE = Object.assign({}, configGHE, configMonorepo);

/**
 * Output of monorepo-releaser
 * @type {object}
 * @property {object} testAutomation - test-automation monorepo configuration
 * @property {semrelOptions} configMonorepo - Monorepo configuration for semantic-release
 * @property {semrelOptions} configGHE - Generic semantic-release configuration for using
 *    semantic-release on IBM's GitHub Enterprise (GHE)
 * @property {semrelOptions} configMonorepoGHE - Monorepo configuration for semantic-release
 *    for using semantic-release on IBM's GitHub Enterprise (GHE)
 */
const defaults = {
  testAutomation,
  configMonorepo,
  configGHE,
  configMonorepoGHE
}

module.exports = defaults;
