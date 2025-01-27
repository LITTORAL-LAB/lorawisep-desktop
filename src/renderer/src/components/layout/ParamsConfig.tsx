import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { toast } from '../ui/use-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { CodeViewer } from '../cards/ResultsCard'
import { ICoords } from '@/types'
import { useTranslation } from 'react-i18next'
import { Form } from '@/components/forms'

interface IParamsConfigProps {
  setAreaValues: boolean
  devices: ICoords[]
  onSimulate: () => void
}

type FormValues = {
  simName?: string
  simDescription?: string
  simEnv?: string
  simTime?: string
  simPacketNumber?: string
  simPropLoss?: string
  gwQuant?: string
  gwPos?: string
  simWidth?: string
  simHeight?: string
  devicesQt?: string
  devices?: ICoords[]
  map: boolean
}

export function ParamsConfig({
  setAreaValues,
  devices,
  onSimulate
}: IParamsConfigProps): JSX.Element {
  const { t } = useTranslation()
  const [openEnvConfig, setOpenEnvConfig] = useState(false)
  const [openResults, setOpenResults] = useState(false)

  let isDisabled = false
  if (!setAreaValues) {
    isDisabled = devices.length <= 0
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      simName: t('defaultSimName') || 'SimulacaoTeste',
      simEnv: 'rural',
      simDescription: '',
      simTime: '3600',
      simPacketNumber: '3600',
      simPropLoss: 'ns3',
      simWidth: '1000',
      simHeight: '1000',
      devicesQt: '10',
      gwPos: 'kmeans',
      gwQuant: 'gap',
      devices: devices,
      map: false
    }
  })

  function distributeDevicesRandomly(n: number, width: number, height: number): ICoords[] {
    const devices: ICoords[] = []

    for (let i = 0; i < n; i++) {
      const x = Math.random() * width
      const y = Math.random() * height

      devices.push({ lat: x, lng: y })
    }
    return devices
  }

  const onSubmit = (values: FormValues): void => {
    if (!values.simName || !values.simEnv || !values.gwQuant || !values.gwPos) {
      toast({
        title: t('formErrorTitle'),
        description: t('formErrorDescription'),
        variant: 'destructive'
      })
    } else {
      toast({
        title: t('formSubmitted'),
        description: t('checkConsoleForDetails')
      })

      methods.setValue('devices', devices)
      methods.setValue('map', true)

      if (setAreaValues) {
        toast({
          title: t('distributingDevices'),
          description: t('pleaseWait')
        })
        if (values.simWidth && values.simHeight && values.devicesQt) {
          const devices = distributeDevicesRandomly(
            Number(values.devicesQt),
            Number(values.simWidth),
            Number(values.simHeight)
          )
          methods.setValue('devices', devices)
          methods.setValue('map', false)

          toast({
            title: t('devicesDistributed'),
            description: t('checkConsoleForDevices')
          })
        } else {
          toast({
            title: t('deviceDistributionError'),
            description: t('fillWidthHeightAndDeviceCount'),
            variant: 'destructive'
          })
          return
        }
      }

      console.log(methods.getValues())

      window.electron.setParameters(methods.getValues())

      setOpenResults(true)

      onSimulate()
    }
  }

  return (
    <div className="px-10">
      <CodeViewer open={openResults} setOpen={setOpenResults} />
      <h2 className="text-3xl font-bold tracking-tight">{t('simulationParamsTitle')}</h2>
      <p className="text-lg text-gray-500">{t('simulationParamsDescription')}</p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Accordion type="single" collapsible className="mt-10 w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('projectConfiguration')}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  {t('projectConfigurationDescription')}
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      <button
                        type="button"
                        className="font-medium p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        {t('openToConfigure')}
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t('projectConfigTitle')}</SheetTitle>
                        <SheetDescription>{t('projectConfigDescription')}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-10">
                        <Form.ProjectConfigForm />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>{t('simulationParams')}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  {t('simulationParamsDescription')}
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      <button
                        type="button"
                        className="font-medium p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        {t('openToConfigure')}
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t('simulationConfigTitle')}</SheetTitle>
                        <SheetDescription>{t('simulationConfigDescription')}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-10">
                        <Form.SimParamsForm />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>{t('optimizationAlgorithms')}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  {t('optimizationAlgorithmsDescription')}
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      <button
                        type="button"
                        className="font-medium p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        {t('openToConfigure')}
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t('optimizationConfigTitle')}</SheetTitle>
                        <SheetDescription>{t('optimizationConfigDescription')}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-10">
                        <Form.OptmAlgorithmsForm />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </AccordionContent>
            </AccordionItem>

            {setAreaValues && (
              <AccordionItem value="item-4">
                <AccordionTrigger>{t('setAreaValues')}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-rows-2 text-justify">
                    {t('setAreaValuesDescription')}
                    <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                      <SheetTrigger>
                        <button
                          type="button"
                          className="font-medium p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                          onClick={() => setOpenEnvConfig(true)}
                        >
                          {t('openToConfigure')}
                        </button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>{t('areaConfigTitle')}</SheetTitle>
                          <SheetDescription>{t('areaConfigDescription')}</SheetDescription>
                        </SheetHeader>
                        <div className="mt-10">
                          <Form.SetAreaParamsForm />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          <Button className="mt-10 w-full" type="submit" disabled={isDisabled}>
            {t('simulate')}
          </Button>

          <Button className="mt-2 w-full" variant="outline">
            {t('clear')}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
