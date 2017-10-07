import { BrowserWindow, dialog, ipcMain } from 'electron';

import { spawn } from 'child_process';

export var MenuTemplate = {
    label: 'File',
    submenu: [
        {
            label: "New project",
            accelerator: "CmdOrCtrl+N",
            click: function () {
                let parentWindow = (process.platform == 'darwin') ? null : BrowserWindow.getFocusedWindow();
                parentWindow.webContents.send('new-project');
            }
        },
        {
            label: "Open existing project",
            accelerator: "CmdOrCtrl+O",
            click: function () {
                let dialogOptions: object = {
                    title: "Open existing project", 
                    properties: ['openFile'],
                    filters: [
                        {name: 'Electron sheeps projects', extensions: ['esproj']}
                    ]
                }
                let parentWindow = (process.platform == 'darwin') ? null : BrowserWindow.getFocusedWindow();
                dialog.showOpenDialog(parentWindow, dialogOptions, function (f) {
                    console.log("got a file: " + f)
                    parentWindow.webContents.send('open-project', f[0]);
                });
            }
        },
        {
            label: "Save project",
            accelerator: "CmdOrCtrl+S",
            click: function () {
                let dialogOptions: object = {
                    title: "Save project", 
                    filters: [
                        {name: 'Electron sheeps projects', extensions: ['esproj']}
                    ]
                }
                let parentWindow = (process.platform == 'darwin') ? null : BrowserWindow.getFocusedWindow();
                dialog.showSaveDialog(parentWindow, dialogOptions, function (f) {
                    console.log("got a file: " + f)
                    parentWindow.webContents.send('save-project', f);
                });
            }
        }
    ]
};
