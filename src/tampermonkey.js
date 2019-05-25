// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @updateURL    https://raw.githubusercontent.com/s97712/jshook/master/src/tampermonkey.js
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *
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

  function hook(source, name, cb, construct) {
    const raw = getraw(source, name);

    if (construct) {
      source[name] = new Proxy(raw, {
        construct(target, args) {
          return cb(this, raw, args);
        }
      })
    } else {
      source[name] = function (...args) {
        return cb(this, raw, args);
      }
    }
  }
  window.hook = hook

  // Your code here...
})();
