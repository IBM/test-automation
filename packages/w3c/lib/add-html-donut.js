/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview HTML donut
 * @module w3c-validation/donut
 * @typicalname HTML donut
 */

/**
 * Creates a full HTML document by wrapping a DOMstring in a W3C-compliant HTML donut.
 * @param  {DOMstring} html - HTML element to be injected into doc
 * @return {DOMstring} HTML element wrapped in a valid HTML document
 * @typicalname Add HTML donut
 */
const addHTMLDonut = html => {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Test</title></head><body>${html}</body></html>`;
};

module.exports = addHTMLDonut;
