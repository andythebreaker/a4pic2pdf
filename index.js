const net = require('net');
const util = require('util');
const puppeteer = require('puppeteer');
const installpubhtmlIfNotInstalled = require('./pubhtmlinstall');

// Promisify the findUnusedPort_ function
const findUnusedPort_ = (startPort, endPort, callback) => {
    let currentPort = startPort;

    function tryPort(port) {
        const server = net.createServer();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // Port is in use, try the next one
                server.close();
                tryPort(port + 1);
            } else {
                // An error occurred, pass it to the callback
                callback(err);
            }
        });
        server.listen(port, () => {
            // Port is available
            server.close(() => {
                callback(null, port);
            });
        });
    }

    tryPort(currentPort);
};

const findUnusedPort = util.promisify(findUnusedPort_);

async function main() {
    await installpubhtmlIfNotInstalled();

    const port = await findUnusedPort(30000, 40000);
    console.log(port);

    // const browser = await puppeteer.launch();
    // try {
    //     const page = await browser.newPage();

    //     // Specify the URL of the web page you want to load
    //     const url = 'https://example.com';

    //     await page.goto(url);

    //     // You can now interact with the loaded page, take screenshots, or perform other actions

    //     // For example, you can take a screenshot of the page
    //     await page.screenshot({ path: 'screenshot.png' });
    // } catch (error) {
    //     console.error('An error occurred:', error);
    // } finally {
    //     await browser.close();
    // }
}

module.exports = main;

