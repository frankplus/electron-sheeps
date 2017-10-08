// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')

let ts = require('./translation_project')
let video = require('./video')

let proj;
let videoplayer;

//listeners to application menu calls
ipcRenderer.on('open-project', (event, file) => {
    proj = ts.loadTranslationProjectFile(file);
    console.log(`project opened ${file}`);
    switchToMainSection();
});

ipcRenderer.on('save-project', (event, outputfile) => {
    ts.writeTranslationProjectToFile(proj, outputfile);
    console.log(`project saved`);
});

ipcRenderer.on('new-project', (event, outputfile) => {
    switchToNewProjectSection();
});

//listener to the submit of new project form
let form = document.getElementById("newProjectForm");
form.addEventListener('submit', function createNewProject(ev) {
    // Prevent <form> from sending a request, we're overriding this behavior here
    ev.preventDefault();

    //create project using input data
    let source:any = document.getElementById("mediaSource");
    let subfile:any = document.getElementById("subtitleFile");
    let refsubfile:any = document.getElementById("referenceSubtitleFile");

    let audiosourcepath = source.files[0].path;
    let subfilepath = subfile.files[0].path;
    let refsubfilepath = refsubfile.files[0].path;

    console.log("source: " + audiosourcepath);
    console.log("subfile: " + subfilepath);
    console.log("refsubfile: " + refsubfilepath);

    proj = new ts.TranslationProject(audiosourcepath, subfilepath, refsubfilepath);
    videoplayer = new video.Video(proj); 

    switchToMainSection();
});

function switchToMainSection(){
    //change view to the main program section
    document.getElementById("newProjectSection").classList.remove('is-shown');
    document.getElementById("mainSection").classList.add('is-shown');
}

function switchToNewProjectSection(){
    //change view to the new project form section
    document.getElementById("newProjectSection").classList.add('is-shown');
    document.getElementById("mainSection").classList.remove('is-shown');
}

//application control
function play(){
    videoplayer.play();
}

function pause(){
    videoplayer.pause();
}