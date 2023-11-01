const puppeteer = require('puppeteer');
const path = require('path');

async function main(filesToUpload, outputLocationDir, pdfFilename) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://andythebreaker.github.io/a4pic2pdf/');
  const client = await page.target().createCDPSession()
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: outputLocationDir,
  })
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

  await page.waitForTimeout(5000); // Wait for PDF generation to complete (adjust as needed)

  await browser.close();
}

const filesToUpload = ['./img/1.jpg', './img/2.jpg'];
const outputLocationDir = path.join(process.cwd(), 'output'); // Change this to your desired output location directory
const pdfFilename = '000ftitl'; // Change this to your desired PDF filename

main(filesToUpload, outputLocationDir, pdfFilename);
