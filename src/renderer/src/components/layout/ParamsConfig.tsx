// import { ProjectConfigForm } from "@/components/forms/ProjectConfigForm"
import { Form } from '@/components/forms'
// import { EnvironmentForm } from "@/components/modal/environmentForm"
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
import { useState } from 'react'
import { toast } from '../ui/use-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { CodeViewer } from '../cards/ResultsCard'
import { ICoords } from '@/types'

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

export function ParamsConfig({ setAreaValues, devices, onSimulate }: IParamsConfigProps): JSX.Element {
  const [openEnvConfig, setOpenEnvConfig] = useState(false)
  const [openResults, setOpenResults] = useState(false)

  const methods = useForm<FormValues>({
    defaultValues: {
      simName: 'testeSimulacao',
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
      // Gera coordenadas aleatórias dentro dos limites especificados
      const x = Math.random() * width
      const y = Math.random() * height

      devices.push({ lat: x, lng: y })
    }
    return devices
  }

  const onSubmit = (values: FormValues): void => {
    if (!values.simName || !values.simEnv || !values.gwQuant || !values.gwPos) {
      toast({
        title: 'O formulário não foi preenchido corretamente',
        description:
          'Preencha os campos obrigatórios (Nome da Simulação, Ambiente da Simulação e Algoritmos de Otimização)',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Formulário submetido',
        description: 'Confira o console para os valores do formulário.'
      })

      methods.setValue('devices', devices)
      methods.setValue('map', true)

      if (setAreaValues) {
        toast({
          title: 'Distribuindo dispositivos aleatoriamente...',
          description: 'Aguarde um momento.'
        })
        if (values.simWidth && values.simHeight && values.devicesQt) {
          const devices = distributeDevicesRandomly(
            Number(values.devicesQt),
            Number(values.simWidth),
            Number(values.simHeight)
          )
          methods.setValue('devices', devices)
          methods.setValue('map', false)
          // console.log(devices);
          toast({
            title: 'Dispositivos distribuídos com sucesso!',
            description: 'Confira o console para os valores dos dispositivos.'
          })
        } else {
          toast({
            title: 'Erro ao distribuir dispositivos aleatoriamente.',
            description:
              'Verifique se os campos de largura, altura e quantidade de dispositivos estão preenchidos.',
            variant: 'destructive'
          })
          return
        }
      }
      setOpenResults(true)
      // Limpar apenas os campos específicos
      // methods.resetField('simName');
      // methods.resetField('simEnv');
      // methods.resetField('gwQuant');
      // methods.resetField('gwPos');

    }
    console.log(methods.getValues())

    window.electron.setParameters(methods.getValues())

    onSimulate()
  }

  return (
    <div className="px-10">
      <CodeViewer open={openResults} setOpen={setOpenResults} />
      <h2 className="text-3xl font-bold tracking-tight">Parâmetros da Simulação</h2>
      <p className="text-lg text-gray-500">Configure os parâmetros da simulação.</p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Accordion type="single" collapsible className="mt-10 w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Project Configuration</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  Nesta aba você pode configurar o ambiente da simulação. Como o nome da simulação,
                  a descrição, o tipo, o ambiente, a quantidade de dispositivos, a largura e a
                  altura.
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      <div
                        role="button"
                        tabIndex={0}
                        className="font-medium	 p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        Open to Configure
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle> Project Configuration </SheetTitle>
                        <SheetDescription>
                          Here you can configure the project settings.
                        </SheetDescription>
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
              <AccordionTrigger>Configure os parâmetros</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  Nesta aba você pode configurar os parâmetros da simulação. Como a quantidade de
                  pacotes por segundo, o tempo de simulação, modelo de propagação, etc.
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      {/* <Button variant={"default"} className="w-full bg-cyan-800">Open to Configure</Button> */}
                      <div
                        role="button"
                        tabIndex={0}
                        className="font-medium	 p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        Open to Configure
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle> Project Configuration </SheetTitle>
                        <SheetDescription>
                          Here you can configure the project settings.
                        </SheetDescription>
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
              <AccordionTrigger>Selecione os algoritmos de otimização</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-rows-2 text-justify">
                  Nesta aba você pode configurar os parâmetros da simulação. Como a quantidade de
                  pacotes por segundo, o tempo de simulação, modelo de propagação, etc.
                  <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                    <SheetTrigger>
                      {/* <Button variant={"default"} className="w-full bg-cyan-800">Open to Configure</Button> */}
                      <div
                        role="button"
                        tabIndex={0}
                        className="font-medium	 p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                        onClick={() => setOpenEnvConfig(true)}
                      >
                        Open to Configure
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle> Project Configuration </SheetTitle>
                        <SheetDescription>
                          Here you can configure the project settings.
                        </SheetDescription>
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
                <AccordionTrigger>Set Area Values</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-rows-2 text-justify">
                    Nesta aba você pode configurar os parâmetros da simulação. Como a quantidade de
                    pacotes por segundo, o tempo de simulação, modelo de propagação, etc.
                    <Sheet open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
                      <SheetTrigger>
                        {/* <Button variant={"default"} className="w-full bg-cyan-800">Open to Configure</Button> */}
                        <div
                          role="button"
                          tabIndex={0}
                          className="font-medium	 p-2.5 rounded bg-cyan-800 hover:bg-cyan-950 w-full cursor-pointer text-white"
                          onClick={() => setOpenEnvConfig(true)}
                        >
                          Open to Configure
                        </div>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle> Project Configuration </SheetTitle>
                          <SheetDescription>
                            Here you can configure the project settings.
                          </SheetDescription>
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

          {/* <Button className="mt-10 w-full" type="submit" disabled={(devices.length <= 0)}> */}
          <Button
            className="mt-10 w-full"
            type="submit"
            disabled={setAreaValues ? false : devices.length <= 0 ? true : false}
          >
            Simular
          </Button>

          <Button className="mt-2 w-full" variant="outline">
            Limpar
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
