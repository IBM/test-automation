/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const capcon = require('capture-console');
const expect = require('chai').expect;

const attrs = require('../');

describe('Attributes handlebars helper', () => {
  it('must have the attrs helper', () => {
    expect(attrs).to.exist;
    expect(attrs).to.be.a('function');
  });

  it('attrs returns a string', () => {
    const response = attrs();

    expect(response).to.be.a('string');
  });

  it('attrs requires an object', () => {
    let response;
    const stderr = capcon.captureStderr(() => {
      response = attrs('test');
    });

    expect(response).to.equal('');
    expect(stderr.trim()).to.equal(
      'attributes must be a non-array object, attrs helper received string instead'
    );
  });

  it('attrs does not like arrays', () => {
    const arr = ['one', 'two'];
    let response;
    const stderr = capcon.captureStderr(() => {
      response = attrs(arr);
    });

    expect(response).to.be.a('string');
    expect(response).to.equal('');
    expect(stderr.trim()).to.equal(
      'attributes must be a non-array object, attrs helper received array instead'
    );
  });

  it('attrs converts an object to attributes', () => {
    const obj = {
      one: 'two',
      three: 'four',
    };

    const response = attrs(obj);

    expect(response).to.be.a('string');
    expect(response).to.include('one="two"');
    expect(response).to.include('three="four"');
  });

  it('attrs is fine with a zero', () => {
    const obj = {
      one: 0,
      three: '0',
    };

    const response = attrs(obj);

    expect(response).to.be.a('string');
    expect(response).to.include('one="0"');
    expect(response).to.include('three="0"');
  });

  it('attrs allows atttributes with no value', () => {
    const obj = {
      noValueTrue: true,
      noValueFalse: false,
      noValueNull: null,
      noValueUndefined: undefined,
    };

    const response = attrs(obj);

    expect(response).to.be.a('string');
    expect(response).to.include(' noValueTrue');
    expect(response).to.not.include('noValueFalse');
    expect(response).to.include('noValueNull="null"');
    expect(response).to.include('noValueUndefined="undefined"');
  });

  it('attrs allows multiple types of values', () => {
    const objectOfAttributes = {
      id: 1234, // allows numbers
      disabled: true, // no attributes
      hidden: false, // ignore false
      class: ['class-1', 'class-2'], // arrays of content
      'data-emoji': '🦄', // even emojis!
    };

    const response = attrs(objectOfAttributes);

    expect(response).to.be.a('string');
    expect(response).to.include('id="1234"');
    expect(response).to.include(' disabled ');
    expect(response).to.include('class="class-1 class-2"');
    expect(response).to.not.include('hidden');
    expect(response).to.include('data-emoji="🦄"');

  })
});
