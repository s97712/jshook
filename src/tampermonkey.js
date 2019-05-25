// ==UserScript==
// @name         jshook
// @namespace    http://tampermonkey.net/
// @updateURL    https://raw.githubusercontent.com/s97712/jshook/master/src/tampermonkey.js
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const raws_symbol = Symbol("raw");
  function getraw(source, name) {

    if (!source[raws_symbol]) {
      source[raws_symbol] = {}
    }
    source[raws_symbol][name] = source[raws_symbol][name] || source[name];
    return source[raws_symbol][name];
  }


  function hookConstruct(source, name, cb) {
    const raw = getraw(source, name);
    source[name] = new Proxy(raw, {
      construct(target, args) {
        return cb(this, target, args);
      }
    })
  }

  function hookFunction(source, name, cb) {
    const raw = getraw(source, name);
    source[name] = function (...args) {
      return cb(this, raw, args);
    }
  }

  function hookProperty(source, name, get, set) {
    let raw = source[name];
    Object.defineProperty(source, name, {
      get() {
        return get(raw);
      },
      set(val) {
        raw = set ?set(val, raw) :val;
      },
      writable: true,
      configurable: true
    })
  }

  window.hook = {
    construct: hookConstruct,
    method: hookFunction,
    property: hookProperty
  }

  // Your code here...
})();
