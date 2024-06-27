import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"

export function SimParamsForm() {

  return (
    <>
      <FormField
        name="simTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Simulation Time</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter the simulation time in seconds" onChange={field.onChange} defaultValue={field.value} />
            </FormControl>
            <FormDescription>
              This value will determine the total period of the simulation.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="simPacketNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Packets</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter the number of packets to send" onChange={field.onChange} defaultValue={field.value} />
            </FormControl>
            <FormDescription>
              Specify how many packets should be sent during the simulation.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="simPropLoss"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Propagation Loss Model</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a propagation loss model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"1"} value="ns3">Propagation Loss Model (NS-3)</SelectItem>
                  <SelectItem key={"2"} value="okomura">Okumura Hata Model</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the propagation loss model suitable for your simulation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
