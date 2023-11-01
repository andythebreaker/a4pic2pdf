const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://andythebreaker.github.io/a4pic2pdf/');

  const inputSelector = 'input[type="file"]';

  const [fileInput] = await page.$$(inputSelector);

  if (fileInput) {
    const filesToUpload = ['./img/1.jpg', './img/2.jpg'];

    await fileInput.uploadFile(...filesToUpload);

    console.log('Images uploaded.');

    // Locate the "Generate PDF" button and click it
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
})();
