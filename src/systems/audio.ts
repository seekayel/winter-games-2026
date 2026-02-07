// Web Audio API sound effects - all generated procedurally (no files needed)

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function getVolume(): number {
  // Try to read from localStorage directly to avoid importing the store
  try {
    const saved = localStorage.getItem('winter-games-2026-save')
    if (saved) {
      const data = JSON.parse(saved)
      return data?.state?.sfxVolume ?? 1.0
    }
  } catch {
    // ignore
  }
  return 1.0
}

export function playSprintTap() {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = 800 + Math.random() * 200
  gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.08)
}

export function playJumpWhoosh() {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.4)
}

export function playWallHit() {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  // White noise burst for wall impact
  const bufferSize = ctx.sampleRate * 0.1
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime)

  source.connect(gain).connect(ctx.destination)
  source.start()
}

export function playCountdownBeep(final: boolean = false) {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.value = final ? 1200 : 800
  gain.gain.setValueAtTime(0.2 * vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (final ? 0.4 : 0.15))

  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + (final ? 0.4 : 0.15))
}

export function playVictoryFanfare() {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  const noteLength = 0.15

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, ctx.currentTime + i * noteLength)
    gain.gain.linearRampToValueAtTime(0.1 * vol, ctx.currentTime + i * noteLength + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * noteLength)

    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime + i * noteLength)
    osc.stop(ctx.currentTime + (i + 1) * noteLength)
  })
}

export function playFinishCross() {
  const ctx = getAudioContext()
  const vol = getVolume()
  if (vol === 0) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(0.15 * vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.5)
}
