// Since node.js environment has no fetch API, we should fill it here.
global.fetch = require('jest-fetch-mock');

// Sleep promise.
global.sleep = time => new Promise(resolve => setTimeout(resolve(), time));

// Plain DOM operations.
global.$ = require('jquery');