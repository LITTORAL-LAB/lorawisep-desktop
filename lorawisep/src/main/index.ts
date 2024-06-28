import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import  {saveDevicesToCSV}  from './scripts/utils'
// import icon from '../../resources/icon.png?asset'
const { promisify } = require('util');
const execAsync = promisify(require('child_process').exec);
const fs = require('fs');
const parse = require('csv-parse');

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

// async function generateGraph(): Promise<boolean> {
//   const rootDir =
//     'D:\\ufpi\\outros\\littoral\\projetos\\electron\\LoRaWISEP\\lorawisep\\src\\main\\'

//   exec(
//     `python ./src/main/scripts/graph_ed_positions.py ${rootDir} ${rootDir}\\output\\endevices.csv`,
//     async (error: { message: any }, stdout: any, stderr: any) => {
//       if (error) {
//         console.log(`error: ${error.message}`)
//         return
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`)
//         return
//       }
//       console.log(`stdout: ${stdout}`)

//       // event.sender.send("graphDone");
//     }
//   )
//   return true
// }

// async function handleGenerateGraph(parameters): Promise<string> {
//   const { devices, width, heigth } = parameters

//   let b64 = ''
//   const rootDir =
//     'D:\\ufpi\\outros\\littoral\\projetos\\electron\\LoRaWISEP\\lorawisep\\src\\main\\'

//   console.log(parameters)
//   console.log('devices: ', devices)

//   // event.reply('setParameters', 'ok')
//   await exec(
//     `python ./src/main/scripts/gen-pos.py ${devices} ${width} ${heigth}`,
//     async (error, stdout, stderr) => {
//       if (error) {
//         console.log(`error: ${error.message}`)
//         return
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`)
//         return
//       }
//       console.log(`stdout: ${stdout}`)
//       // await generateGraph()
//       b64 = await fs.readFileSync(`${rootDir}\\analysis\\ed_positions\\positions.png`, {
//         encoding: 'base64'
//       })
//       // event.reply('graphDone', 'ok')
//     }
//   )
//   console.log('b64: ', b64)
//   return b64
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // ipcMain.handle('generateGraph', handleGenerateGraph)

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

ipcMain.on('loadDevices', async (event) => {
  const csvFilePath = "src/main/scripts/devices.csv";  // Certifique-se de que o caminho está correto

  fs.readFile(csvFilePath, (err, fileContent) => {
    if (err) {
      console.error("Erro ao ler o arquivo CSV:", err);
      event.reply('device-data-response', { error: "Falha ao carregar os dispositivos" });
      return;
    }

    parse(fileContent, {
      delimiter: ',',
      columns: true,
      trim: true
    }, (err, records) => {
      if (err) {
        console.error("Erro ao parsear o arquivo CSV:", err);
        event.reply('device-data-response', { error: "Falha ao parsear os dispositivos" });
      } else {
        console.log("Dispositivos carregados com sucesso:", records);
        event.reply('device-data-response', { devices: records });
      }
    });
  });
});

ipcMain.on('setParameters', async (event, parameters) => {
  const { devices, gwPos } = parameters;

  console.log(parameters);
  console.log('opt: ', gwPos);
  console.log('devices: ', devices);

  event.reply('setParameters', 'ok');
  const csvFilePath = await saveDevicesToCSV(devices);

  try {
    // Primeira execução: plotagem de dispositivos
    console.log("Iniciando a plotagem dos dispositivos...");
    const plotResult = await execAsync(`python3 src/main/scripts/positionDevicesGraph.py ${csvFilePath}`);
    console.log(plotResult.stdout);
    event.reply('graphDone', 'ok');

    // Configuração dos gateways baseada em 'gwPos'
    let cmd = '';
    console.log("Antes de exec o python de otimização");

    switch (gwPos) {
      case 'kmeans':
        cmd = `python3 src/main/scripts/kmeans.py ${csvFilePath}`;
        break;
      // Adicione mais casos conforme necessário
      default:
        console.log("No valid gwPos provided.");
        break;
    }

    if (cmd) {
      console.log("Iniciando a otimização de gateways...");
      const optimizationResult = await execAsync(cmd);
      console.log(optimizationResult.stdout);
    }

    // Execução final: cenário
    console.log("Iniciando o script de cenário...");
    const scenarioResult = await execAsync("python3 src/main/scripts/scenario.py");
    console.log(scenarioResult.stdout);

  } catch (error) {
    console.error('Execução falhou:', error);
    event.reply('error', error);
  }
});