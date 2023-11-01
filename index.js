const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Set the initial file count
let initialFileCount = 0;

// Function to get the current file count in the directory
function getCurrentFileCount(outputLocationDir) {
    const files = fs.readdirSync(outputLocationDir);
    console.log(files.length)
    return files.length;
};

async function main(filesToUpload, outputLocationDir, pdfFilename) {
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
        const currentFileCount = getCurrentFileCount(outputLocationDir);
        if (currentFileCount > initialFileCount) {
            break;
        }
        await page.waitForTimeout(1000); // Wait for 1 second before checking again
    }
    await browser.close();
}

module.exports = main;
