import {BrowserWindow, dialog} from 'electron';

export var MenuTemplate = {
    label: 'File',
    submenu: [
        {
            label: "Open video",
            accelerator: "CmdOrCtrl+O",
            click: function () {
                let options: object = {
                    title: "Open file", 
                    properties: ['openFile'],
                    filters: [
                        {name: 'Movies', extensions: ['mp4','webm','ogg','mov','avi','mkv','m4v']}
                    ]
                }
                let parentWindow = (process.platform == 'darwin') ? null : BrowserWindow.getFocusedWindow();
                dialog.showOpenDialog(parentWindow, options, function (f) { console.log("got a file: " + f) });
            }
        }
    ]
};
