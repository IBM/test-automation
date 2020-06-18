/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Combines JSDoc typedef content to expand typedefs,
 *  properties, and parameters in JSDoc content
 * @member expander
 * @memberof typedef
 */
const cloneDeep = require('lodash/cloneDeep');
const unionBy = require('lodash/unionBy');
const getJsdocDataSync = require('jsdoc-to-markdown').getJsdocDataSync;

/**
 * Contains data about the code connected to a JSDoc
 *
 * @typedef {object} jsdoc-code
 * @property {string} id - ?
 * @property {string} name - name of code piece
 * @property {string} type - the type of code it is
 * @private
 */

/**
 * JSDoc source file and comment meta data
 *
 * @typedef {object} jsdoc-meta
 * @property {string} filename - name of source file for JSDoc
 * @property {array} range - from/to characters in JSDoc
 * @property {number} lineno - starting line of comment
 * @property {number} columnno - starting column number of comment
 * @property {string} path - path to file's containing directory
 * @property {jsdoc-code} code - see typedef
 * @property {object} vars - ?? looks like an array of variables...
 * @private
 */

/**
 * Property/param/typedef type
 *
 * @typedef {object} jsdoc-type
 * @property {string[]} names - names of type(s)
 * @private
 */

/**
 * Property/param definition for a JSDoc
 *
 * @typedef {object} jsdoc-property
 * @property {jsdoc-type} type - type(s) of prop
 * @property {string} description - prop description
 * @property {string} name - name of prop
 * @private
 */

/**
 * JSDoc content parsed from in-code JSDoc comments.
 * This object represents each _possible_ property that could be
 *    returned by `JSDoc`.
 *
 * @typedef {object} jsdoc
 * @property {string} comment - entire text of the comment section
 * @property {string} longname - long version of the item name
 * @property {string} kind - type of item described by this JSDoc
 * @property {string} scope - describes scope in relation to file
 * @property {string} memberof - module membership
 * @property {jsdoc-meta} meta - see typedef
 * @property {jsdoc-property[]} [params] - set of parameters
 * @property {jsdoc-property[]} [properties] - set of properties
 * @property {jsdoc-property[]} returns - type of content returned
 * @property {string[]} examples - set of strings representing explanatory examples
 * @property {string[]} todo - set of strings representing todo items
 */

/**
 * Generic JSDoc named `type` options
 * @type {string[]}
 * @private
 */
const genericTypes = ['array', 'boolean', 'function', 'object', 'string'];

/**
 * Gets the entire source typedef JSDoc object
 * @param  {string[]} name - source typedef name(s)
 * @param {jsdoc[]} typedefs - set of JSDoc definitions
 * @return {jsdoc} source typedef JSDoc object
 * @private
 */
const getSourceTypedef = (name = [], typedefs) => {
  const sources = typedefs;
  // find referenced typedef
  const source = sources.find(def => {
    return name.indexOf(def.name) !== -1 || name.indexOf(def.longname) !== -1;
  });

  return source;
};

/**
 * Checks if an item is a jsdoc typedef object
 * @param  {jsdoc} item - a JSDoc definition
 * @return {boolean}
 * @private
 */
const isTypedef = item => {
  if (typeof item !== 'object' || Array.isArray(item) === true) return false;

  return (
    item.kind === 'typedef' &&
    (typeof item.type === 'object' && !Array.isArray(item.type)) &&
    Array.isArray(item.type.names)
  );
};

/**
 * Reduces an array of JSDocs to only typdefs
 * @param  {jsdoc[]} typedefs - set of JSDoc definitions
 * @return {jsdoc[]} set of JSDoc definitions that contains only typedefs
 * @private
 */
const typedefsOnly = (typedefs = []) => {
  if (typedefs && Array.isArray(typedefs)) {
    return typedefs.filter(typedef => {
      return isTypedef(typedef);
    });
  }

  return typedefs;
};

/**
 * Gets only JSDoc typedefs from a file, returning their JSDoc object
 * @param  {string} filepath - file containing typedef data
 * @return {jsdoc[]} set of JSDoc definitions that contains only typedefs
 * @private
 */
const typedefsFromFile = filepath => {
  return typedefsOnly(getJsdocDataSync({ files: filepath }));
};

/**
 * Creates an array of JSDoc objects which are typedefs that would be used
 *   as the sources for content when expanding one or more typedefs
 * @param  {jsdoc[]} typedefs - set of JSDoc definitions
 * @return {jsdoc[]} set of JSDoc definitions
 * @private
 */
const sourceTypedefs = (typedefs, opts = {}) => {
  let sources = [];
  if (typedefs) {
    if (!Array.isArray(typedefs)) {
      if (isTypedef(typedefs)) {
        sources = [cloneDeep(typedefs)];
      }
    } else {
      sources = cloneDeep(typedefsOnly(typedefs));
    }
  }

  if (opts.sourceTypedefs) {
    if (Array.isArray(opts.sourceTypedefs)) {
      opts.sourceTypedefs.forEach(src => {
        if (typeof src === 'string') {
          sources = unionBy(sources, typedefsFromFile(src), 'name');
        }
      });
    } else if (typeof opts.sourceTypedefs === 'string') {
      sources = unionBy(sources, typedefsFromFile(opts.sourceTypedefs), 'name');
    }
  }

  return sources;
};

/**
 * Iterates through the names from a `type` definition to find referenced typedefs
 *   and creates an array of non-expanded properties
 * @param  {jsdoc-type} type - see typedef
 * @param {jsdoc[]} typedefs - set of JSDoc definitions
 * @return {jsdoc-property[]} set of properties from typedef source(s)
 * @todo parse a property that is an array of a typedef - `jsdoc[]`
 * @private
 */
const typeSources = (type, typedefs) => {
  let sourceProperties = [];
  const sources = cloneDeep(typedefs);
  type.names.forEach(name => {
    if (genericTypes.indexOf(name) !== -1) return;
    const sourceTypedef = getSourceTypedef([name], sources);

    if (sourceTypedef) {
      // ensure source typedef properties is an array
      sourceTypedef.properties = sourceTypedef.properties || [];
      // recursion gets source typedef's properties
      sourceTypedef.properties = unionBy(
        sourceTypedef.properties,
        typeSources(sourceTypedef.type, sources),
        'name'
      );
      // property duplicates are removed, making later properties overwrite earlier ones
      sourceProperties = unionBy(
        sourceTypedef.properties,
        sourceProperties,
        'name'
      );
    }
  });

  return sourceProperties;
};

/**
 * Takes a JSDoc property or param and if they're sourced from a typedef,
 *  returns a set of items sourced from the typedef
 *
 * @param  {jsdoc-property} property - JSDoc property or param object
 * @param {jsdoc[]} typedefs - set of JSDoc definitions
 * @return {jsdoc-property[]} one or more property/param objects
 * @private
 */
const expandProperty = (property, typedefs) => {
  if (!typedefs) return [property];
  let sourceProperties = typeSources(property.type, cloneDeep(typedefs));
  if (sourceProperties.length === 0) return [property];

  // recursively expand each property
  sourceProperties.forEach(prop => {
    sourceProperties = unionBy(
      sourceProperties,
      expandProperty(prop, cloneDeep(typedefs)),
      'name'
    );
  });

  const original = property;
  original.type = { names: ['object'] };

  // convert the name of each source item to be a key in the original's object
  sourceProperties = sourceProperties.map(source => {
    source.name = `${original.name}.${source.name}`;
    if (original.optional === true) source.optional = true;
    return source;
  });

  return [original].concat(sourceProperties);
};

/**
 * Expand a single typedef's properties from source typedefs
 * @param {jsdoc} jsdoc - typedef to be expanded
 * @param {jsdoc[]} typedefs - set of JSDoc definitions which will be
 *    integrated into `jsdoc`, but will not have separate entries in the final docs
 * @return {jsdoc} expanded typedef
 * @private
 */
const expandTypedef = (jsdoc, typedefs, options) => {
  if (typeof jsdoc !== 'object' || Array.isArray(jsdoc) === true) return jsdoc;
  if (jsdoc.kind !== 'typedef') return jsdoc;
  const sources = sourceTypedefs(typedefs, options);
  const doc = cloneDeep(jsdoc);
  doc.properties = doc.properties || [];
  let sourceProperties = typeSources(doc.type, sources);
  if (sourceProperties.length > 0) {
    doc.type = { names: ['object'] };
    // expand each source property
    const newSrcProps = [];
    sourceProperties.forEach(prop => {
      const propsArray = expandProperty(prop, sources);
      propsArray.forEach(eprop => {
        newSrcProps.push(cloneDeep(eprop));
      });
    });
    sourceProperties = newSrcProps;
    // removes duplicates, defering to `this` jsdoc's props allowing property-overwriting
    doc.properties = unionBy(doc.properties, sourceProperties, 'name');
  }

  if (doc.properties.length > 0) {
    const newProps = [];
    doc.properties.forEach(prop => {
      const propsArray = expandProperty(prop, sources);
      propsArray.forEach(eprop => {
        newProps.push(cloneDeep(eprop));
      });
    });
    doc.properties = newProps;
    doc.properties = doc.properties.sort((a, b) => parseFloat(b.name) - parseFloat(a.name));
  }

  return doc;
};

/**
 * Expands a set of JSDoc definitions to include the content from all source
 *   typedefs, adding that content to each JSDoc's properties
 *
 * @param {jsdoc[]} jsdocs - set of JSDoc definitions
 * @param {object} [options]  optional parameters for function
 * @param {string[]} [options.sourceTypedefs] - set of full paths to files
 *                   with related typedefs in them
 * @returns {jsdoc[]} jsdocs - set of JSDoc definitions
 */
const expandTypedefs = (jsdocs, options) =>
  new Promise(res => {
    if (!Array.isArray(jsdocs) || jsdocs.length < 1) {
      res(jsdocs);
      return;
    }

    const typedefs = jsdocs.map(jsdoc => {
      const newDoc = expandTypedef(jsdoc, jsdocs, options);

      jsdoc.properties = newDoc.properties;

      return jsdoc
    });

    res(typedefs);
  });

module.exports.isTypedef = isTypedef;
module.exports.sourceTypedefs = sourceTypedefs;
module.exports.typeSources = typeSources;
module.exports.expandProperty = expandProperty;
module.exports.expandTypedef = expandTypedef;
module.exports.expandTypedefs = expandTypedefs;
