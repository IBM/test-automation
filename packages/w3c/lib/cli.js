#!/usr/bin/env node
/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Command line interface (CLI) for this module
 * @module w3c-validation/cli
 */
const meow = require('meow');

const composer = require('./docker/composer');

/**
 * CLI that triggers Docker Compose to create a run the W3C Nu Checker,
 *    making it available locally at http://127.0.0.1:8888
 */
const docker = () => {
  return composer()
}

/**
 * Object contains set of non-flag arguments (key) that correspond to
 *    a function (value)
 */
const commands = {
  'docker-setup': docker,
}

/**
 * Uses the [meow](https://github.com/sindresorhus/meow) module to create a CLI
 * @param {string[]} input - first entry will be the action to perform
 * @param {object} flags - [meow flags docs](https://github.com/sindresorhus/meow#flags)
 */
const actions = (input, flags = { data: {} }) => {
  let data = {};

  try {
    data = JSON.parse(flags.data);
  } catch (error) {
    console.warn(`W3C validator cli error: ${error}\n data: ${flags.data}`); // eslint-disable-line no-console
  }

  if (input[0]) {
    // if there are non-flag arguments, the first one should be in the `commands` object
    if (!commands[input[0]])
      throw new Error(`${input[0]} is not a command in the w3c-validator CLI`);

    return commands[input[0]](data);
  }
}

/**
 * Sets up the command line interface (CLI) for the module
 * See [meow docs](https://github.com/sindresorhus/meow) for usage info
 */
const cli = meow(`
Usage
  $ w3c-validation <action>

Examples
  $ w3c-validation docker-setup
  // uses Docker Compose to create and launch the W3C Nu Checker in a docker container,
  //    making it available at http://127.0.0.1:8888
`);

/**
 * calling actions here, combined with the `bin` property in package.json, sets up the CLI for
 * use when module is installed
 */
actions(cli.input);
