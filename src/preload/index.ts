import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

interface SimulationParameters {
  name: string
  device: string
  environment: string
  width: string
  heigth: string
  qtdGateways: string
  algorithmOptimization: string
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      setParameters: (parameters: SimulationParameters) =>
        ipcRenderer.send('setParameters', parameters),
      generateGraph: () => ipcRenderer.send('generateGraph'),
      graphDone: (callback: () => void) => ipcRenderer.on('graphDone', callback),
      loadDevices: () => ipcRenderer.send('loadDevices'),
      getGateways: () => ipcRenderer.invoke('get-gateways'),
      onSimulationComplete: (callback: (data: any) => void) =>
        ipcRenderer.on('simulation-complete', (_, data) => callback(data))
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
