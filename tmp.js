const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto('https://andythebreaker.github.io/a4pic2pdf/');

  const button = await page.$x("//span[contains(., 'Upload images')]");

  if (button.length > 0) {
    // Click the button
    await button[0].click();
    console.log('Button clicked.');
  } else {
    console.error('Button not found.');
  }

})();
