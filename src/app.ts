// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

const {spawn} = require('child_process')

const {prova} = require('./prova')

console.log(ipcRenderer.sendSync('extract-peaks', 
    {
        media: '/home/francesco/Desktop/Pushing.Daisies.S01.576p.BluRay.DD5.1.x264-HiSD/Pushing.Daisies.S01E01.576p.BluRay.DD5.1.x264-HiSD.mkv',
        out: '/home/francesco/output_peaks'
    }))
