import {TranslationProject} from './translation_project'

export class Video {
    private videopanel: any;
    private getExtensionFromPath(path: string){
        return path.split('.').pop();
    }
    constructor(proj: TranslationProject) {
        //extract extension from path and check if supported
        let mediaPath = proj.mediaSourcePath;
        let extension = this.getExtensionFromPath(mediaPath);
        let supportedExtensions = ['mp4','webm','ogg','mov','avi','mkv','m4v'];
        if(supportedExtensions.indexOf(extension) > -1){
            //load source
            let videosource:any = document.getElementById("videosource");
            videosource.src = mediaPath;

            //load video
            this.videopanel = document.getElementById("videopanel");
            this.videopanel.load();

            //play
            //this.play();
        }
        else{
            console.log("file type not supported");
        }
    }

    //play the video
    play(){
        this.videopanel.play();
    }

    //pause the video
    pause(){
        this.videopanel.pause();
    }
}