/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Functionality related to docker-composer
 * @module w3c-validation/composer
 */
const compose = require('docker-compose');
const fetch = require('node-fetch');

const defaults = require('../defaults');

/**
 * Checks if the URL is available and returns the contents
 *    of the body if it is
 * @param {string} url - URL to verify
 * @returns {string|boolean} either `false` or the contents found at the URL
 * @private
 */
const verifyUrl = async (url) => {
  if (!url) return false;
  let response;

  try {
    response = await fetch(url);
  } catch (e) {
    return false;
  }

  const body = await response.text();

  if (body) return body;

  return false;
}

/**
 * Extra checking to ensure the W3C container is running.
 * @returns {<string>Promise} the contents found at the URL
 * @private
 */
const containerStartupBuffer = () => {
  return new Promise(res => {
    const url = defaults.url;

    /**
     * Checks if the URL is available and resolves this
     *    promise if `node-fetch` returns content
     */
    const verifyUrlResolver = async () => {
      const response = await fetch(defaults.url);
      const body = await response.text();

      // if it gets body, resolves the promise
      if (body) res(body);

      return;
    }

    for (let i = 0; i <= 10; i++) {
      setTimeout(verifyUrlResolver, 4000);
    }
  })
}

/**
 * Async Docker composer for building, (re)creating, attaching and starting
 *    containers for W3C Nu Checker, configured via docker-compose.yml file
 *
 * @returns {<boolean>Promise} true means W3C url is fetch-able, false it's not.
 *    Note: sometimes the container takes time to turn on, so a false response may not be
 *    accurate.
 */
const composer = async () => {
  const running = await verifyUrl(defaults.url);
  if (running) return Promise.resolve(true);

  return compose.upAll({ cwd: __dirname, log: true })
    .then(() => {
      return containerStartupBuffer(defaults.url)
    })
    .then(resp => {
      if (resp.includes('Ready to check  - Nu Html Checker')) return true;

      return false;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error('Docker Composer error');
      // eslint-disable-next-line no-console
      console.error(err);
    })
  };

module.exports = composer;
