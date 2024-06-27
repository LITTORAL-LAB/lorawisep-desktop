import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function SetAreaParamsForm() {

  return (
    <>
      <FormField
        name="simWidth"  // Assuming the name relates to a width parameter in your simulation
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Width</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter the width parameter in meters" onChange={field.onChange} defaultValue={field.value} />
            </FormControl>
            <FormDescription>
              Specify the width parameter for the simulation area in meters. This determines the horizontal scale.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="simHeight"  // Assuming the name relates to a height parameter in your simulation
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Height</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter the height parameter in meters" onChange={field.onChange} defaultValue={field.value} />
            </FormControl>
            <FormDescription>
              Specify the height parameter for the simulation area or component in meters. This determines the vertical scale.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="devicesQt"  // Assuming the name relates to a height parameter in your simulation
        render={({ field }) => (
          <FormItem>
            <FormLabel>Devices Quant. </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter the devices quant." onChange={field.onChange} defaultValue={field.value} />
            </FormControl>
            <FormDescription>
              Specify the number of devices to be used in the simulation.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
