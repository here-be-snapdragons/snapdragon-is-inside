'use strict';

require('mocha');
var assert = require('assert');
var capture = require('snapdragon-capture');
var Snapdragon = require('snapdragon');
var isInside = require('..');
var snapdragon;

describe('snapdragon-capture', function() {
  describe('plugin usage', function() {
    beforeEach(function() {
      snapdragon = new Snapdragon();
      snapdragon.use(capture());
      snapdragon.use(isInside());
    });

    describe('errors', function(cb) {
      it('should throw an error when invalid args are passed to parse', function(cb) {
        try {
          snapdragon.parse();
          cb(new Error('expected an error'));
        } catch (err) {
          assert(err);
          assert.equal(err.message, 'expected a string');
          cb();
        }
      });
    });

    describe('.capture():', function() {
      it('should register a parser', function() {
        snapdragon.capture('all', /^.*/);
        snapdragon.parse('a/b');
        assert(snapdragon.parsers.hasOwnProperty('all'));
      });

      it('should use middleware to parse', function() {
        snapdragon.capture('all', /^.*/);
        snapdragon.parse('a/b');
        assert.equal(snapdragon.parser.parsed, 'a/b');
        assert.equal(snapdragon.parser.input, '');
      });

      it('should create ast node:', function() {
        snapdragon.capture('all', /^.*/);
        snapdragon.parse('a/b');
        assert.equal(snapdragon.parser.ast.nodes.length, 3);
      });

      it('should be chainable:', function() {
        snapdragon.parser
          .capture('text', /^\w+/)
          .capture('slash', /^\//);

        snapdragon.parse('a/b');
        assert.equal(snapdragon.parser.ast.nodes.length, 5);
      });
    });
  });

  describe('ast', function() {
    beforeEach(function() {
      snapdragon = new Snapdragon();
      snapdragon.use(capture());
      snapdragon.use(isInside());
      snapdragon
          .capture('text', /^\w+/)
          .capture('slash', /^\//);
    });

    describe('orig:', function() {
      it('should add pattern to orig property', function() {
        snapdragon.parse('a/b');
        assert.equal(snapdragon.parser.orig, 'a/b');
      });
    });

    describe('recursion', function() {
      // TODO!
      beforeEach(function() {
        snapdragon
          .capture('text', /^[^{},]+/)
          .capture('open', /^\{/)
          .capture('close', /^\}/)
          .capture('comma', /,/);
      });

      it('should set original string on `orig`', function() {
        snapdragon.parse('a{b,{c,d},e}f');
        assert.equal(snapdragon.parser.orig, 'a{b,{c,d},e}f');
      });
    });
  });
});

