<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

defineOptions({ name: 'UiBeamsBackground' })

const props = withDefaults(defineProps<{
  intensity?: 'subtle' | 'medium' | 'strong'
}>(), {
  intensity: 'strong'
})

type IBeam = {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  pulse: number
  pulseSpeed: number
}

const OPACITY_BY_INTENSITY: Record<string, number> = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1
}

const MINIMUM_BEAMS = 20

function createBeam (width: number, height: number): IBeam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03
  }
}

function resetBeam (beam: IBeam, index: number, totalBeams: number, canvas: HTMLCanvasElement): void {
  const column = index % 3
  const spacing = canvas.width / 3

  beam.y = canvas.height + 100
  beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
  beam.width = 100 + Math.random() * 100
  beam.speed = 0.5 + Math.random() * 0.4
  beam.hue = 190 + (index * 70) / totalBeams
  beam.opacity = 0.2 + Math.random() * 0.1
}

function drawBeam (ctx: CanvasRenderingContext2D, beam: IBeam): void {
  ctx.save()
  ctx.translate(beam.x, beam.y)
  ctx.rotate((beam.angle * Math.PI) / 180)

  const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * OPACITY_BY_INTENSITY[props.intensity]

  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
  gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`)
  gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
  gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
  gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
  gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
  gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`)

  ctx.fillStyle = gradient
  ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
  ctx.restore()
}

const root = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const beams = ref<IBeam[]>([])
let animationFrame = 0

function resizeCanvas (): void {
  const canvas = canvasRef.value
  const container = root.value
  if (!canvas || !container) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const { width, height } = container.getBoundingClientRect()

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  const totalBeams = MINIMUM_BEAMS * 1.5
  beams.value = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height))
}

function animate (): void {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.filter = 'blur(35px)'

  const totalBeams = beams.value.length
  beams.value.forEach((beam, index) => {
    beam.y -= beam.speed
    beam.pulse += beam.pulseSpeed

    if (beam.y + beam.length < -100) {
      resetBeam(beam, index, totalBeams, canvas)
    }

    drawBeam(ctx, beam)
  })

  animationFrame = requestAnimationFrame(animate)
}

useResizeObserver(root, resizeCanvas)

onMounted(() => {
  resizeCanvas()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div
    ref="root"
    class="relative w-full overflow-hidden bg-neutral-950"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0"
      style="filter: blur(15px)"
    />
    <div class="beams-background__pulse absolute inset-0 bg-neutral-950/5" />
    <div class="relative z-10 flex h-full w-full items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.beams-background__pulse {
  animation: beams-background-pulse 10s ease-in-out infinite;
  backdrop-filter: blur(50px);
}

@keyframes beams-background-pulse {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.15; }
}

@media (prefers-reduced-motion: reduce) {
  .beams-background__pulse {
    animation: none;
    opacity: 0.1;
  }
}
</style>
