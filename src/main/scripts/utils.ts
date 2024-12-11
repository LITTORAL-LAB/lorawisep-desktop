const { writeFile, mkdir } = require('fs').promises
const { join } = require('path')

// Função para converter os dispositivos em formato CSV
export function devicesToCSV(devices) {
  const headers = 'lat,lng'
  const rows = devices.map((device) => `${device.lat},${device.lng}`)
  return [headers, ...rows].join('\n')
}

// Função para salvar os dispositivos em um arquivo CSV no diretório do projeto
export async function saveDevicesToCSV(devices) {
  try {
    const csvData = devicesToCSV(devices)
    const projectDir = 'src/main/scripts' // Obtém o diretório onde o script está localizado
    const dataDir = join(projectDir) // Pasta 'data' dentro do diretório do projeto
    const filePath = join(dataDir, 'devices.csv') // Caminho completo do arquivo CSV

    // Certificar-se de que o diretório 'data' existe
    await mkdir(dataDir, { recursive: true })

    // Escrevendo dados no arquivo CSV
    await writeFile(filePath, csvData, 'utf8')
    return filePath
  } catch (error) {
    console.error('Failed to save CSV:', error)
    throw error // Re-throw the error to be handled by the caller
  }
}
