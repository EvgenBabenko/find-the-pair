/*jshint esversion: 6 */
const path = './src/img';

function putFilesToArray(path) {
  'use strict';

  const fs = require('fs');
  let arrayOfFiles = [];

  function gatheringFiles(path) {
    let arr = fs.readdirSync(path);

    arr.forEach(elem => {
      // elem = path + '/' + elem;
      // while (fs.lstatSync(elem).isDirectory()) {
      //   return gatheringFiles(elem);
      // }
      arrayOfFiles.push(`'${elem}'`);
    });

  }
  gatheringFiles(path);

  fs.writeFileSync('arrayOfFiles.js', arrayOfFiles);
}

putFilesToArray(path);