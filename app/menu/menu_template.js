"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
exports.MenuTemplate = {
    label: 'File',
    submenu: [
        {
            label: "Open video",
            accelerator: "CmdOrCtrl+O",
            click: function () {
                var options = {
                    title: "Open file",
                    properties: ['openFile'],
                    filters: [
                        { name: 'Movies', extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'] }
                    ]
                };
                var parentWindow = (process.platform == 'darwin') ? null : electron_1.BrowserWindow.getFocusedWindow();
                electron_1.dialog.showOpenDialog(parentWindow, options, function (f) { console.log("got a file: " + f); });
            }
        }
    ]
};
//# sourceMappingURL=menu_template.js.map