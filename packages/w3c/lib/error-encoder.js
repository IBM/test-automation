/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview W3C HTML validation error encoding is used to convert W3C Validator errors from
 *  arrays of message objects into parse-able JSON-stringified objects and
 *  decode them back into their original array
 * @module w3c-validation/errors
 * @typicalname W3C error encoding
 */

/**
 * Strings which can be used to denote and find content
 * @type {object}
 * @property {string} logStart - denotes start of an entire set of messages
 * @property {string} logEnd - denotes end of an entire set of messages
 * @property {string} error - denotes start of an error message
 * @typicalname Enoding strings
 */
const errorStrings = {
  logStart: 'w3cErrorLogStart',
  logEnd: 'w3cErrorLogEnd',
  error: 'w3cError',
};

/**
 * Encodes W3C error messages for easier parsing when pulled from Karma results JSON output.
 *    All message objects in an array are converted into one single string
 *    String is encoded to be decode-able back into an object by `decode`
 * @param {w3c-validation/validate.error[]} messages - W3C error messages output
 * @returns {string} all errors, in a string, encoded with parse-able strings
 * @typicalname W3C error encoding
 */
const encode = (messages = []) => {
  let errorMsg = errorStrings.logStart;
  messages.forEach(msg => {
    const newMsg = {};
    Object.keys(msg).forEach(key => {
      // `message` and `extract` have content that needs to be replaced/escaped
      if (['message', 'extract'].indexOf(key) === -1) {
        newMsg[key] = msg[key];
        return;
      }

      // replace internal quotes
      const item = msg[key].replace(/"/g, '&quot;');
      newMsg[key] = item;
    });

    errorMsg += `${errorStrings.error}${JSON.stringify(newMsg)}`;
  });

  errorMsg += errorStrings.logEnd;

  return errorMsg;
};

/**
 * Decodes W3C error messages as encoded by `encode`
 * @param {string} w3cErrs - encoded set of error messages
 * @returns {w3c-validation/validate.error[]} set of W3C Validator error messages
 * @typicalname W3C error decoding
 */
const decode = w3cErrs => {
  const w3cFails = [];
  const w3cErrorLogRegex = new RegExp(
    `${errorStrings.logStart}(.*)${errorStrings.logEnd}`,
    'm'
  );
  const matches = w3cErrs.match(w3cErrorLogRegex);
  if (!matches) return w3cFails;

  const w3cErrorRegex = new RegExp(`${errorStrings.error}`, 'gm');
  const w3cErrlog = w3cErrs.match(w3cErrorLogRegex)[1];
  const w3cErrors = w3cErrlog.split(w3cErrorRegex);
  w3cErrors.forEach(err => {
    if (err === '') return;
    let errObj;
    try {
      errObj = JSON.parse(err);
    } catch (error) {
      // DEBUG: need to log out any JSON.parse errors
      console.log(error); // eslint-disable-line no-console
    }
    // if the message doesn't parse back into an object, skip it
    if (typeof errObj !== 'object' || Array.isArray(errObj) === true || !errObj.message) return;

    // revert the quotes
    const quoteRegex = new RegExp('&quot;', 'gm');
    errObj.message = errObj.message.replace(quoteRegex, '"');
    errObj.extract = errObj.extract.replace(quoteRegex, '"');

    w3cFails.push(errObj);
  });

  return w3cFails;
};

module.exports.errorStrings = errorStrings;
module.exports.encode = encode;
module.exports.decode = decode;
