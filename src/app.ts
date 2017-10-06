// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

let ts = require('./translation_project')

//uncomment for example project
let proj = new ts.TranslationProject("/home/francesco/Desktop/Pushing.Daisies.S01.576p.BluRay.DD5.1.x264-HiSD/Pushing.Daisies.S01E01.576p.BluRay.DD5.1.x264-HiSD.mkv", "/home/francesco/output_peaks");

//ipc main process-renderers listeners
ipcRenderer.on('open-project', (event, file) => {
    proj = ts.loadTranslationProjectFile(file);
    console.log(`project opened ${file}`)
});

ipcRenderer.on('save-project', (event, outputfile) => {
    ts.writeTranslationProjectToFile(proj, outputfile);
    console.log(`project saved`)
});

/*
let form = document.getElementById("newProjectForm");
form.addEventListener('submit', function createNewProject(ev) {
    // Prevent <form> from sending a request, we're overriding this behavior here
    ev.preventDefault();

    console.log("switching section")

    document.getElementById("newProjectSection").classList.remove('is-shown');
    document.getElementById("container").classList.add('is-shown');
});
*/

function submitproject(){
    console.log("switching section")

    document.getElementById("newProjectSection").classList.remove('is-shown');
    document.getElementById("container").classList.add('is-shown');
}