/* ***************************************************************** */
/*                                                                   */
/* IBM Confidential                                                  */
/* OCO Source Materials                                              */
/*                                                                   */
/* (C) Copyright IBM Corp. 2019                                      */
/*                                                                   */
/* The source code for this program is not published or otherwise    */
/* divested of its trade secrets, irrespective of what has been      */
/* deposited with the U.S. Copyright Office.                         */
/*                                                                   */
/* ***************************************************************** */

/* eslint-disable max-len */
/**
 * HTML (fixture) should result in zero errors (expected.messages) from the W3C validator
 */
const zeroErrors = {
  fixture: '<button>non-failing</button>',
  expected: {
    messages: [],
    encoded: '',
  },
};

const htmlFile = {
  fixture:
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Full HTML file</title><h1>two errors</h1></head><body><button>no error here</button></body></html>',
  expected: {
    messages: [
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 113,
        firstColumn: 107,
        message: 'Stray end tag “head”.',
        extract: 'error</h1></head><body>',
        hiliteStart: 10,
        hiliteLength: 7,
      },
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 119,
        firstColumn: 114,
        message:
          'Start tag “body” seen but an element of the same type was already open.',
        extract: 'h1></head><body><butto',
        hiliteStart: 10,
        hiliteLength: 6,
      },
    ],
    encoded:
      'w3cErrorLogStartw3cError{"type":"error","lastLine":1,"lastColumn":113,"firstColumn":107,"message":"Stray end tag “head”.","extract":"error</h1></head><body>","hiliteStart":10,"hiliteLength":7}w3cError{"type":"error","lastLine":1,"lastColumn":119,"firstColumn":114,"message":"Start tag “body” seen but an element of the same type was already open.","extract":"h1></head><body><butto","hiliteStart":10,"hiliteLength":6}w3cErrorLogEnd',
  },
};

/**
 * HTML (fixture) should result in four errors (expected.messages) from the W3C validator
 */
const fourErrors = {
  fixture:
    '<button><h1 id="meow">failing <h2 id="meow2">html</h2></h1></button>',
  expected: {
    messages: [
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 113,
        firstColumn: 100,
        message:
          'Element “h1” not allowed as child of element “button” in this context. (Suppressing further errors from this subtree.)',
        extract: 'y><button><h1 id="meow">failin',
        hiliteStart: 10,
        hiliteLength: 14,
      },
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 136,
        firstColumn: 122,
        message: 'Heading cannot be a child of another heading.',
        extract: '">failing <h2 id="meow2">html</',
        hiliteStart: 10,
        hiliteLength: 15,
      },
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 136,
        firstColumn: 122,
        message:
          'Element “h2” not allowed as child of element “button” in this context. (Suppressing further errors from this subtree.)',
        extract: '">failing <h2 id="meow2">html</',
        hiliteStart: 10,
        hiliteLength: 15,
      },
      {
        type: 'error',
        lastLine: 1,
        lastColumn: 150,
        firstColumn: 146,
        message: 'Stray end tag “h1”.',
        extract: '>html</h2></h1></butt',
        hiliteStart: 10,
        hiliteLength: 5,
      },
    ],
    // eslint-disable-next-line max-len
    encoded:
      'w3cErrorLogStartw3cError{"type":"error","lastLine":1,"lastColumn":113,"firstColumn":100,"message":"Element “h1” not allowed as child of element “button” in this context. (Suppressing further errors from this subtree.)","extract":"y><button><h1 id=&quot;meow&quot;>failin","hiliteStart":10,"hiliteLength":14}w3cError{"type":"error","lastLine":1,"lastColumn":136,"firstColumn":122,"message":"Heading cannot be a child of another heading.","extract":"&quot;>failing <h2 id=&quot;meow2&quot;>html</","hiliteStart":10,"hiliteLength":15}w3cError{"type":"error","lastLine":1,"lastColumn":136,"firstColumn":122,"message":"Element “h2” not allowed as child of element “button” in this context. (Suppressing further errors from this subtree.)","extract":"&quot;>failing <h2 id=&quot;meow2&quot;>html</","hiliteStart":10,"hiliteLength":15}w3cError{"type":"error","lastLine":1,"lastColumn":150,"firstColumn":146,"message":"Stray end tag “h1”.","extract":">html</h2></h1></butt","hiliteStart":10,"hiliteLength":5}w3cErrorLogEnd',
  },
};
/* eslint-enable max-len */

module.exports.zeroErrors = zeroErrors;
module.exports.htmlFile = htmlFile;
module.exports.fourErrors = fourErrors;
