Handlebars Helper: attributes
---

[Handlebars] helper which will generate an HTML element's attributes from an object of key/value pairs

## Installation

Install using npm:

    $ npm install handlebars-helper-attrs

Install using yarn:

    $ yarn add handlebars-helper-attrs

## Usage

**helpers.js**

Example helpers file that requires in Handlebars and registers the range
helper under the name `attrs`.

```js
var Handlebars = require('handlebars');

Handlebars.registerHelper('attrs', require('handlebars-helper-attrs'));
```

Once registered, templates will have access to the "attrs" helper which
accepts one argument: an object of key/value pairs which represent the
attributes which should be added to the HTML element

## Example

### Data

```
const objectOfAttributes = {
  id: 1234, // allows numbers
  disabled: true, // no attributes
  hidden: false, // ignore false
  class: ['class-1', 'class-2'], // arrays of content
  'data-emoji': '🦄', // even emojis!
};
```

### Template

```
<button {{#if objectOfAttributes}}{{{ attrs objectOfAttributes }}}{{/if}}>button text</button>
```

### Output

```
<button id="1234" disabled class="class-1 class-2" data-emoji="🦄">button text</button>
```

[Handlebars]: http://handlebarsjs.com/
