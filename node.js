// jshint esversion: 6

const src = './img';

console.log('arr');

function putFilesToArray(path) {
  'use strict';

  const fs = require('fs');

  let arr = fs.readdirSync(path);

  console.log(arr);

  // module.exports.arr = arr;
}

putFilesToArray(src);