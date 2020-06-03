/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Get the latest releases of an NPM module
 */
const { execSync } = require('child_process');

/**
 * A distribution channel release of an NPM module
 * @typedef {object} channelRelease
 * @property {string} channel - semantic release distribution channel name
 * @property {string} release - release version
 */

/**
 * A set of NPM modules and their latest releases
 * @typedef {object} releases
 * @property {string} name - module name
 * @property {Object<channelRelease>} tags - object of releases for an NPM module
 */

/**
 * Uses NPM CLI to get the current distribution tags for a specified module
 * @param {string} package - NPM module name
 * @returns {Object<channelRelease>} - object of releases for an NPM module
 *
 * @todo {@link CANONICALISSUES/5636|determine release versions via `npm view`}
 * @todo {@link CANONICALISSUES/217|remove warn via Application Message Logging}
 */
const getDistTags = package => {
  let tags = '{}';

	try {
    const published = execSync(`npm view ${package} dist-tags --json`).toString();
	  tags = published;
	} catch (e) {
		console.warn(`getDistTags ERROR: ${e}`); // eslint-disable-line no-console
	}

  return JSON.parse(tags);
}

/**
 * Retrieves Git release tags for a set of modules
 * @param {string[]} packages=[] - Array of NPM module names
 * @param {string} [prefix=''] - optional string prepended to module names
 * @returns {releases} set of modules with current release NPM distribution tags
 */
const getReleases = (packages = [], prefix = '') => {
  return packages.map(pkg => {
    const name = `${prefix}${pkg}`;
    return {
      name,
      tags: getDistTags(name)
    };
  })
}

module.exports.getDistTags = getDistTags;
module.exports.getReleases = getReleases;
