const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const fs_ = require('fs').promises;

async function getCurrentFileCount(outputLocationDir) {
    try {
        const files = await fs_.readdir(outputLocationDir);
        console.log(files.length);
        return files.length;
    } catch (error) {
        console.error('An error occurred:', error);
        return -1; // or any suitable error handling
    }
}

async function main(filesToUpload, outputLocationDir, pdfFilename) {
    console.log('start')
    // Set the initial file count
    let initialFileCount = await getCurrentFileCount(outputLocationDir);
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
        const currentFileCount = await getCurrentFileCount(outputLocationDir);
        if (currentFileCount > initialFileCount) {
            break;
        }
        await page.waitForTimeout(1000); // Wait for 1 second before checking again
    }
    await browser.close();
}

module.exports = main;
