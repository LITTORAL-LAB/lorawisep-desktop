import { useEffect, useState } from 'react'
import icon from '@/assets/icon.png'
import resultIcon from '../../../../main/scripts/img/complete-positions.png'
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
  const [gateways, setGateways] = useState<any[]>()
  const [simulationResults, setSimulationResults] = useState<any>({
    avg_delay: 0,
    avg_dist: 0,
    avg_rssi: 0,
    avg_snr: 0
  })

  useEffect(() => {
    const handleResult = (data: any) => {
      console.log('Evento simulation-complete recebido:', data)
      setSimulationResults(data) // Armazena os resultados no estado
    }

    window.electron.onSimulationComplete(handleResult)

    return () => {
      // Limpa o ouvinte para evitar vazamentos de memória
      window.electron.onSimulationComplete(handleResult)
    }
  }, [result])

  useEffect(() => {
    async function fetchGateways() {
      if (result) {
        try {
          const data = await window.electron.getGateways()
          setGateways(data)
          console.log('Gateways atualizados após simulação:', data)
          setResult(false)
        } catch (error) {
          console.error('Erro ao carregar os gateways após a simulação:', error)
        }
      }
    }
    fetchGateways()
  }, [result])

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
                  setGateways([])
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
                setTimeout(async () => {
                  try {
                    const data = await window.electron.getGateways()
                    setGateways(data) // Atualiza os gateways com os novos dados
                    console.log('Gateways atualizados após simulação:', data)
                  } catch (error) {
                    console.error('Erro ao carregar os gateways após a simulação:', error)
                  }
                }, 2000) // Ajuste o tempo de atraso conforme necessário
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
