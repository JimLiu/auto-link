var should        = require('should'),
    autoLink      = require('../index');


describe('auto-link', function() {
  describe('#link()', function() {

    it('should replace a url', function(done) {
      var raw = '<p>Welcom to www.google.com</p>';
      var html = autoLink.link(raw);
      html.should.equal('<p>Welcom to <a href="http://www.google.com">www.google.com</a></p>');
      done();
    });

    it('should keep attributes after replace a url', function(done) {
      var raw = '<p class="myclass" id="p1">Welcom to www.google.com</p>';
      var html = autoLink.link(raw);
      html.should.equal('<p class="myclass" id="p1">Welcom to <a href="http://www.google.com">www.google.com</a></p>');
      done();
    });

    it('should replace a url and add target to link', function(done) {
      var raw = 'www.google.com';
      var html = autoLink.link(raw, {
        target: '_blank'
      });
      html.should.equal('<a href="http://www.google.com" target="_blank">www.google.com</a>');
      done();
    });

    it('should replace a url and add attributes to link', function(done) {
      var raw = 'www.google.com';
      var html = autoLink.link(raw, {
        attrs: {
          class: 'mylink',
          name: 'mylink1',
          id: 'mylink2'
        }
      });
      html.should.equal('<a href="http://www.google.com" class="mylink" name="mylink1" id="mylink2">www.google.com</a>');
      done();
    });

    it('should NOT replace a url within a href tag or a pre tag', function(done) {
      var raw = '<p>Welcom to <a href="http://www.google.com">www.google.com</a></p> and <pre>www.github.com</pre>';
      var html = autoLink.link(raw);
      html.should.equal('<p>Welcom to <a href="http://www.google.com">www.google.com</a></p> and <pre>www.github.com</pre>');
      done();
    });

    it('should NOT replace a url with a specific tag', function(done) {
      var raw = '<p>Welcom to www.google.com</p>, <span>www.stackoverflow.com</span> and <pre>www.github.com</pre>';
      var html = autoLink.link(raw, {
        ignore: {
          tags: ['p', 'span']
        }
      });
      html.should.equal('<p>Welcom to www.google.com</p>, <span>www.stackoverflow.com</span> and <pre><a href="http://www.github.com">www.github.com</a></pre>');
      done();
    });


    it('should NOT replace a url with a element with class name "hljs"', function(done) {
      var raw = '<p class="hljs">Welcom to www.google.com</p>';
      var html = autoLink.link(raw);
      html.should.equal('<p class="hljs">Welcom to www.google.com</p>');
      done();
    });

    it('should NOT replace a url with a element with specific class name "myclass"', function(done) {
      var raw = '<p class="hljs">Welcom to www.google.com <span class="myclass">and www.github.com</span></p>';
      var html = autoLink.link(raw, {
        ignore: {
          classes: ['myclass']
        }
      });
      html.should.equal('<p class="hljs">Welcom to <a href="http://www.google.com">www.google.com</a> <span class="myclass">and www.github.com</span></p>');
      done();
    });

    it('should NOT replace a url with a element with id contains `myid`', function(done) {
      var raw = '<p id="hljs">Welcom to www.google.com <span id="myid1">and www.github.com</span></p>';
      var html = autoLink.link(raw, {
        ignore: {
          fn: function(ele) {
            return ele.attr('id') && ele.attr('id').indexOf('myid') > -1;
          }
        }
      });
      html.should.equal('<p id="hljs">Welcom to <a href="http://www.google.com">www.google.com</a> <span id="myid1">and www.github.com</span></p>');
      done();
    });

  });
});