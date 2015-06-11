# Auto-link
Auto-link is an npm package that replaces URLs in text with HTML links, ignore the URLs within a href/pre tag.


## Installation
```
npm install --save auto-link
```

## Usage

```javascript
var autoLink = require('auto-link');
```

Using the link() method:

```js
var html = autoLink.link(text[, options]);
```

### Example

```js
var html = autoLink.link('<p>Welcom to www.google.com</p>');
//<p>Welcom to <a href="http://www.google.com">www.google.com</a></p>
```

## Options

These are specified by providing an Object as the second parameter to autoLink.link(). 

- `target`: String or Boolean  
A target attribute will be added to the replaced href tag if the `target` option is a String value. `false` means that do not add target attribuite.   
Default value is `false`.   
e.g.
```js
autoLink.link('<p>Welcom to www.google.com</p>', {
    target: '_blank'
});
//<p>Welcom to <a href="http://www.google.com" target="_blank">www.google.com</a></p>
``` 

- `attrs`: Object  
The attributes you want to add to the replaced href tag. e.g.
```js
autoLink.link('<p>Welcom to www.google.com</p>', {
    attrs: {
        class: 'mylink',
        name: 'mylink1',
        id: 'mylink2'
    }
});
//<p>Welcom to <a href="http://www.google.com" class="mylink" name="mylink1" id="mylink2">www.google.com</a></p>
``` 

- `ignore.tags`: Array[String]  
The URLs text within some tags should not be replaces. for example: `<a href="http://www.google.com">www.google.com</a>` should **NOT** be replaced to  `<a href="<a href="http://www.google.com">http://www.google.com</a>"><a href="http://www.google.com">www.google.com</a></a>`. So the The URLs text within `ignore.tags` won't be replaced.   
Defaults value is `['a', 'pre', 'code', 'textarea']`.   
e.g.
```js
autoLink.link('<p>Welcom to <a href="http://www.google.com">www.google.com</a></p>');
//<p>Welcom to <a href="http://www.google.com">www.google.com</a></p>

autoLink.link('<p>Welcom to www.google.com</p>, <span>www.stackoverflow.com</span> and <pre>www.github.com</pre>', {
        ignore: {
            tags: ['p', 'span']
        }
    });
//<p>Welcom to www.google.com</p>, <span>www.stackoverflow.com</span> and <pre><a href="http://www.github.com">www.github.com</a></pre>
``` 

- `ignore.classes`: Array[String]  
The same with `ignore.tags`, but it's for CSS classes.   
Defaults values is `['hljs']`.

e.g.
```js
autoLink.link('<p class="hljs">Welcom to www.google.com <span class="myclass">and www.github.com</span></p>', {
        ignore: {
            classes: ['myclass']
        }
    });
//<p class="hljs">Welcom to <a href="http://www.google.com">www.google.com</a> <span class="myclass">and www.github.com</span></p>
``` 

- `ignore.fn`: Function  
Sometimes it's hard to filter the elements by tags and CSS classes. so the `ignore.fn` is used to filter the elements which you want to ignore. The function has a [JSDOM](https://github.com/cheeriojs/cheerio#api) element as it's parameter, it should retrun a boolean value to specify the element ignores or not.   
If enable the `ignore.fn` option, the `ignore.tags` and `ignore.classes` options will be invalidated.  
e.g.
```js
autoLink.link('<p id="hljs">Welcom to www.google.com <span id="myid1">and www.github.com</span></p>', {
        ignore: {
            fn: function(ele) {
                return ele.attr('id') && ele.attr('id').indexOf('myid') > -1;
            }
        }
    });
//<p id="hljs">Welcom to <a href="http://www.google.com">www.google.com</a> <span id="myid1">and www.github.com</span></p>
``` 


## Tests

```
$ npm install -g mocha
```

```
npm test
```