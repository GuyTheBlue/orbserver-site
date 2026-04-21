import { ref, onMounted, onUnmounted, type ComputedRef } from 'vue'

export interface TerminalTelemetry {
  lat: string
  lng: string
  phaseName: string
  illum: string
  age: string
  dist: string
  alt: string
  az: string
  rot: string
}

export function useMoonTerminal(scriptData: any[], telemetry: ComputedRef<TerminalTelemetry>) {
  const termLines = ref<Array<{ text: string, cls: string }>>([])
  const termCursor = ref(true)
  let alive = false

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

  async function typeChar(idx: number, full: string, isCmd: boolean) {
    for (let i = 0; i <= full.length; i++) {
      if (!alive) return
      termLines.value[idx] = { text: full.slice(0, i), cls: isCmd ? 'term-cmd' : 'term-out' }
      await sleep(isCmd ? 42 : 9)
    }
    await sleep(isCmd ? 280 : 50)
  }

  async function runSession() {
    alive = true
    termLines.value = []

    for (const e of scriptData) {
      if (!alive) return

      if (e.blank) {
        termLines.value.push({ text: '', cls: 'term-blank' })
        await sleep(160)
        continue
      }

      // Replace placeholders with real telemetry
      const tel = telemetry.value
      const processedText = e.t
        .replace('{{lat}}', tel.lat)
        .replace('{{lng}}', tel.lng)
        .replace('{{phaseName}}', (tel.phaseName || 'ACQUIRING').toUpperCase())
        .replace('{{illum}}', tel.illum)
        .replace('{{age}}', tel.age)
        .replace('{{dist}}', tel.dist)
        .replace('{{alt}}', tel.alt)
        .replace('{{az}}', tel.az)
        .replace('{{rot}}', tel.rot)

      termLines.value.push({ text: '', cls: e.cmd ? 'term-cmd' : 'term-out' })
      await typeChar(termLines.value.length - 1, processedText, !!e.cmd)
    }

    await sleep(7000)
    termLines.value = []
    await sleep(600)
    if (alive) runSession()
  }

  onMounted(() => {
    if (!import.meta.client) return
    const cursorInterval = setInterval(() => {
      termCursor.value = !termCursor.value
    }, 530)

    onUnmounted(() => clearInterval(cursorInterval))

    setTimeout(runSession, 1400)
  })

  onUnmounted(() => {
    alive = false
  })

  return {
    termLines,
    termCursor
  }
}
