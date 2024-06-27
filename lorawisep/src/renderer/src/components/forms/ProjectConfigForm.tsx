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

export function ProjectConfigForm() {
  return (
    <>
      <FormField
        name="simName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the simulation name"
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>
              Enter a unique name for your simulation to identify it easily in future references.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write a brief description of the simulation"
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>
              Provide a short description of what your simulation will analyze.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simEnv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Scenario</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the scenario type to be simulated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Different settings can significantly affect results and model behavior.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
