import {TranslationProject} from './translation_project'

//temporary
import { parse, toSrtTime } from 'subtitle'
import { readFileSync } from 'fs'

export class VideoPlayer {
    private videoPanel: HTMLVideoElement;
    private subsArray;
    private subInterval: number;

    private getExtensionFromPath(path: string){
        return path.split('.').pop();
    }
    constructor(proj: TranslationProject, subsArray: any[]) {
        let mediaSourcePath = proj.mediaSourcePath;
        let subsFilePath = proj.subtitleFilePath;

        // Temporary stuff, just to try. We're not going to read twice the subtitle files
        let subsContent: string = readFileSync(subsFilePath, 'utf-8');
        this.subsArray = parse(subsContent);

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
    private setOverlayText(text: string) {
        let overlaysub:any = document.getElementById("overlaysub");
        overlaysub.innerHTML = text;
    } 

    public startSubtitles(){
        let video = this.videoPanel;
        let subs = this.subsArray;
        let setTextFunction = this.setOverlayText;

        //every second the current video time is checked and the corresponding subtitle is shown
        this.subInterval = window.setInterval(    
            function subScheduler(){
                let currentTime = video.currentTime*1000; //convert to milliseconds
                
                //search of the subtitle
                let currentSubtitle;
                for(let subtitle of subs){
                    if(subtitle.start <= currentTime && subtitle.end > currentTime){
                        currentSubtitle = subtitle;
                        break;
                    }
                }
                if(currentSubtitle !== undefined){
                    setTextFunction(currentSubtitle.text);
                }
                else{
                    setTextFunction("");
                }
            }, 100); //executed every second
        
    }

    public stopSubtitles(){
        if(this.subInterval !== undefined){
            window.clearInterval(this.subInterval);
        }
    }

    //play the video
    play(){
        this.videoPanel.play();
        this.startSubtitles();
    }

    //pause the video
    pause(){
        this.videoPanel.pause();
        this.stopSubtitles();
    }
}
