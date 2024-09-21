const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const a4pic2pdf = require('a4pic2pdf');

describe('a4pic2pdf', function () {
  // 增加超時時間，因為PDF生成可能需要一些時間
  this.timeout(25 * 60000);

  const imgInputDir = path.join(__dirname, 'example');
  const outputDir = path.join(__dirname, 'example');
  const pdfFilename = 'test_output.pdf';

  before(function () {
    // 確保測試輸出目錄存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  it('應該成功生成PDF文件', async function () {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webm'];
    const filesToUpload = fs.readdirSync(imgInputDir)
      .filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => path.join(imgInputDir, file));

    await a4pic2pdf(filesToUpload, outputDir, pdfFilename, true);
    //main logic
    const outputFile = path.join(outputDir, pdfFilename);
    expect(fs.existsSync(outputFile)).to.be.true;

    const stats = fs.statSync(outputFile);
    expect(stats.size).to.be.above(0);
  });

  after(function () {
    // 清理測試輸出
    const outputFile = path.join(outputDir, pdfFilename);
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  });
});