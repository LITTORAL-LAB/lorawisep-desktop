import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '../ui/input'
import { useTranslation } from 'react-i18next'

export function SimParamsForm() {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        name="simTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationTime')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('simulationTimePlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('simulationTimeDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="simPacketNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('numberOfPackets')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('numberOfPacketsPlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('numberOfPacketsDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simPropLoss"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('propagationLossModel')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('propagationLossModelPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="1" value="ns3">
                    Propagation Loss Model (NS-3)
                  </SelectItem>
                  <SelectItem key="2" value="okomura">
                    Okumura Hata Model
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>{t('propagationLossModelDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
