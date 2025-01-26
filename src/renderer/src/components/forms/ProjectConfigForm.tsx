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
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import { useTranslation } from 'react-i18next'

export function ProjectConfigForm() {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        name="simName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationName')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('simulationNamePlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('simulationNameDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationDescription')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('simulationDescriptionPlaceholder')}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>{t('simulationDescriptionDetails')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simEnv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('simulationScenario')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('simulationScenarioPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>{t('simulationScenarioDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
