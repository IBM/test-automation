#!/usr/bin/env node
/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Command line interface (CLI) for this module
 * @module docs/cli
 */
const fs = require('fs');
const meow = require('meow');
const jsdoc2md = require('jsdoc-to-markdown');

/**
 * Creates a markdown file containing documentation rendered from a set of files' JSDoc content.
 *    Other than `data.dest` all other configurations are documented in the
 *    [jsdoc2md API docs](https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md#jsdoc2mdrenderoptions--promise)
 * @param {object} [data]
 * @param {string} [data.dest] - full path to destination file for rendered doc
 */
const createDocFile = data => {
  const opts = data;
  opts['no-cache'] = true;
  opts.files = opts.files || [
    './lib/*.js',
    './lib/**/*.js'
  ];

  opts.dest = opts.dest || './api.md';
  opts.configure = opts.configure || './jsdoc-conf.js';
  const rendered = jsdoc2md.renderSync(opts)

  fs.writeFileSync(opts.dest, rendered);
  return;
}


/**
 * Object contains set of non-flag arguments (key) that correspond to
 *    a function (value)
 */
const commands = {
  'createDocFile': createDocFile,
}

/**
 * Uses the [meow](https://github.com/sindresorhus/meow) module to create a CLI
 * @param {string[]} input - first entry will be the action to perform
 * @param {object} flags - [meow flags docs](https://github.com/sindresorhus/meow#flags)
 */
const actions = (input, flags) => {
  let data = {};
  if (flags && flags.data) {
    try {
      data = JSON.parse(flags.data);
    } catch (error) {
      console.warn(`Auto docs cli error: ${error}\n data: ${flags.data}`); // eslint-disable-line no-console
    }
  }

  if (input[0]) {
    // if there are non-flag arguments, the first one should be in the `commands` object
    if (!commands[input[0]])
      throw new Error(`${input[0]} is not a command in the Auto docs CLI`);

    return commands[input[0]](data);
  }
}

/**
 * Sets up the command line interface (CLI) for the module
 * See [meow docs](https://github.com/sindresorhus/meow) for usage info
 */
const cli = meow(`
Usage
  $ auto-docs <action>

Examples
  $ auto-jsdocs createDocFile
  // uses jsdoc-to-markdown, combined with the typedef-expander plugin, to create
  //    markdown docs from JSDocs comments
`, {
  flags: {
    data: {
      type: 'string',
      alias: 'd',
      default: '{}'
    }
  }
});

/**
 * calling actions here, combined with the `bin` property in package.json, sets up the CLI for
 * use when module is installed
 */
actions(cli.input, cli.flags);
