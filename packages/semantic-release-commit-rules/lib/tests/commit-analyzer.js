/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { expect} = require('chai');
const getReleaseRules = require('../commit-analyzer');
const config = require('./fixtures/configuration');

describe('getReleaseRules exists', () => {
  it('must be a function', () => {
    expect(getReleaseRules).to.be.a('function');
  })
});

describe('getReleaseRules generates valid releaseRules arrays', () => {
  const releaseRules = getReleaseRules(config);

  it('creates the correct number of rules', () => {
    expect(releaseRules).to.have.a.lengthOf(6);
  });

  it('creates the correct type', () => {
    expect(releaseRules[0].type).to.equal('feat');
    expect(releaseRules[1].type).to.equal('perf');
    expect(releaseRules[2].type).to.equal('perf');
    expect(releaseRules[3].type).to.equal('refactor');
    expect(releaseRules[4].type).to.be.undefined;
    expect(releaseRules[5].type).to.be.undefined;
  });

  it('creates the correct scope', () => {
    expect(releaseRules[0].scope).to.be.undefined;
    expect(releaseRules[1].scope).to.be.undefined;
    expect(releaseRules[2].scope).to.equal('dep-*');
    expect(releaseRules[3].scope).to.be.undefined;
    expect(releaseRules[4].scope).to.equal('break-*');
    expect(releaseRules[5].scope).to.equal('minor-*');
  });

  it('creates the correct release version', () => {
    expect(releaseRules[0].release).to.equal('minor');
    expect(releaseRules[1].release).to.equal('patch');
    expect(releaseRules[2].release).to.equal('minor');
    expect(releaseRules[3].release).to.equal(false);
    expect(releaseRules[4].release).to.equal('major');
    expect(releaseRules[5].release).to.equal('minor');
  });
});
