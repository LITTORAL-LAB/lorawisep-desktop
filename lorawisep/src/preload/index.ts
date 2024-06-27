import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface SimulationParameters {
  name: string
  device: string
  environment: string
  width: string
  heigth: string
  qtdGateways: string
  algorithmOptimization: string
}

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      setParameters: (parameters: SimulationParameters) =>
        ipcRenderer.send('setParameters', parameters),
      // generateGraph: (parameters) => ipcRenderer.send('generateGraph', parameters),
      handleResult: (callback) => ipcRenderer.on('graphDone', callback),
      generateGraph: (parameters: SimulationParameters) =>
        ipcRenderer.invoke('generateGraph', parameters)
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
