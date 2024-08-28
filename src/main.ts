/* eslint-disable @typescript-eslint/ban-ts-comment */
import { app, BrowserWindow, ipcMain, crashReporter } from 'electron';
import path from 'path';
import { embed_batch, query } from './model';
import { openFileInOS, readFiles, saveFile } from './Services/FileManager';
import { createVectorDB, readFromDB } from './Services/VectorDBManager';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      autoplayPolicy: 'user-gesture-required',
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  //@ts-ignore
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    //@ts-ignore
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    //@ts-ignore
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // Add a handler for the `transformers` events. This enables 2-way communication
    // between the renderer process (UI) and the main process (processing).
    // https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
    ipcMain.handle('transformers:embed_batch', embed_batch);
    ipcMain.handle('transformers:query', query);
    ipcMain.handle('fileManager:readFiles', readFiles);
    ipcMain.handle('fileManager:saveFile', saveFile);
    ipcMain.handle('vectorDBManager:createVectorDB', createVectorDB);
    ipcMain.handle('vectorDBManager:readFromDB', readFromDB);
    ipcMain.handle('fileManager:openFileInOS', openFileInOS);

    createWindow();

  //   session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //     callback({
  //         responseHeaders: {
  //             ...details.responseHeaders,
  //             'Content-Security-Policy': ["default-src 'self'"]
  //         }
  //     })
  // })
});

// Configure the crash reporter
crashReporter.start({
  uploadToServer: false,
});

// Optionally, set a custom path for crash dumps
app.setPath('crashDumps', path.join(__dirname, 'crashes'));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
