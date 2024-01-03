const { app, BrowserWindow,dialog } = require('electron')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width:800,
    height:800,
    maxHeight:1200,
    maxWidth:1200,
    minHeight:500,
    minWidth:500,
    webPreferences:{
      enableRemoteModule: true
    }
  })
  const startURL = 'http://localhost:3000';
  mainWindow.loadURL(startURL);
  mainWindow.removeMenu()  
 }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.