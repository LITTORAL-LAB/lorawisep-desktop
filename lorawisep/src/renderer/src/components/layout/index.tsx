// MainLayout.tsx
import { useState } from 'react'
import icon from '@/assets/icon.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import 'leaflet/dist/leaflet.css'
import './style.css'
import { ParamsConfig } from './ParamsConfig'
import { MapLayout } from './Map'
import { ICoords } from '@/types'

export function MainLayout(): JSX.Element {
  const [fullScreen, setFullScreen] = useState(false)
  const [activeTab, setActiveTab] = useState('view')
  const [devices, setDevices] = useState<ICoords[]>()

  return (
    <div>
      <div className="flex-1 space-y pt-6 flex flex-row">
        <div className={fullScreen ? 'w-full mx-10' : 'basis-2/3 ml-4'}>
          <Tabs defaultValue="view" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="view">Gráficos</TabsTrigger>
              <TabsTrigger value="map">Mapa</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <div className="w-2/3">
                <img src={icon} alt="placeholder" />
              </div>
            </TabsContent>
            <TabsContent value="map">
              <MapLayout
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
                onSave={(devices) => {
                  setDevices(devices)
                }}
                onDelete={() => {
                  setDevices([])
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
        {!fullScreen && (
          <div className="basis-1/3">
            <ParamsConfig
              setAreaValues={activeTab == 'map' ? false : true}
              devices={devices ?? []}
            />
          </div>
        )}
      </div>
    </div>
  )
}
