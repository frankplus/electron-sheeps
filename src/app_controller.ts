import {VideoPlayer} from './video'
import {SubtitleList} from './subtitle_list'
import {readFileSync} from 'fs'
import {parse} from 'subtitle'
import * as ts from './translation_project'

export class ApplicationController {
    videoplayer: VideoPlayer;
    sublist: SubtitleList;
    subsArray: any[];
    applicationLoop: number;

    constructor(newProject: ts.TranslationProject){
        // Temporary stuff, just to try. This may not be very efficient
        let subsContent: string = readFileSync(newProject.subtitleFilePath, 'utf-8');
        //let referenceContent: string = readFileSync(referenceFilePath, 'utf-8'); // TODO
        this.subsArray = parse(subsContent);
        //let referenceArray = parse(referenceContent); // TODO

        this.videoplayer = new VideoPlayer(newProject.mediaSourcePath);
        this.sublist = new SubtitleList(this.subsArray);
    }

    play(){
        let video = this.videoplayer;
        let subs = this.subsArray;
        let setOverlayText = this.videoplayer.setOverlayText;

        video.play();

        //every second the current video time is checked and the corresponding subtitle is shown
        this.applicationLoop = window.setInterval(    
            function subScheduler(){
                let currentTime = video.getCurrentTime()*1000; //convert to milliseconds
                
                //search of the subtitle NOT EFFICIENT, MUST CHANGE
                let currentSubtitle;
                for(let subtitle of subs){
                    if(subtitle.start <= currentTime && subtitle.end > currentTime){
                        currentSubtitle = subtitle;
                        break;
                    }
                }
                if(currentSubtitle !== undefined){
                    setOverlayText(currentSubtitle.text);
                }
                else{
                    setOverlayText("");
                }

                //refresh of the waveform
                let waveform = document.getElementById("waveform").innerHTML="Waveform<br>time: "+video.getCurrentTime();
            }, 100); //executed every tenth of a second
        
    }

    pause(){
        this.videoplayer.pause();

        if(this.applicationLoop !== undefined){
            window.clearInterval(this.applicationLoop);
        }
    }
}