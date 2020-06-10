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

/**
 * Creates a plugin configuration object for @semantic-release/commit-analyzer using the default
 * Angular preset with a custom project-based configuration object
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @returns {object} commit-analyzer configuration object with the `preset` and `releaseRules` properties
 *    see https://github.com/semantic-release/commit-analyzer#configuration for more configuration details
 */
const generateCommitAnalyzerConfig = (config) => {
  return {
    preset: 'angular',
    releaseRules: [
      {breaking: true, release: 'major'},
      {revert: true, release: 'patch'},
    ].concat(getReleaseRules(config))
  }
};

/**
 * Creates a plugin configuration object for'@semantic-release/release-notes-generator' using the default
 * Angular preset with a custom project-based configuration object
 * @param {commitConfigs} config - see typedef in ./defaults.js
 * @param {string} [host=https://github.com] - host URL option
 * @returns {object} release-notes-generator configuration object with the `preset`, `host`, and `writerOpts.transform` properties
 *    see https://github.com/semantic-release/release-notes-generator#configuration for more configuration details
 */
const generateReleaseNotesConfig = (config, host = 'https://github.com') => {
  return {
    preset: 'angular',
    host,
    writerOpts: {
      /**
       * Required due to upstream bug preventing all types being displayed.
       * Bug: https://github.com/conventional-changelog/conventional-changelog/issues/317
       */
      transform: (commit, context) => {
        /** Custom changes to allow a configuration object */
        let discard = !notes.isBreakingChange(commit, config);
        const issues = []

        commit.notes.forEach(note => {
          note.title = `BREAKING CHANGES`;
          discard = false;
        })

        commit.type = notes.getCommitType(commit.type, config, discard);
        if (commit.type === false) {
          return;
        }

        commit.scope = notes.cleanupScopes(commit.scope, config);

        /**
         * Copy and paste from Conventional Changelog Angular to align with default templates
         * @see  https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/writer-opts.js#L60-L101
         */
        if (commit.scope === `*`) {
          commit.scope = ''
        }

        if (typeof commit.hash === 'string') {
          commit.shortHash = commit.hash.substring(0, 7)
        }

        if (typeof commit.subject === 'string') {
          let url = context.repository
            ? `${context.host}/${context.owner}/${context.repository}`
            : context.repoUrl
          if (url) {
            url = `${url}/issues/`
            // Issue URLs.
            commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
              issues.push(issue)
              return `[#${issue}](${url}${issue})`
            })
          }
          if (context.host) {
            // User URLs.
            commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
            })
          }
        }

        // remove references that already appear in the subject
        commit.references = commit.references.filter(reference => {
          if (issues.indexOf(reference.issue) === -1) {
            return true
          }

          return false
        })

        return commit
        /** End copy and paste */
      },
    }
  }
}

module.exports = {
  defaultConfig,
  generateCommitAnalyzerConfig,
  generateReleaseNotesConfig
};
