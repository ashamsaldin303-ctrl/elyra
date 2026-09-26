'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * GLOBAL-1 (plan §1.5) — the self-drawing SIGNAL WAVE. Successor to the
 * golden arabesque: the same scroll-scrubbed pathLength mechanic (the ONE
 * sanctioned non-transform/opacity house exception — it IS the whole
 * mechanic), re-imagined in the new identity's voice — an oscilloscope
 * trace on a measurement rail, the instrument reading that closes a
 * section instead of an ornamental band. Identity continuity is kept
 * exactly where the old wire was: the stroke that closes the manifesto,
 * the crown above the story — now in signal blue with a brass center
 * jewel (the "reading locked" node).
 *
 * Geometry (viewBox 0 0 1200 120, all stroke/no fill):
 *   · the RAIL — the measurement baseline, drawn FIRST (the journey
 *     opens with the instrument's zero line);
 *   · TICKS — ten calibration marks along the rail (one multi-M path so
 *     the draw sweep crosses them as a single beat);
 *   · two PULSE traces (oscilloscope deflections) with a small signal
 *     diamond node at each inner end;
 *   · the CENTER JEWEL — a brass double diamond (the locked reading),
 *     drawn LAST — the journey's final beat, mirroring the old rosette's
 *     role at the exact same station (x=600).
 *
 * SSR-armed pattern (CRITICAL — inherited verbatim from the arabesque's
 * AUDIT-A5 contract): the server HTML AND the hydration paint render
 * every path at pathLength 1 (FULLY DRAWN — the no-JS / reduced-motion /
 * first-paint resting state). An effect flips `armed` after mount, which
 * swaps style.pathLength from the number 1 to the scroll-driven
 * MotionValue — sitting at 0 while the wave is still below the fold (the
 * useScroll offset only wakes at 95% viewport), so the "erase" is never
 * visible. IN-VIEW-AT-MOUNT GUARD: if the band is already inside the draw
 * window when the first post-mount rAF fires, arming is skipped (an
 * already-delivered reading simply stays delivered — no scroll, no
 * redraw, nothing invisible).
 *
 * Reduced motion: the static branch renders plain <path> elements fully
 * drawn; useScroll/useSpring stay entirely unmounted — "static final
 * state, no listeners" is literal.
 */

/** The rail — the instrument's zero line (drawn first). */
const RAIL_D = 'M8,60 H1192'

/** Calibration ticks — one path, ten marks (600 is the jewel's station). */
const TICKS_D =
  'M100,52 V68 M200,52 V68 M300,52 V68 M400,52 V68 M500,52 V68 ' +
  'M700,52 V68 M800,52 V68 M900,52 V68 M1000,52 V68 M1100,52 V68'

/** Left oscilloscope deflection. */
const PULSE_L_D = 'M120,60 L160,60 L182,30 L206,90 L228,46 L250,60 L430,60'
/** Right deflection (mirrored reading). */
const PULSE_R_D = 'M770,60 L950,60 L972,46 L994,90 L1018,30 L1040,60 L1080,60'

/** Small signal diamonds at the pulses' inner ends. */
const NODE_L_D = 'M470,52 L478,60 L470,68 L462,60 Z'
const NODE_R_D = 'M730,52 L738,60 L730,68 L722,60 Z'

/** The center jewel — brass double diamond (outer + inner). */
const JEWEL_OUTER_D = 'M600,22 L638,60 L600,98 L562,60 Z'
const JEWEL_INNER_D = 'M600,42 L618,60 L600,78 L582,60 Z'

const SIGNAL = 'var(--signal)'
const BRASS = 'var(--elyra-gold-strong)'

/**
 * The stroke table. Draw order = array order: rail → ticks → left pulse
 * → left node → right pulse → right node → jewel outer → jewel inner.
 */
const STROKES: ReadonlyArray<{ d: string; color: string; width: number }> = [
  { d: RAIL_D, color: SIGNAL, width: 1 },
  { d: TICKS_D, color: SIGNAL, width: 1 },
  { d: PULSE_L_D, color: SIGNAL, width: 2 },
  { d: NODE_L_D, color: SIGNAL, width: 1.5 },
  { d: PULSE_R_D, color: SIGNAL, width: 2 },
  { d: NODE_R_D, color: SIGNAL, width: 1.5 },
  { d: JEWEL_OUTER_D, color: BRASS, width: 2 },
  { d: JEWEL_INNER_D, color: BRASS, width: 1.5 },
]

export function SignalWave({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  if (reduced) {
    // Static final state: fully drawn, plain <path> (zero framer).
    // `relative` on the wrapper satisfies framer's useScroll target
    // contract (non-static position) for the live branch below.
    return (
      <div aria-hidden="true" className={cn('relative', className)}>
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
          style={{ opacity: 0.9 }}
        >
          {STROKES.map((s) => (
            <path
              key={s.d}
              d={s.d}
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    )
  }

  return <DrawnWave className={className} />
}

/**
 * The live (scroll-driven) half — a separate component so its framer
 * hooks never mount under reduced motion (see the header note).
 */
function DrawnWave({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 95%', 'end 55%'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const p = scrollYProgress.get()
      // In-view at mount = already delivered — never arm (the spring
      // would snap mid-strokes to 0 with no scroll to redraw them).
      if (p > 0 && p < 1) return
      setArmed(true)
    })
    return () => cancelAnimationFrame(id)
  }, [scrollYProgress])

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn('relative', className)}>
      <svg
        viewBox="0 0 1200 120"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        style={{ opacity: 0.9 }}
      >
        {STROKES.map((s, i) => (
          <WaveStroke
            key={s.d}
            d={s.d}
            color={s.color}
            width={s.width}
            smooth={smooth}
            from={i / STROKES.length}
            to={(i + 1) / STROKES.length}
            armed={armed}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * One stroke of the wave. Hooks stay static (one useTransform per
 * component) — the slice is a prop, never a loop variable.
 */
function WaveStroke({
  d,
  color,
  width,
  smooth,
  from,
  to,
  armed,
}: {
  d: string
  color: string
  width: number
  smooth: MotionValue<number>
  from: number
  to: number
  armed: boolean
}) {
  const draw = useTransform(smooth, [from, to], [0, 1])

  return (
    <motion.path
      d={d}
      style={{ pathLength: armed ? draw : 1 }}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}
