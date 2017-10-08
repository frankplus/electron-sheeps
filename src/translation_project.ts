import { readFileSync, writeFileSync } from 'fs';

export class TranslationProject {
    // The path of the multimedia file
    // which contains the audio we want to sub
    mediaSourcePath: string;

    // The path of the subtitle file we're going to edit
    subtitleFilePath: string;

    // The path of an optional subtitle file used as reference
    referenceSubtitleFilePath?: string;

    constructor(mediaSourcePath: string, subtitleFilePath: string, referenceSubtitleFilePath?: string) {
        this.mediaSourcePath = mediaSourcePath;
        this.subtitleFilePath = subtitleFilePath;
        this.referenceSubtitleFilePath = referenceSubtitleFilePath;
    }
}

export function loadTranslationProjectFile(filePath: string): TranslationProject {
    let object = JSON.parse(readFileSync(filePath, 'utf8'));

    return new TranslationProject(object.audioSourcePath, object.subtitleFilePath, object.referenceSubtitleFilePath);
}

export function writeTranslationProjectToFile(project: TranslationProject, filePath: string) {
    let json = JSON.stringify(project);

    writeFileSync(filePath, json);
}
