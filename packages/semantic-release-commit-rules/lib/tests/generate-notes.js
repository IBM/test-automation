/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { expect} = require('chai');
const noteFuncs = require('../generate-notes');
const config = require('./fixtures/configuration');

describe('exports all functionality', () => {
  it('must be functions', () => {
    expect(noteFuncs.cleanupScopes).to.be.a('function');
    expect(noteFuncs.getCommitType).to.be.a('function');
    expect(noteFuncs.isBreakingChange).to.be.a('function');
  })
});

describe('cleanupScopes behaves as expected', () => {
  it('can remove keywords', () => {
    expect(noteFuncs.cleanupScopes('minor-hello', config)).to.equal('hello');
  });
  it('can ignore scopes without configs', () => {
    expect(noteFuncs.cleanupScopes('meow', config)).to.equal('meow');
  });
  it('can replace strings ', () => {
    expect(noteFuncs.cleanupScopes('break-hello', config)).to.equal('Breaking Changes: hello');
  });
});

describe('getCommitType returns the correct string', () => {
  it('returns the correct string', () => {
    expect(noteFuncs.getCommitType('feat', config, true)).to.equal('Features');
    expect(noteFuncs.getCommitType('perf', config, true)).to.equal('Performance Improvements');
  });

  it('can be overrode with doDiscard', () => {
    expect(noteFuncs.getCommitType('refactor', config, false)).to.equal('Code Refactoring');
  });
});

describe('isBreakingChange behaves as expected', () => {
  it('returns true', () => {
    expect(noteFuncs.isBreakingChange({type: 'feat', scope: 'break-hello'}, config)).to.be.true;
  });
  it('returns false', () => {
    expect(noteFuncs.isBreakingChange({type: 'feat'}, config)).to.be.false;
    expect(noteFuncs.isBreakingChange({type: 'feat'}, config)).to.be.false;
  });
});
