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

      // Wait for the PDF to be generated
      await page.waitForTimeout(3000);

      // Get the URL of the generated PDF
      const pdfUrl = await page.evaluate(() => {
        return document.querySelector('a[href$=".pdf"]').getAttribute('href');
      });

      // Open the PDF in a new tab
      const newPage = await browser.newPage();
      await newPage.goto(pdfUrl);
      
      // Download the PDF to the 'output' directory
      const pdfFileName = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1);
      await newPage.pdf({ path: `output/${pdfFileName}`, format: 'A4' });

      console.log(`PDF downloaded to 'output/${pdfFileName}'`);
    } else {
      console.error('Generate PDF button not found.');
    }
  } else {
    console.error('File input not found.');
  }

  await browser.close();
})();
