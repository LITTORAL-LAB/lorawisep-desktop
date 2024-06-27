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

export function OptmAlgorithmsForm() {

  return (
    <>
      <FormField
        name="gwQuant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gateway Quantity Algorithm</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elbow">Elbow Method</SelectItem>
                  <SelectItem value="gap">Gap-Statistic Method</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose an algorithm to determine the optimal number of gateways based on statistical methods. The Elbow Method and Gap-Statistic are used to find the most efficient configuration.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="gwPos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gateway Positioning Algorithm</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kmeans">K-Means Approach</SelectItem>
                  <SelectItem value="genetic">Genetic Algorithm Approach</SelectItem>
                  <SelectItem value="pso">Particle Swarm Optimization (PSO) Approach</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Select an algorithm for optimal gateway positioning to ensure effective coverage and connectivity. Each method provides a different approach to solving the positioning problem.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
