const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const outputLocationDir = '/path/to/output/dir'; // Change this to your output directory path
  const pdfFilename = 'example.pdf'; // Change this to the expected PDF filename

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://andythebreaker.github.io/a4pic2pdf/');
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: outputLocationDir,
  });

  const inputSelector = 'input[type="file"]';
  const [fileInput] = await page.$$(inputSelector);

  if (fileInput) {
    await fileInput.uploadFile(...filesToUpload);

    console.log('Images uploaded.');

    await page.evaluate(newPdfTitle => {
      document.title = newPdfTitle;
    }, pdfFilename);

    const button = await page.$x("//button[contains(., 'Generate PDF')]");
    if (button.length > 0) {
      await button[0].click();
      console.log('Generate PDF button clicked.');
    } else {
      console.error('Generate PDF button not found.');
    }
  } else {
    console.error('File input not found.');
  }

  // Check for the new PDF file in the output directory
  let pdfFilePath;
  while (true) {
    const files = fs.readdirSync(outputLocationDir);
    pdfFilePath = files.find(file => file === pdfFilename);
    if (pdfFilePath) {
      console.log(`New PDF file '${pdfFilePath}' found in the output directory.`);
      break;
    }
    await page.waitForTimeout(1000); // Wait for 1 second before checking again
  }

  await browser.close();
})();
