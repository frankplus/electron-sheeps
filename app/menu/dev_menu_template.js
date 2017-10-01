"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
exports.devMenuTemplate = {
    label: 'Development',
    submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function () {
                electron_1.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
            }
        }, {
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function () {
                electron_1.BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function () {
                electron_1.app.quit();
            }
        }]
};
//# sourceMappingURL=dev_menu_template.js.map