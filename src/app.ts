// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

let ts = require('./translation_project');

class ApplicationManager {
    project?: any;

    constructor() {
        this.project = undefined;

        // Listen to events that change the application state
        ipcRenderer.on('open-project', (event, file) => {
            this.project = ts.loadTranslationProjectFile(file);
            this.startProject();
        });

        ipcRenderer.on('save-project', (event, outputFile) => {
            if(this.project) {
                ts.writeTranslationProjectToFile(this.project, outputFile);
            }
        });

        ipcRenderer.on('new-project', (event, outputFile) => {
            this.createNewProject();
        });

        document.getElementById("newProjectForm").addEventListener('submit', (ev) => {
            // Prevent <form> from sending an HTTP request, we're overriding this behaviour here
            ev.preventDefault();

            //create project using input data
            let source:any = document.getElementById("audioSource");
            let subfile:any = document.getElementById("subtitleFile");
            let refsubfile:any = document.getElementById("referenceSubtitleFile");

            let audiosourcepath = source.files[0].path;
            let subfilepath = subfile.files[0].path;
            let refsubfilepath = refsubfile.files[0] ? refsubfile.files[0].path : undefined;

            console.log("source: " + audiosourcepath);
            console.log("subfile: " + subfilepath);
            console.log("refsubfile: " + refsubfilepath);

            this.project =  new ts.TranslationProject(audiosourcepath, subfilepath, refsubfilepath);

            this.startProject();
        });
    }

    startProject() {
        //change view to the main program section
        document.getElementById("newProjectSection").classList.remove('is-shown');
        document.getElementById("mainSection").classList.add('is-shown');
    }

    createNewProject() {
        //change view to the new project form section
        document.getElementById("newProjectSection").classList.add('is-shown');
        document.getElementById("mainSection").classList.remove('is-shown');
    }
}

let appManager = new ApplicationManager();
