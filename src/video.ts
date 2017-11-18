import {TranslationProject} from './translation_project'

//temporary
import { parse, toSrtTime } from 'subtitle'
import { readFileSync } from 'fs'

export class VideoPlayer {
    private videoPanel: HTMLVideoElement;

    private getExtensionFromPath(path: string){
        return path.split('.').pop();
    }
    constructor(mediaSourcePath: string) {
        //extract extension from path and check if supported
        let extension = this.getExtensionFromPath(mediaSourcePath);
        let supportedExtensions = ['mp4','webm','ogg','mov','avi','mkv','m4v'];
        if(supportedExtensions.indexOf(extension) > -1){
            //load source
            let videosource:any = document.getElementById("videosource");
            videosource.src = mediaSourcePath;

            //load video
            this.videoPanel = <HTMLVideoElement>document.getElementById("videopanel");
            this.videoPanel.load();
        }
        else{
            console.log("file type not supported");
        }

    }

    //functions for on video overlay subtitles:
    //set subtitle text overlay on the video
    setOverlayText(text: string) {
        let overlaysub:any = document.getElementById("overlaysub");
        overlaysub.innerHTML = text;
    } 

    getCurrentTime(): number{
        return this.videoPanel.currentTime;
    }

    //play the video
    play(){
        this.videoPanel.play();
    }

    //pause the video
    pause(){
        this.videoPanel.pause();
    }
}
