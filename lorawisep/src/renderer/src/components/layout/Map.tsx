// MainLayout.tsx
import { useState, useEffect } from 'react'
import iconB from '@/assets/iot_device-black.png'
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import L from 'leaflet'
import { Trash2, SaveAll, Search, Expand } from 'lucide-react'
import './style.css'
import { SetViewOnClick, AreaSelector, orderCoordinates, addDevicesInArea } from './utils'
import { ICoords } from '@/types'
import { toast } from '../ui/use-toast'

interface IMapLayoutProps {
  setFullScreen: (fullScreen: boolean) => void
  fullScreen: boolean
  onSave?: (devices: ICoords[]) => void
  onDelete?: () => void
}
export const MapLayout = ({ setFullScreen, fullScreen, onSave, onDelete }: IMapLayoutProps) => {
  const [, setCurrentPosition] = useState<[number, number]>() // Coordenadas padrão
  const [center, setCenter] = useState<ICoords>({
    lat: -5.0589993793432955,
    lng: -42.80016879851992
  })
  // {lat: -5.0589993793432955, lng: -42.80016879851992}
  const [locationInput, setLocationInput] = useState('')
  const [devices, setDevices] = useState<ICoords[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [area, setArea] = useState<ICoords[]>([])
  const [devicesCount, setDevicesCount] = useState('0')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude])
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        (error) => {
          console.error('Error fetching location', error)
        }
      )
    }
  }, [])

  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`
    )
    const data = await response.json()
    if (data[0]) {
      const newCenter = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      setCenter(newCenter)
      alert(newCenter.lat + ' ' + newCenter.lng)
    } else {
      alert('Location not found')
    }
  }

  const MapEffect = () => {
    const map = useMap() // useMap agora está sendo chamado dentro de um componente filho de MapContainer

    useEffect(() => {
      if (fullScreen) {
        map.invalidateSize()
      }
    }, [fullScreen, map])

    return null // Esse componente não renderiza nada visível
  }

  return (
    <>
      <div className="flex space-x-2 mb-2">
        <Input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Search for locations"
        />
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={handleSearch}
        >
          <Search size={18} />
        </Button>
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() => setSelectMode(!selectMode)}
        >
          {selectMode ? 'Stop Selecting' : 'Select Area'}
        </Button>
        <Input
          type="number"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={devicesCount}
          onChange={(e) => setDevicesCount(e.target.value)}
          placeholder="Number of devices"
        />
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() => addDevicesInArea(area, setDevices, Number(devicesCount))}
        >
          Add Devices
        </Button>
        <Button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-900"
          onClick={() => {
            toast({
              className: 'bg-green-700 text-white',
              description: (
                <div className="">
                  <p>Devices saved successfully</p>
                  <p>{devices.length} devices saved</p>
                </div>
              ),
              title: 'Success'
            })
            onSave && onSave(devices)
          }}
        >
          <SaveAll size={18} />
        </Button>
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() => setFullScreen(!fullScreen)}
        >
          <Expand size={18} />
        </Button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '75vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SetViewOnClick coords={center} />
        <AreaSelector active={selectMode} setArea={setArea} />
        {devices.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newDevices: ICoords[] = [...devices]
                newDevices[index] = e.target.getLatLng()
                setDevices(newDevices)
              }
            }}
            icon={
              new L.Icon({
                iconUrl: iconB,
                iconSize: [22, 22],
                className: 'text-red-800'
              })
            }
          >
            <Popup>Device {index + 1}</Popup>
          </Marker>
        ))}
        {area.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newArea: ICoords[] = [...area]
                newArea[index] = e.target.getLatLng()
                setArea(newArea)
              }
            }}
          >
            <Popup>Device {index + 1}</Popup>
          </Marker>
        ))}
        {area.length > 2 && <Polygon positions={orderCoordinates({ points: area })} />}
        {/* <Marker position={currentPosition}>
                                    <Popup>You are here!</Popup>
                                </Marker> */}
        {fullScreen && <MapEffect />}
      </MapContainer>

      <div className="flex space-x-2 mt-2">
        <Button
          className="px-4 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-900"
          onClick={() => {
            setDevices([])
            onDelete && onDelete()
          }}
        >
          <Trash2 size={18} className="mr-2" />
          Devices
        </Button>
        <Button
          className="px-4 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-900 flex items-center"
          onClick={() => setArea([])}
        >
          <Trash2 size={18} className="mr-2" />
          Area
        </Button>
      </div>
    </>
  )
}
