import { parse, toSrtTime } from 'subtitle'
import { readFileSync } from 'fs'

export class SubtitleList {
    table: HTMLTableElement

    public constructor(subsFilePath: string) {
        // Temporary stuff, just to try. We're not going to read twice the subtitle files
        let subsContent: string = readFileSync(subsFilePath, 'utf-8');
        //let referenceContent: string = readFileSync(referenceFilePath, 'utf-8'); // TODO

        let subsArray = parse(subsContent);
        //let referenceArray = parse(referenceContent); // TODO

        this.table = <HTMLTableElement>document.getElementById('subtitlelist');

        for(let subtitle of subsArray) {
            this.appendRow(subtitle);
        }

        // Create header
        // We do this here, because otherwise all the subtitles get added to the thead and not to tbody
        let tableHeader = this.table.createTHead();
        let headerRow = tableHeader.insertRow();

        let numberHeader = document.createElement('th');
        numberHeader.innerHTML = 'Number';
        headerRow.appendChild(numberHeader);

        let startTimeHeader = document.createElement('th');
        startTimeHeader.innerHTML = 'Start time';
        headerRow.appendChild(startTimeHeader);

        let endTimeHeader = document.createElement('th');
        endTimeHeader.innerHTML = 'End time';
        headerRow.appendChild(endTimeHeader);

        let textHeader = document.createElement('th');
        textHeader.innerHTML = 'Text';
        headerRow.appendChild(textHeader);

        // TODO
        //let referenceHeader = document.createElement('th');
        //referenceHeader.innerHTML = 'Reference/VO';
        //headerRow.appendChild(referenceHeader);
    }

    public addSubtitle(sub) {
        this.appendRow(sub);
    }

    private appendRow(subtitle: any) {
        let newRow: HTMLTableRowElement = this.table.insertRow();

        let index: number = newRow.rowIndex;

        let subNumberCell = newRow.insertCell();
        subNumberCell.appendChild(document.createTextNode(`${index}`));
        
        let startTimeCell = newRow.insertCell();
        let startTime = toSrtTime(subtitle.start);
        startTimeCell.appendChild(document.createTextNode(startTime));

        let endTimeCell = newRow.insertCell();
        let endTime = toSrtTime(subtitle.end);
        endTimeCell.appendChild(document.createTextNode(endTime));

        let textCell = newRow.insertCell();
        textCell.appendChild(document.createTextNode(subtitle.text));

        // TODO
        //let referenceCell = newRow.insertCell();
        //subNumberCell.appendChild(document.createTextNode());

        // Do we really need to do this thing in order to access the current class
        // inside the event handler?
        // Is there a better way? Or is this indicating that this is bad design?
        let thiz = this;
        newRow.addEventListener('click', function(event) {
            thiz.onRowClicked(event);
        });
    }

    private onRowClicked(event) {
        alert(event.currentTarget);
        let sub = { start: 123, end: 125, text: 'Questa è una prova' };
        this.addSubtitle(sub);
    }
}
