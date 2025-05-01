const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const fs_ = require('fs').promises;

async function getCurrentFileCount(outputLocationDir, silent) {
    try {
        const files = await fs_.readdir(outputLocationDir);
        if (!silent) console.log(files.length);
        return files.length;
    } catch (error) {
        if (!silent) console.error('發生錯誤:', error);
        return -1; // 或其他適當的錯誤處理
    }
}

async function main(filesToUpload, outputLocationDir, pdfFilename, silent = true) {
    if (!silent) console.log('開始');
    // 設置初始文件數量
    let initialFileCount = await getCurrentFileCount(outputLocationDir, silent);
    const browser = await puppeteer.launch({ headless: 'new' });
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

        if (!silent) console.log('圖片已上傳。');

        await page.evaluate(newPdfTitle => {
            document.title = newPdfTitle;
        }, pdfFilename);

        const button = await page.$x("//button[contains(., 'Generate PDF')]");
        if (button.length > 0) {
            await button[0].click();
            if (!silent) console.log('已點擊生成 PDF 按鈕。');
        } else {
            if (!silent) console.error('未找到生成 PDF 按鈕。');
        }
    } else {
        if (!silent) console.error('未找到文件輸入框。');
    }

    // Check for the new PDF file in the output directory
    let pdfFilePath;
    const startTime = Date.now();
    let retried = false;
    while (true) {
        //old logic ~ const currentFileCount = await getCurrentFileCount(outputLocationDir, silent);
        if (fs.existsSync(path.join(outputLocationDir, pdfFilename+'.pdf'))) {
            console.log('PDF 文件已生成。');
            break;
        }
        // 新增：檢查是否超過一小時
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > 3600 && !retried) {
            const pdfPath = path.join(outputLocationDir, pdfFilename+'.pdf');
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
                if (!silent) console.log('等待超過一小時，已刪除 PDF 檔案，準備重新執行。');
            } else {
                if (!silent) console.log('等待超過一小時，PDF 檔案不存在，準備重新執行。');
            }
            await browser.close();
            retried = true;
            // 重新執行 main，僅重試一次
            return await main(filesToUpload, outputLocationDir, pdfFilename, silent);
        }
        await page.waitForTimeout(1000); // Wait for 1 second before checking again
        console.log('等待 PDF 文件生成...');
    }
    await browser.close();
}

module.exports = main;
