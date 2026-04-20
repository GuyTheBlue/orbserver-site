import { watch, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export type TerminalTheme = 'cyan' | 'amber' | 'pink' | 'green'

const currentTheme = useLocalStorage<TerminalTheme>('orbserver-terminal-theme', 'cyan')

export function useTerminalTheme() {
  function setTheme(theme: TerminalTheme) {
    currentTheme.value = theme
    applyTheme(theme)
  }

  function applyTheme(theme: TerminalTheme) {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  onMounted(() => {
    applyTheme(currentTheme.value)
  })

  // Watch for changes (in case same user opens multiple tabs)
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme,
    setTheme
  }
}
