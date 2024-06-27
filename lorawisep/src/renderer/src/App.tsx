import { ParamsSimulatePage } from './pages/simulation/ParamsSimulatePage'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ParamsSimulatePage />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
