## Modules

<dl>
<dt><a href="#module_docs">docs</a></dt>
<dd><p>Helpers for creating and processing JSDoc content</p>
</dd>
<dt><a href="#module_typedef">typedef</a></dt>
<dd><p>Helpers for processing JSDoc typedef content</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#expander">expander</a></dt>
<dd><p>Combines JSDoc typedef content to expand typedefs,
 properties, and parameters in JSDoc content</p>
</dd>
<dt><a href="#plugin">plugin</a></dt>
<dd><p>Helpers for processing JSDoc typedef content</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#expandTypedefs">expandTypedefs(jsdocs, [options])</a> ⇒ <code><a href="#jsdoc">Array.&lt;jsdoc&gt;</a></code></dt>
<dd><p>Expands a set of JSDoc definitions to include the content from all source
  typedefs, adding that content to each JSDoc&#39;s properties</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#jsdoc">jsdoc</a> : <code>object</code></dt>
<dd><p>JSDoc content parsed from in-code JSDoc comments.
This object represents each <em>possible</em> property that could be
   returned by <code>JSDoc</code>.</p>
</dd>
</dl>

<a name="module_docs"></a>

## docs
Helpers for creating and processing JSDoc content

<a name="module_typedef"></a>

## typedef
Helpers for processing JSDoc typedef content

<a name="expandTypedefs"></a>

## expandTypedefs(jsdocs, [options]) ⇒ [<code>Array.&lt;jsdoc&gt;</code>](#jsdoc)
Expands a set of JSDoc definitions to include the content from all source
  typedefs, adding that content to each JSDoc's properties

**Kind**: global function  
**Returns**: [<code>Array.&lt;jsdoc&gt;</code>](#jsdoc) - jsdocs - set of JSDoc definitions  

| Param | Type | Description |
| --- | --- | --- |
| jsdocs | [<code>Array.&lt;jsdoc&gt;</code>](#jsdoc) | set of JSDoc definitions |
| [options] | <code>object</code> | optional parameters for function |
| [options.sourceTypedefs] | <code>Array.&lt;string&gt;</code> | set of full paths to files                   with related typedefs in them |

<a name="jsdoc"></a>

## jsdoc : <code>object</code>
JSDoc content parsed from in-code JSDoc comments.
This object represents each _possible_ property that could be
   returned by `JSDoc`.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| comment | <code>string</code> | entire text of the comment section |
| longname | <code>string</code> | long version of the item name |
| kind | <code>string</code> | type of item described by this JSDoc |
| scope | <code>string</code> | describes scope in relation to file |
| memberof | <code>string</code> | module membership |
| meta | <code>object</code> | see typedef |
| meta.filename | <code>string</code> | name of source file for JSDoc |
| meta.range | <code>array</code> | from/to characters in JSDoc |
| meta.lineno | <code>number</code> | starting line of comment |
| meta.columnno | <code>number</code> | starting column number of comment |
| meta.path | <code>string</code> | path to file's containing directory |
| meta.code | <code>object</code> | see typedef |
| meta.code.id | <code>string</code> | ? |
| meta.code.name | <code>string</code> | name of code piece |
| meta.code.type | <code>string</code> | the type of code it is |
| meta.vars | <code>object</code> | ?? looks like an array of variables... |
| [params] | <code>Array.&lt;jsdoc-property&gt;</code> | set of parameters |
| [properties] | <code>Array.&lt;jsdoc-property&gt;</code> | set of properties |
| returns | <code>Array.&lt;jsdoc-property&gt;</code> | type of content returned |
| examples | <code>Array.&lt;string&gt;</code> | set of strings representing explanatory examples |
| todo | <code>Array.&lt;string&gt;</code> | set of strings representing todo items |

