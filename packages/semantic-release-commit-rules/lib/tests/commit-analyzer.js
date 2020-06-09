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
  const expected = [
    { type: 'feat', release: 'minor' },
    { type: 'perf', release: 'patch' },
    { type: 'perf', scope: 'dep-*', release: 'minor' },
    { type: 'refactor', release: false },
    { scope: 'break-*', release: 'major' },
    { scope: 'minor-*', release: 'minor' },
  ];

  it('creates the correct number of rules', () => {
    expect(releaseRules).to.have.a.lengthOf(6);
  });

  it('creates the correct releaseRules array', () => {
    expect(releaseRules).to.deep.equal(expected)
  });
});
