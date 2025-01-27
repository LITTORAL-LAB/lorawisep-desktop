// import { ElectronAPI } from '@electron-toolkit/preload'

import { ICoords } from '@renderer/types'

export interface ElectronAPI {
  getGateways: () => Promise<any[]>
  setParameters: (values: SimulationParameters) => Promise<void>
  // generateGraph: () => Promise<void>
  handleResult: () => Promise<void>
  generateGraph: (parameters: SimulationParameters) => Promise<void>
  loadDevices: () => Promise<void>
  onSimulationComplete: (callback: (data: any) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
