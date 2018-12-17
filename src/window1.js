const {ipcRenderer} = require('electron');
const {deserialize} = require('./serialize');

ipcRenderer.on('start-json-test', (e, payload, {protocol}) => {
  const deserialized = deserialize(payload, protocol);
  ipcRenderer.send('stop-json-test');
});

