/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview JSDocs configuration file
 */
module.exports = {
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure']
  },
  source: {
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: 'tests'
  },
  plugins: [
    './lib/typedef-plugin/plugin.js'
  ],
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
    default: {
      outputSourceFiles: true
    }
  }
}
