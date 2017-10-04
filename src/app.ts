// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

let ts = require('./translation_project')

//uncomment for example project
//let proj = new ts.TranslationProject("/home/francesco/Desktop/Pushing.Daisies.S01.576p.BluRay.DD5.1.x264-HiSD/Pushing.Daisies.S01E01.576p.BluRay.DD5.1.x264-HiSD.mkv", "/home/francesco/output_peaks");

ipcRenderer.on('open-project', (event, file) => {
    proj = ts.loadTranslationProjectFile(file);
    console.log(`project opened ${file}`)
});

ipcRenderer.on('save-project', (event, outputfile) => {
    ts.writeTranslationProjectToFile(proj, outputfile);
    console.log(`project saved`)
});