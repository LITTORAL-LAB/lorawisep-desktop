// import { ElectronAPI } from '@electron-toolkit/preload'

export interface ElectronAPI {
  setParameters: (values: SimulationParameters) => Promise<void>
  // generateGraph: () => Promise<void>
  handleResult: () => Promise<void>
  generateGraph: (parameters: SimulationParameters) => Promise<void>
  loadDevices: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
