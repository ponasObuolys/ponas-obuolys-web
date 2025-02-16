const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:8080', options);
  const reportHtml = runnerResult.report;
  fs.writeFileSync(path.resolve('./lighthouse-report.html'), reportHtml);

  await chrome.kill();
}

runLighthouse().catch(console.error); 