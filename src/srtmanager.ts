import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'subtitle';
import { SrtObject } from './srtobject';
import { SubtitleTree, EmptyTree } from './subtitletree';
import * as path from 'path';

export class SrtManager {
    private tree: SubtitleTree;

    public constructor(srtFilePath: string) {
        this.tree = EmptyTree;
        // path.join(__dirname, 'scrubs.srt')
        let content: string = readFileSync(srtFilePath, 'utf-8');
        let subtitles = parse(content);
        /*
        [
            {
                start: 20000, // time in ms
                end: 24400,
                text: 'Bla Bla Bla Bla'
            },
            {
                start: 24600,
                end: 27800,
                text: 'Bla Bla Bla Bla'
            }
        ]
        */

        for (let subtitle of subtitles) {
            //TODO: wasted copies, sigh
            this.tree = this.tree.insert(new SrtObject(
                subtitle.start,
                subtitle.end,
                subtitle.text
            ));
        }
    }
}

