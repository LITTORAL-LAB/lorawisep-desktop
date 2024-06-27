import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
const { exec } = require('child_process')
const fs = require('fs')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function generateGraph(): Promise<boolean> {
  const rootDir =
    'D:\\ufpi\\outros\\littoral\\projetos\\electron\\LoRaWISEP\\lorawisep\\src\\main\\'

  exec(
    `python ./src/main/scripts/graph_ed_positions.py ${rootDir} ${rootDir}\\output\\endevices.csv`,
    async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)

      // event.sender.send("graphDone");
    }
  )
  return true
}

async function handleGenerateGraph(parameters): Promise<string> {
  const { devices, width, heigth } = parameters

  let b64 = ''
  const rootDir =
    'D:\\ufpi\\outros\\littoral\\projetos\\electron\\LoRaWISEP\\lorawisep\\src\\main\\'

  console.log(parameters)
  console.log('devices: ', devices)

  // event.reply('setParameters', 'ok')
  await exec(
    `python ./src/main/scripts/gen-pos.py ${devices} ${width} ${heigth}`,
    async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      await generateGraph()
      b64 = await fs.readFileSync(`${rootDir}\\analysis\\ed_positions\\positions.png`, {
        encoding: 'base64'
      })
      // event.reply('graphDone', 'ok')
    }
  )
  console.log('b64: ', b64)
  return b64
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  ipcMain.handle('generateGraph', handleGenerateGraph)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// IPC test
ipcMain.on('setParameters', (event, parameters) => {
  const { devices, width, heigth } = parameters

  console.log(parameters)
  console.log('devices: ', devices)

  event.reply('setParameters', 'ok')
  exec(
    `python ./src/main/scripts/gen-pos.py ${devices} ${width} ${heigth}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      generateGraph()
      event.reply('graphDone', 'ok')
    }
  )
})
