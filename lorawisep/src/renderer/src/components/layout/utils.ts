import { useMap, useMapEvents } from 'react-leaflet'
import * as turf from '@turf/turf'
import { ICoords } from '@/types'
import { SetStateAction } from 'react'

export function SetViewOnClick({ coords }: { coords: ICoords }) {
  const map = useMap()
  map.flyTo(coords)

  return null
}

export function AreaSelector({ active, setArea }: { active: boolean; setArea: Function }) {
  useMapEvents({
    click: (e) => {
      if (active) {
        const newArea = e.latlng
        setArea((area: any) => [...area, newArea])
      }
    }
  })

  return null
}

export function DevicesSelector({ active, setDevices }: { active: boolean; setDevices: Function }) {
  useMapEvents({
    click: (e) => {
      if (active) {
        const newDevice = e.latlng
        setDevices((devices: any) => [...devices, newDevice])
      }
    }
  })

  return null
}

export function orderCoordinates({ points }: { points: ICoords[] }) {
  // Calcular o centroide
  let centroid = points
    .reduce(
      (acc, point) => {
        return [acc[0] + point.lng, acc[1] + point.lat]
      },
      [0, 0]
    )
    .map((coord) => coord / points.length)

  // Ordenar os pontos pelo ângulo em relação ao centroide
  return points.sort((a, b) => {
    return (
      Math.atan2(a.lat - centroid[1], a.lng - centroid[0]) -
      Math.atan2(b.lat - centroid[1], b.lng - centroid[0])
    )
  })
}

export function generateRandomPointInPolygon(polygon: any) {
  const bounds = turf.bbox(polygon)
  let point
  let attempts = 0

  do {
    const randomLat = bounds[1] + Math.random() * (bounds[3] - bounds[1])
    const randomLng = bounds[0] + Math.random() * (bounds[2] - bounds[0])
    point = turf.point([randomLng, randomLat])
    attempts++
  } while (!turf.booleanPointInPolygon(point, polygon) && attempts < 100)

  return point.geometry.coordinates
}

export function addDevicesInArea(
  area: string | any[],
  setDevices: { (value: SetStateAction<ICoords[]>): void; (arg0: (devices: any) => any[]): void },
  count: number
) {
  if (area.length < 3) {
    alert('A área deve ter pelo menos 3 pontos.')
    return
  }

  // Fecha o polígono adicionando o primeiro ponto no final
  const closedArea = [...area, area[0]]
  const polygon = turf.polygon([closedArea.map((point) => [point.lng, point.lat])])
  const newDevices: { lat: number; lng: number }[] = []

  for (let i = 0; i < count; i++) {
    const randomPoint = generateRandomPointInPolygon(polygon)
    newDevices.push({ lat: randomPoint[1], lng: randomPoint[0] })
  }

  setDevices((devices) => [...devices, ...newDevices])
}

export function distributeDevicesRandomly(n: number, width: number, height: number): ICoords[] {
  const devices: ICoords[] = []

  for (let i = 0; i < n; i++) {
    // Gera coordenadas aleatórias dentro dos limites especificados
    const x = Math.random() * width
    const y = Math.random() * height

    devices.push({ lat: x, lng: y })
  }

  return devices
}
