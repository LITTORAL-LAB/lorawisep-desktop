import { useTranslation } from 'react-i18next'
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

export function OptmAlgorithmsForm() {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        name="gwQuant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('gatewayQuantityAlgorithm')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectAlgorithm')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elbow">Elbow Method</SelectItem>
                  <SelectItem value="gap">Gap-Statistic Method</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>{t('gatewayQuantityAlgorithmDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="gwPos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('gatewayPositioningAlgorithm')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectAlgorithm')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kmeans">K-Means Approach</SelectItem>
                  <SelectItem value="genetic">Genetic Algorithm Approach</SelectItem>
                  <SelectItem value="pso">Particle Swarm Optimization (PSO) Approach</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>{t('gatewayPositioningAlgorithmDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
