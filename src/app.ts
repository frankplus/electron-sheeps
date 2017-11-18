// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import {ipcRenderer} from 'electron'
import * as ts from './translation_project'
import {ApplicationController }from './app_controller'

class ApplicationManager {
    project: ts.TranslationProject;
    appcontroller: ApplicationController;

    constructor() {
        this.project = undefined;

        // Listen to events that can change the application state
        ipcRenderer.on('open-project', (event, file) => {
            let project = ts.loadTranslationProjectFile(file);
            console.log(`project opened ${file}`);
            this.startProject(project);
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
            let source  = <HTMLInputElement>document.getElementById("mediaSource");
            let subfile = <HTMLInputElement>document.getElementById("subtitleFile");
            let refsubfile = <HTMLInputElement>document.getElementById("referenceSubtitleFile");

            let audiosourcepath = source.files[0].path;
            let subfilepath = subfile.files[0].path;
            let refsubfilepath = refsubfile.files[0] ? refsubfile.files[0].path : undefined;

            this.startProject(new ts.TranslationProject(audiosourcepath, subfilepath, refsubfilepath));
        });


        //application control buttons
        document.getElementById('playbutton').addEventListener("click", () => {
            this.appcontroller.play();
        });

        document.getElementById('pausebutton').addEventListener("click", () => {
            this.appcontroller.pause();
        });
    }

    // Loads project settings and shows the main program section
    startProject(newProject: ts.TranslationProject) {
        this.project = newProject;

        this.appcontroller = new ApplicationController(this.project);

        //change view to the main program section
        document.getElementById("newProjectSection").classList.remove('is-shown');
        document.getElementById("mainSection").classList.add('is-shown');
    }

    // Shows the form to create a new project
    createNewProject() {
        //change view to the new project form section
        document.getElementById("newProjectSection").classList.add('is-shown');
        document.getElementById("mainSection").classList.remove('is-shown');
        
        //stop video and subtitles
        this.appcontroller.pause();
    }
}


let appManager = new ApplicationManager();
