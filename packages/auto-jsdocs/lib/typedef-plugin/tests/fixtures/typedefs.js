/**
 * @namespace fixture-typedefs
 */

/**
 * Typedef one
 * @memberOf fixture-typedefs
 * @typedef {object} typedefOne
 * @property {string} item1 - string item num 1
 * @property {string} item2 - string item num 2
 * @property {string} item3 - string item num 3
 * @property {string} item4 - string item num 4
 */

/**
 * Typedef two
 * @memberOf fixture-typedefs
 * @typedef {typedefOne} typedefTwo
 * @property {string} [item4] - item num 4 in typedefTwo is optional
 * @property {string} item5 - string item num 5
 * @property {string} item6 - string item num 6
 * @property {string} item7 - string item num 7
 * @property {string} item8 - string item num 8
 * @property {string} item9 - string item num 9
 */

/**
 * Typedef three
 * @memberOf fixture-typedefs
 * @typedef {typedefTwo} typedefThree
 * @property {string} item10 - string item num 10
 * @property {string} item11 - string item num 11
 * @property {string} item12 - string item num 12
 * @property {string} item13 - string item num 13
 * @property {string} item14 - string item num 14
 * @property {fixture-typedefs.typedefOne} typedef1 - refs typedef 1
 */

/**
 * Typedef four
 * @memberOf fixture-typedefs
 * @typedef {typedefThree} typedefFour
 * @property {object} object1 - object num 1
 * @property {string} object1.item1 - object's substring 1
 * @property {string} object1.item2 - object's substring 2
 * @property {string} object1.item3 - object's substring 3
 * @property {fixture-typedefs.typedefTwo} [typedef2] - refs typedef 2
 */

/**
 * Typedef five
 * @memberOf fixture-typedefs
 * @typedef {typedefTwo|typedefOne} typedefFive
 */

/**
 * Typedef six
 * @memberOf fixture-typedefs
 * @typedef {object} typedefSix
 * @property {typedefFive} container - build from a typedef in typedef six
 */

/**
 * Typedef seven
 * @memberOf fixture-typedefs
 * @typedef {typedefSix|typedefThree} typedefSeven
 * @property {object} container - should be only container, not inherited
 * @property {string} container.name - should be the only item in container
 * @property {typedefSix} container-inherits - build from a typedef
 * @property {string} item1 - item1 starts in typedefOne, inherited via typedefThree;
 *    item1 is unique in typedef seven
 * @property {string} item10 - item10 starts in typedefThree; is unique in typedef seven
 * @property {string} item11 - item11 starts in typedefThree; item11 is unique in typedef seven
 */

/**
 * Typedef eight
 * @memberOf fixture-typedefs
 * @typedef {typedefOne|typedefTwo} typedefEight
 */
