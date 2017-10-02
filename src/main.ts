import { app, Menu, BrowserWindow, ipcMain } from 'electron';
import { MenuTemplate } from './menu/menu_template';
import { devMenuTemplate } from './menu/dev_menu_template';
import * as path from 'path';
import * as url from 'url';

import { spawnSync } from 'child_process';

// Special module holding environment variables
import env from './env';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
	setApplicationMenu();

	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Open the DevTools.
	if(env.development) mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

function setApplicationMenu () {
	var menus: any[] = [MenuTemplate];
	if (env.development) {
        menus.push(devMenuTemplate);
    }
	Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

ipcMain.on('extract-peaks', (event, arg) => {
        let res = spawnSync('./extra/pex', [arg.media, arg.out])
        if(res.status == 0) {
            event.returnValue = 'Yeah'
        }
        else if(res.status == 2) {
            event.returnValue = 'No audio'
        }
        else {
            event.returnValue = 'Nay'
        }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
