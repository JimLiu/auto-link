var _ = require('lodash'),
    cheerio = require('cheerio'),

    AutoLink = {};


AutoLink.link = function(html, option) {
    if (!html || !_.isString(html)) {
        return html;
    }
    var $ = cheerio.load(html);

    option = _.merge({
        target: false,
        attrs: {},
        ignore: {
            tags: ['a', 'pre', 'code', 'textarea'],
            classes: ['hljs'],
            fn: null
        },
    }, option, function(a, b) {
      if (_.isArray(a) && _.isArray(b)) { // override tags/classes
        return b;
      }
    });

    var replaceURLWithHTMLLinks = function(text) {
        if (text) {
            text = text.replace(
                /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
                function(url){
                    var full_url = url;
                    if (!full_url.match('^https?:\/\/')) {
                        full_url = 'http://' + full_url;
                    }
                    var link = cheerio('<a href="' + full_url + '">' + url + '</a>');
                    _.forEach(option.attrs, function(value, name) {
                        link.attr(name, value);
                    });
                    if (option.target && _.isString(option.target)) {
                        link.attr('target', option.target);
                    }
                    return $.html(link);
                }
            );
        }
        return text;
    };

    var noLink = function(ele) {
        if (_.isFunction(option.ignore.fn)) {
            return option.ignore.fn(ele);
        }
        if (!ele.contents().length) {
            return true;
        }
        if (_.contains(option.ignore.tags, ele[0].name)) {
            return true;
        }
        for (var i = option.ignore.classes.length - 1; i >= 0; i--) {
            var className = option.ignore.classes[i];
            if (ele.hasClass(className)) {
                return true;
            }
        }
        return false;
    };


    var parseLinks = function(node) {
        if (noLink(node)) {
            return node;
        }
        var newNode = node.clone();
        newNode.html('');
        node.contents().each(function() {
            if (this.type === 'text') {
                newNode.append(replaceURLWithHTMLLinks(this.data));
            } else {
                var n = $(this);
                if (noLink(n)) {
                    newNode.append(n);
                } else {
                    newNode.append(parseLinks(n));
                }
            }
        });
        return newNode;
    };
    return parseLinks($.root()).html();
};


module.exports = AutoLink;
