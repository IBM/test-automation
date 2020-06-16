/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('chai').expect;
const cloneDeep = require('lodash/cloneDeep');
const path = require('path');

const { getJsdocData, getJsdocDataSync } = require('jsdoc-to-markdown');
const expander = require('../expander');

const typedefFixturesPath = path.join(__dirname, './fixtures/typedefs.js');
const fileFixturePath = path.join(__dirname, './fixtures/documented-script.js');
const typedefData = getJsdocDataSync({ files: typedefFixturesPath });
const fileFixtureData = getJsdocDataSync({ files: fileFixturePath });
const expected = {
  typedefOne: {
    initial: 4,
    expanded: 4,
    sourceProps: 0,
  },
  typedefTwo: {
    initial: 6,
    expanded: 9,
    sourceProps: 4,
  },
  typedefThree: {
    initial: 6,
    expanded: 19,
    sourceProps: 9,
  },
  typedefFour: {
    initial: 5,
    expanded: 33,
    sourceProps: 15,
  },
  typedefFive: {
    initial: 0,
    expanded: 9,
    sourceProps: 9,
  },
  typedefSix: {
    initial: 1,
    expanded: 10,
    sourceProps: 0,
  },
  typedefSeven: {
    initial: 6,
    expanded: 41,
    sourceProps: 16,
  },
  typedefEight: {
    initial: 0,
    expanded: 9,
    sourceProps: 10,
  },
};

const getTypedef = name => cloneDeep(typedefData.find(doc => doc.name === name));

describe('JSDocs typedef helpers', () => {
  describe('All functions exist', () => {
    it('must have functions', () => {
      expect(expander.expandTypedef).to.exist;
      expect(expander.expandTypedef).to.be.a('function');
      expect(expander.typeSources).to.exist;
      expect(expander.typeSources).to.be.a('function');
      expect(expander.sourceTypedefs).to.exist;
      expect(expander.sourceTypedefs).to.be.a('function');
      expect(expander.expandTypedefs).to.exist;
      expect(expander.expandTypedefs).to.be.a('function');
    });
  });

  describe('Get typedef content which is the source for other typedefs', () => {
    it('should accept a string for source typedef option', () => {
      const typedefs = expander.sourceTypedefs([], {
        sourceTypedefs: typedefFixturesPath,
      });
      expect(typedefs).to.be.an('array');
      expect(typedefs).to.be.a.lengthOf(Object.keys(expected).length);
    });
    it('should find typedefs within a file', () => {
      return getJsdocData({ files: fileFixturePath }).then(jsdocData => {
        const fixtureTypedefs = expander.sourceTypedefs(jsdocData);

        expect(fixtureTypedefs).to.be.an('array');
        expect(fixtureTypedefs).to.be.a.lengthOf(1);
      });
    });
  });

  describe('Get properites from sourced typedef', () => {
    it('should return nothing when not sourced from a typedef', () => {
      const typedefOne = getTypedef('typedefOne');
      const sourceProps = expander.typeSources(typedefOne.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefOne.sourceProps);
    });
    it('should return properties if source typedef has props', () => {
      const typedefTwo = getTypedef('typedefTwo');
      const sourceProps = expander.typeSources(typedefTwo.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefTwo.sourceProps);
    });
    it('should recursively get source typedef props', () => {
      const typedefThree = getTypedef('typedefThree');
      const sourceProps = expander.typeSources(typedefThree.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefThree.sourceProps);
    });
    it('should not expand props within source typedefs', () => {
      const typedefFour = getTypedef('typedefFour');
      const sourceProps = expander.typeSources(typedefFour.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefFour.sourceProps);
    });
    it('should handle multiple source typedefs', () => {
      const typedefFive = getTypedef('typedefFive');
      const sourceProps = expander.typeSources(typedefFive.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefFive.sourceProps);
    });
    it('should return nothing from props-less typedefs', () => {
      const typedefSix = getTypedef('typedefSix');
      const sourceProps = expander.typeSources(typedefSix.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefSix.sourceProps);
    });
    it('should not expand root props', () => {
      const typedefSeven = getTypedef('typedefSeven');
      const sourceProps = expander.typeSources(typedefSeven.type, typedefData);

      expect(sourceProps).to.be.a.lengthOf(expected.typedefSeven.sourceProps);
    });
  });

  describe('Expand property to include referenced typedef(s)', () => {
    it('should return array', () => {
      const noSource = 'test';
      const props = expander.expandProperty(noSource);

      expect(props).to.be.an('array');
      expect(props).to.be.a.lengthOf(1);
    });
    it('should return original prop if not expanded', () => {
      const noSource = { type: { names: ['object'] } };
      const props = expander.expandProperty(noSource, typedefData);

      expect(props).to.be.an('array');
      expect(props).to.be.a.lengthOf(1);
    });
    it('should return expanded original prop on typedef match', () => {
      const oneSource = { type: { names: ['typedefOne'] }, name: 'meow' };
      const typedefOne = getTypedef('typedefOne');
      const props = expander.expandProperty(oneSource, typedefData);

      expect(props).to.be.an('array');
      expect(props).to.be.a.lengthOf(5);
      expect(props[0].name).to.equal('meow');
      expect(props[1].name).to.equal(`meow.${typedefOne.properties[0].name}`);
      expect(props[2].name).to.equal(`meow.${typedefOne.properties[1].name}`);
      expect(props[3].name).to.equal(`meow.${typedefOne.properties[2].name}`);
      expect(props[4].name).to.equal(`meow.${typedefOne.properties[3].name}`);
    });
    it('should make expanded properties optional where appropriate', () => {
      const oneSource = {
        type: { names: ['typedefOne'] },
        name: 'meow',
        optional: true,
      };
      const props = expander.expandProperty(oneSource, typedefData);

      expect(props).to.be.an('array');
      expect(props).to.be.a.lengthOf(5);
      expect(props[0].optional).to.be.true;
      expect(props[1].optional).to.be.true;
      expect(props[2].optional).to.be.true;
      expect(props[3].optional).to.be.true;
      expect(props[4].optional).to.be.true;
    });
  });

  describe('Expand properites in one JSDoc to include referenced typedefs', () => {
    it('should return typedef if not expanded', () => {
      const typedefOne = getTypedef('typedefOne');

      const typedefOneExpanded = expander.expandTypedef(typedefOne, typedefData);
      expect(typedefOne.properties).to.be.a.lengthOf(
        expected.typedefOne.initial
      );
      expect(typedefOneExpanded.properties).to.be.a.lengthOf(
        expected.typedefOne.expanded
      );
    });
    it('should expand a typedef sourced from another typedef', () => {
      const typedefTwo = getTypedef('typedefTwo');

      const typedefTwoExpanded = expander.expandTypedef(typedefTwo, typedefData);

      expect(typedefTwo.properties).to.be.a.lengthOf(
        expected.typedefTwo.initial
      );
      expect(typedefTwoExpanded.properties).to.be.a.lengthOf(
        expected.typedefTwo.expanded
      );
    });
    it('should expand a sourced typedef and properties with sources', () => {
      const typedefThree = getTypedef('typedefThree');

      const typedefThreeExpanded = expander.expandTypedef(
        typedefThree,
        typedefData
      );
      expect(typedefThree.properties).to.be.a.lengthOf(
        expected.typedefThree.initial
      );
      expect(typedefThreeExpanded.properties).to.be.a.lengthOf(
        expected.typedefThree.expanded
      );
    });
    it('should expand typedefs recursively', () => {
      const typedefFour = getTypedef('typedefFour');

      const typedefFourExpanded = expander.expandTypedef(
        typedefFour,
        typedefData
      );
      expect(typedefFour.properties).to.be.a.lengthOf(
        expected.typedefFour.initial
      );
      expect(typedefFourExpanded.properties).to.be.a.lengthOf(
        expected.typedefFour.expanded
      );
      const optionals = typedefFourExpanded.properties.filter(
        prop => prop.name.split('.')[0] === 'typedef2'
      );
      expect(optionals).to.exist;
      expect(optionals).to.be.an('array');
      optionals.forEach(opt => {
        expect(opt.optional).to.be.true;
      });
    });
    it('should allow more than one source typedef', () => {
      const typedefFive = getTypedef('typedefFive');

      const typedefFiveExpanded = expander.expandTypedef(
        typedefFive,
        typedefData
      );
      expect(typedefFive.properties).to.not.exist;
      expect(typedefFiveExpanded.properties).to.be.a.lengthOf(
        expected.typedefFive.expanded
      );
      const item4 = typedefFiveExpanded.properties.find(
        prop => prop.name === 'item4'
      );
      expect(item4.description).to.equal('string item num 4');
      expect(item4.optional).to.not.exist;
    });
    it('should allow more than one source typedef in a source typedef', () => {
      const typedefSix = getTypedef('typedefSix');

      const typedefSixExpanded = expander.expandTypedef(typedefSix, typedefData);
      expect(typedefSix.properties).to.be.a.lengthOf(
        expected.typedefSix.initial
      );
      expect(typedefSixExpanded.properties).to.be.a.lengthOf(
        expected.typedefSix.expanded
      );
    });
    it('should allow recursive depth, but no duplicates', () => {
      const typedefSeven = getTypedef('typedefSeven');

      const typedefSevenExpanded = expander.expandTypedef(
        typedefSeven,
        typedefData
      );
      expect(typedefSeven.properties).to.be.a.lengthOf(
        expected.typedefSeven.initial
      );
      expect(typedefSevenExpanded.properties).to.be.a.lengthOf(
        expected.typedefSeven.expanded
      );
    });
    it('should build in order of typedef declaration', () => {
      const typedefEight = getTypedef('typedefEight');

      const typedefEightExpanded = expander.expandTypedef(
        typedefEight,
        typedefData
      );
      expect(typedefEight.properties).to.not.exist;
      expect(typedefEightExpanded.properties).to.be.a.lengthOf(
        expected.typedefEight.expanded
      );
      const item4 = typedefEightExpanded.properties.find(
        prop => prop.name === 'item4'
      );
      expect(item4.description).to.equal(
        'item num 4 in typedefTwo is optional'
      );
      expect(item4.optional).to.be.true;
    });
  });

  describe('Expand properites from an array of JSDocs arrays', () => {
    it('should expand typedefs in JSDocs data', () => {
      return expander.expandTypedefs(typedefData).then(typedefs => {
        expect(typedefs).to.be.an('array');
        const getTypedefOutput = name =>
          typedefs.find(doc => doc.name === name);

        expect(getTypedefOutput('typedefOne').properties).to.be.a.lengthOf(
          expected.typedefOne.expanded
        );
        expect(getTypedefOutput('typedefTwo').properties).to.be.a.lengthOf(
          expected.typedefTwo.expanded
        );
        expect(getTypedefOutput('typedefThree').properties).to.be.a.lengthOf(
          expected.typedefThree.expanded
        );
        expect(getTypedefOutput('typedefFour').properties).to.be.a.lengthOf(
          expected.typedefFour.expanded
        );
        expect(getTypedefOutput('typedefFive').properties).to.be.a.lengthOf(
          expected.typedefFive.expanded
        );
        expect(getTypedefOutput('typedefSix').properties).to.be.a.lengthOf(
          expected.typedefSix.expanded
        );
        expect(getTypedefOutput('typedefSeven').properties).to.be.a.lengthOf(
          expected.typedefSeven.expanded
        );
        expect(getTypedefOutput('typedefEight').properties).to.be.a.lengthOf(
          expected.typedefEight.expanded
        );
      });
    });
  });

  describe('Expand parameters to include referenced typedef(s)', () => {
    it('should have parameters include typedef properties', () => {
      return expander.expandTypedefs(cloneDeep(fileFixtureData), { sourceTypedefs: [typedefFixturesPath]}).then(expanded => {
          const typedef = expanded.find(item => item.kind === 'typedef');

          expect(typedef).to.be.an('object');
          expect(typedef.properties).to.be.an('array');
          expect(typedef.properties).to.be.a.lengthOf(
            expected.typedefEight.expanded
          );
      });
    });
  });
});
