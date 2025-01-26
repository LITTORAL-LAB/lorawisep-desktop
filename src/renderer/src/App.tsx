import { I18nextProvider } from 'react-i18next'
import i18n from './config/i18n' // Caminho do arquivo de configuração do i18n
import { ParamsSimulatePage } from './pages/simulation/ParamsSimulatePage'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ParamsSimulatePage />
        <Toaster />
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
