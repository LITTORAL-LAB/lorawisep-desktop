import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

export function SetAreaParamsForm() {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        name="simWidth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationWidth')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('simulationWidthPlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('simulationWidthDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="simHeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationHeight')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('simulationHeightPlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('simulationHeightDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="devicesQt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('devicesQuantity')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('devicesQuantityPlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('devicesQuantityDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
