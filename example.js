const path = require('path');
const fs = require('fs');

const main = require('./index');

const filesToUpload = ['./img/1.jpg', './img/2.jpg'];
const outputLocationDir = path.join(process.cwd(), 'output'); // Change this to your desired output location directory
const pdfFilename = '00e2titl'; // Change this to your desired PDF filename

main(filesToUpload, outputLocationDir, pdfFilename);
  
