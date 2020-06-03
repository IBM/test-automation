/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Convert wildcard versioned modules in a package.json's dependencies into the latest corresponding release numbers
 *     structured to be a  {@link https://semantic-release.gitbook.io/semantic-release/usage/plugins|semantic-release plugin}
 */
const { existsSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

const getReleases = require('./get-npm-releases');

/**
 * Get the parsed contents of a package.json file.
 *
 * @param {string} path The path to the package.json file.
 * @returns {object} The file's contents.
 *
 * @private
 */
const getPkgContents = path => {
  // Check it exists.
  if (!existsSync(path)) throw new Error(`package.json file not found: '${path}'`);

  let contents;

  // Read the file.
  try {
    contents = readFileSync(path, 'utf8');
  } catch (e) {
    throw new Error(`package.json cannot be read: '${path}'`);
  }

  // Parse the file.
  let pkgContents;
  try {
    pkgContents = JSON.parse(contents);
  } catch (e) {
    throw new Error(`package.json could not be parsed: '${path}'`);
  }

  // Must be an object.
  if (typeof pkgContents !== 'object') throw new Error(`package.json was not an object: '${path}'`);

  // Return contents.
  return pkgContents;
}

/**
 * Additional wildcard  semantic-release branches configuration
 * @typedef {semrelBranches} wildcardBranches
 * @property {string} [upstream] - defines the direct-upstream distribution channel that is used as a fallback if an exact version is not found
 */

/**
 * Additional wildcard  semantic-release options configuration
 * @typedef {semrelOptions} wildcardOptions
 * @property {wildcardBranches[]} branches - release branches configuration including distribution channel property
 */

/**
 * Contains data about the next release on this distribution channel
 * @typedef {object} nextRelease
 * @property {string} type - level of next release (patch, minor, major)
 * @property {string} channel - release channel
 * @property {string} gitHead - git commit
 * @property {string} version - semantic version number
 * @property {string} gitTag - git tag
 * @property {string} name - release full name
 * @property {string} notes - markdown-based release notes
 */

/**
 * Relevant semantic-release context object  properties.
 *      This large object is not documented by semantic-release
 * @typedef {object} semrelContext
 * @property {object} env - current environment data
 * @property {object} envCi - CI environment data
 * @property {wildcardOptions} options - full plugin config obj
 * @property {object[]} branches - undocumented object that has combined options config and existing branch and release data
 * @property {object} branch - current branch info,
 *    duplicate of one in `semrelContext.branches`
 * @property {lastRelease} lastRelease - see typedef
 * @property {nextRelease} nextRelease - see typedef
 */

/**
 * Updates this module's package.json file, converting wildcard-versioned dependencies to be a
 *     specific version number
 *
 * @param {wildcardSemrelOptions} pluginConfig - the config given to semantic-release
 * @param {semrelContext} context - see typedef
 *
 * @todo - the upstream channel could also be determined from the pluginConfig.branches array
 *    should create a fallback for the new upstream channel config property
 */
const prepare = (pluginConfig, context) => {
  if (!context.nextRelease) return;
  if (!Array.isArray(pluginConfig.wildcards)) return;

  // release channel for the release being prepared
  const releaseChannel = context.nextRelease.channel;

  // upstream channel used if a wildcard dependency does not have a tag in this `releaseChannel`
  let upstreamChannel = 'latest';
  if ((context.nextRelease.channel === context.branch.channel) && context.branch.upstream) upstreamChannel = context.branch.upstream;

  // packages will contain version numbers after `getReleases` queries versions from the npm registry
  const packages = getReleases(pluginConfig.wildcards) || [];

  // this package's package.json config
  const pkgPath = path.join(context.cwd, 'package.json');
  // Get and parse config file contents.
  const pkgContents = getPkgContents(pkgPath);

  // only expects npm-specific dependency objects
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(type => {
    const dependencies = pkgContents[type];

    if (dependencies) {
      Object.keys(dependencies).forEach(depName => {
        // only change wildcard versions
        if (dependencies[depName] === '*') {
          // search for the dependency in `packages`
          const foundDep = packages.find(package => {
            return package.name === depName;
          }) || { tags: {} };

          // usually expect `latest` to exist
          if (foundDep.tags['latest']) dependencies[depName] = foundDep.tags['latest'];
          // upstream may not exist for some channels
          if (foundDep.tags[upstreamChannel]) dependencies[depName] = foundDep.tags[upstreamChannel];
          // if the dep has a tag on same channel as this package's nextRelease
          if (foundDep.tags[releaseChannel]) dependencies[depName] = foundDep.tags[releaseChannel];
        }
      })

      pkgContents[type] = dependencies;
    }
  })

  // Write package.json back out.
  writeFileSync(pkgPath, JSON.stringify(pkgContents));
};

module.exports = {
  prepare,
};
