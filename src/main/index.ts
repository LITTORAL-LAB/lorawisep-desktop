import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { saveDevicesToCSV } from './scripts/utils'
import Papa from 'papaparse'

const { promisify } = require('util')
const execAsync = promisify(require('child_process').exec)
const fs = require('fs')
const parse = require('csv-parse')
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('loadDevices', async (event) => {
  const csvFilePath = 'src/main/scripts/devices.csv'
  fs.readFile(csvFilePath, (err, fileContent) => {
    if (err) {
      console.error('Erro ao ler o arquivo CSV:', err)
      event.reply('device-data-response', { error: 'Falha ao carregar os dispositivos' })
      return
    }
    parse(
      fileContent,
      {
        delimiter: ',',
        columns: true,
        trim: true
      },
      (err, records) => {
        if (err) {
          console.error('Erro ao parsear o arquivo CSV:', err)
          event.reply('device-data-response', { error: 'Falha ao parsear os dispositivos' })
        } else {
          console.log('Dispositivos carregados com sucesso:', records)
          event.reply('device-data-response', { devices: records })
        }
      }
    )
  })
})

const loadGatewaysFromCSV = () => {
  const csvPath = path.join('src/main/scripts/gateways.csv')
  console.log('csvPath: ', csvPath)

  if (fs.existsSync(csvPath)) {
    const fileContent = fs.readFileSync(csvPath, 'utf-8')
    const parsedData = Papa.parse(fileContent, {
      header: false, // O CSV não tem cabeçalho
      skipEmptyLines: true // Ignora linhas vazias
    })

    // Transformar os dados no formato { lat, lng }
    const gateways = parsedData.data.map((row) => {
      const [lat, lng] = row // Divide a linha em latitude e longitude
      return {
        lat: parseFloat(lat), // Converte para número
        lng: parseFloat(lng)
      }
    })

    console.log('Gateways carregados:', gateways)
    return gateways
  } else {
    console.warn('Arquivo gateways.csv não encontrado: ' + csvPath)
    return []
  }
}

ipcMain.handle('get-gateways', () => {
  return loadGatewaysFromCSV()
})

ipcMain.on('setParameters', async (event, parameters) => {
  const { devices, gwPos } = parameters

  console.log(parameters)
  console.log('opt: ', gwPos)
  console.log('devices: ', devices)

  event.reply('setParameters', 'ok')
  const csvFilePath = await saveDevicesToCSV(devices)

  try {
    let pythonPath = ''
    if (process.platform === 'win32') {
      pythonPath = path.join('.venv', 'Scripts', 'python.exe') // Caminho para Windows
    } else {
      pythonPath = path.join('.venv', 'bin', 'python3') // Caminho para Linux
    }

    // Validando se o executável do Python existe
    const fs = require('fs')
    if (!fs.existsSync(pythonPath)) {
      console.error('Python não encontrado no caminho:', pythonPath)
      return
    }

    // Primeira execução: plotagem de dispositivos
    console.log('Iniciando a plotagem dos dispositivos...')
    const plotResult = await execAsync(
      `${pythonPath} src/main/scripts/positionDevicesGraph.py ${csvFilePath}`
    )
    console.log(plotResult.stdout)
    event.reply('graphDone', 'ok')

    // Configuração dos gateways baseada em 'gwPos'Ppy
    let cmd = ''
    console.log('Antes de exec o python de otimização')

    if (gwPos === 'kmeans') {
      cmd = `${pythonPath} src/main/scripts/kmeans.py ${csvFilePath}`
    } else {
      console.log('No valid gwPos provided.')
    }

    if (cmd) {
      console.log('Iniciando a otimização de gateways...')
      const optimizationResult = await execAsync(cmd)
      console.log(optimizationResult.stdout)

      // **Aqui os gateways são carregados após a otimização**
      console.log('Carregando gateways otimizados...')
      const gateways = loadGatewaysFromCSV()
      console.log('Gateways otimizados carregados:', gateways)

      // Opcional: enviar os gateways para o frontend
      event.reply('gateways-updated', gateways)
    }

    // Execução final: cenário
    console.log('Iniciando o script de cenário...')
    const scenarioResult = await execAsync(`${pythonPath} src/main/scripts/scenario.py`)
    console.log(scenarioResult.stdout)

    const ns3Path = import.meta.env.VITE_PATH_TO_NS3

    if (!ns3Path) {
      console.error('Caminho para o NS3 não encontrado. Configure a variável PATH_TO_NS3.')
      event.reply('error', 'NS3 path not found in PATH_TO_NS3 environment variable')
      return
    }

    const pathToRoot = import.meta.env.VITE_PATH_TO_ROOT
    const outputFolder = path.resolve(pathToRoot, 'src/main/scripts/output')
    const pathToEndDevicesFile = path.resolve(pathToRoot, 'src/main/scripts/devices.csv')
    const pathToGatewaysFile = path.resolve(pathToRoot, 'src/main/scripts/gateways.csv')

    try {
      // const ns3Result = await execAsync(`./ns3 run scratch/scratch-simulator.cc`, { cwd: ns3Path })
      const ns3Result = await execAsync(
        `./ns3 run "scratch/scratch-simulator.cc --file_endevices=${pathToEndDevicesFile} --file_gateways=${pathToGatewaysFile} --out_folder=${outputFolder}"`,
        { cwd: ns3Path }
      )
      console.log(ns3Result)
      console.log(ns3Result.stdout)
    } catch (error) {
      console.error('Erro ao executar o NS-3:', error)
      event.reply('error', error)
    }

    console.log('Iniciando o script de análise...')
    const analysisResult = await execAsync(`${pythonPath} src/main/scripts/analyze_results.py`)

    // Parseia os resultados do JSON retornado pelo script
    const analysisData = JSON.parse(analysisResult.stdout)

    console.log('Resultados da análise:', analysisData)

    // Envia os resultados ao frontend
    event.reply('simulation-complete', analysisData)
  } catch (error) {
    console.error('Execução falhou:', error)
    event.reply('error', error)
  }

  event.reply('done', 'ok')
})
