import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { Loader2 } from 'lucide-react' // Ícone de carregamento

interface ICodeViewerProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CodeViewer({ open, setOpen }: Readonly<ICodeViewerProps>) {
  const { t } = useTranslation()
  const [simulationResults, setSimulationResults] = useState<any>({
    avg_delay: 0,
    avg_dist: 0,
    avg_rssi: 0,
    avg_snr: 0
  })
  const [isLoading, setIsLoading] = useState(true) // Estado de carregamento

  useEffect(() => {
    const handleResult = (data: any) => {
      console.log(t('simulationCompleteEventReceived'), data)
      setSimulationResults(data)
      setIsLoading(false) // Finaliza o carregamento
    }

    const handleLoading = () => {
      setIsLoading(true) // Inicia o carregamento
    }

    window.electron.onSimulationComplete(handleResult)
    handleLoading()
  }, [open, t])

  const exportResults = () => {
    const csvContent = `${t('parameter')},${t('value')}\n
    ${t('averageDelay')},${simulationResults.avg_delay}\n
    ${t('averageDistance')},${simulationResults.avg_dist}\n
    ${t('averageRSSI')},${simulationResults.avg_rssi}\n
    ${t('averageSNR')},${simulationResults.avg_snr}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, t('simulationResultsFileName'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="bg-transparent border-none p-0 m-0"
        ></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {t('simulationResultsTitle')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t('simulationResultsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="ml-4 text-lg text-gray-600">{t('loadingMessage')}</p>
            </div>
          ) : (
            <>
              <div className="rounded-md bg-gray-900 p-4 shadow-inner">
                <pre className="overflow-x-auto">
                  <code className="text-sm text-white">
                    <span>
                      <span className="text-sky-400">{t('averageDelay')}:</span>{' '}
                      <span className="text-amber-400">
                        {simulationResults.avg_delay.toFixed(2)}
                      </span>
                    </span>
                    <br />
                    <span>
                      <span className="text-sky-400">{t('averageDistance')}:</span>{' '}
                      <span className="text-amber-400">
                        {simulationResults.avg_dist.toFixed(2)}
                      </span>
                    </span>
                    <br />
                    <span>
                      <span className="text-sky-400">{t('averageRSSI')}:</span>{' '}
                      <span className="text-green-400">
                        {simulationResults.avg_rssi.toFixed(2)}
                      </span>
                    </span>
                    <br />
                    <span>
                      <span className="text-sky-400">{t('averageSNR')}:</span>{' '}
                      <span className="text-amber-400">{simulationResults.avg_snr.toFixed(2)}</span>
                    </span>
                  </code>
                </pre>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('exportInstructions')}</p>
                <Button
                  onClick={exportResults}
                  variant="default"
                  className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {t('exportResultsButton')}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
