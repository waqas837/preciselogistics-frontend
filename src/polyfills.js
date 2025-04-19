// src/polyfills.js
import { Buffer } from 'buffer';

// Polyfill Buffer
window.Buffer = Buffer;

// Polyfill process
window.process = window.process || {
  env: {},
  browser: true,
  version: '',
  nextTick: (callback) => setTimeout(callback, 0)
};

// Ensure these globals exist
window.global = window;
window.util = window.util || {};
window.stream = window.stream || { Readable: {} };
window.URL = window.URL || window.webkitURL;