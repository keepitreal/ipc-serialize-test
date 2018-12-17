const fs = require('fs');
const path = require('path');
const {performance} = require('perf_hooks');
const {app, ipcMain, BrowserWindow} = require('electron');
const {serialize} = require('./serialize');

// Sample JSON
const sampleJSON100kb = require('../json/100kb.json');
const sampleJSON190mb = require('../json/190mb.json');
const studioSnapshot = require('../json/studiofile/snapshot.json');

let browserWindow;

app.on('ready', () => {
  browserWindow = new BrowserWindow({ width: 800, height: 600 });

  browserWindow.loadFile('src/window1.html');
  browserWindow.webContents.openDevTools();
  browserWindow.on('closed', () => {
    win = null;
  });

  setTimeout(() => {
//     runTest(studioSnapshot, {protocol: 'raw'});
    runTest(studioSnapshot, {protocol: 'json'});
//     runTest(studioSnapshot, {protocol: 'bson'});
//     runTest(studioSnapshot, {protocol: 'v8'});
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function runTest(payload, {protocol}) {
  const timings = [];
  let performanceStart;
  let i = 10;

  function sendJSON() {
    const serialized = serialize(payload, protocol);
    performanceStart = performance.now();
    browserWindow.webContents.send('start-json-test', serialized, {protocol});
  }

  ipcMain.on('stop-json-test', (ev, arg) => {
    timings.push([performanceStart, performance.now()]);

    if (i > 0) {
      sendJSON()
      i--;
    } else {
      const {size} = fs.statSync(path.resolve(__dirname, '../json/', '100kb.json'));
      const kb = size / 1000;
      const protocolStr = protocol === 'raw' ? protocol : `${protocol} serialized`
      const header = `Sending ${kb}kb of ${protocolStr} data:`;
      logMetrics(timings, header);
    }
  });

  sendJSON();
}


function logMetrics(timings, header) {
  const sum = timings
    .map(([start, end]) => end - start)
    .reduce((sum, elapsed) => sum + elapsed);
  const avg = sum / timings.length;

  console.log(header);
  console.log(avg);
}

