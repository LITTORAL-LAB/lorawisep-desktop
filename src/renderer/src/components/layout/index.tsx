import { useState } from 'react'
import icon from '@/assets/icon.png'
import resultIcon from '../../../../main/scripts/img/devices.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button' // Usando botão do shadcn
import 'leaflet/dist/leaflet.css'
import './style.css'
import { ParamsConfig } from './ParamsConfig'
import { MapLayout } from './Map'
import { ICoords } from '@/types'
import { useTranslation } from 'react-i18next'

export function MainLayout(): JSX.Element {
  const { t, i18n } = useTranslation()
  const [fullScreen, setFullScreen] = useState(false)
  const [activeTab, setActiveTab] = useState('view')
  const [devices, setDevices] = useState<ICoords[]>()
  const [result, setResult] = useState<boolean>(false)
  const [gateways] = useState<ICoords[]>()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
        <h1 className="text-lg font-semibold">{t('LoRaWISEP')}</h1>
        <div className="flex gap-2">
          <Button
            variant={i18n.language === 'en' ? 'default' : 'outline'}
            onClick={() => changeLanguage('en')}
          >
            English
          </Button>
          <Button
            variant={i18n.language === 'pt' ? 'default' : 'outline'}
            onClick={() => changeLanguage('pt')}
          >
            Português
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 space-y pt-6 flex flex-row">
        <div className={fullScreen ? 'w-full mx-10' : 'basis-2/3 ml-4'}>
          <Tabs defaultValue="view" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="view">{t('graphs')}</TabsTrigger>
              <TabsTrigger value="map">{t('map')}</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <div className="w-2/3">
                <img src={result ? resultIcon : icon} alt="placeholder" />
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
                gateways={gateways}
              />
            </TabsContent>
          </Tabs>
        </div>
        {!fullScreen && (
          <div className="basis-1/3">
            <ParamsConfig
              setAreaValues={activeTab !== 'map'}
              devices={devices ?? []}
              onSimulate={() => {
                setResult(true)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
