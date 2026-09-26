'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Reveal } from '@/components/shared/reveal'
import { SectionHeading } from '@/components/shared/section-heading'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { cn } from '@/lib/utils'

/** Decorative sparkline heights per stat index (GLOBAL-2 WS10/R10). */
const TRUST_SPARKS = [
  [30, 50, 45, 75, 100],
  [25, 40, 65, 55, 90],
  [45, 60, 50, 80, 95],
  [20, 35, 60, 70, 100],
] as const

interface CounterProps {
  value: number
  suffix: string
  durationMs?: number
}

/** B4 fix 4 (audit A4 L): catalog guard for the numeric stats — a drifted
 *  value (empty string, non-numeric text, NaN) must never reach Intl as
 *  NaN (the counter would render «ليس رقمًا»); degrade to 0 like every
 *  catalog-guards sibling. */
function asFiniteNumber(raw: unknown): number {
  const n = Number(raw)
  return Number.isFinite(n) ? n : 0
}

/**
 * In-view detection without framer-motion (Phase 3 §4.3) — a tiny
 * IntersectionObserver hook with the same once/margin semantics.
 */
function useInViewOnce(ref: React.RefObject<HTMLElement | null>): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // Legacy fallback — async (rAF) so we never setState synchronously
      // inside the effect body (react-hooks/set-state-in-effect).
      const id = window.requestAnimationFrame(() => setInView(true))
      return () => window.cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '-15% 0px -15% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
}

function Counter({ value, suffix, durationMs = 1600 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInViewOnce(ref)
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)
  // Digit convention (L6-R4 reword; AUDIT-C4 LOW sibling): runtime-
  // formatted values (formatMoney, the clocks, dates, and this counter)
  // render LATIN digits site-wide. Historically this went through
  // next-intl's useFormatter with the bare 'ar' locale — Latin on current
  // ICU/CLDR (SSR-verified: the counter painted "0", not "٠") but
  // engine-dependent (Safari/JSC CLDR could flip to Arabic-Indic). Now
  // pinned explicitly via ar-u-nu-latn — the same hardening live-clock
  // received — so every runtime-numeral site agrees on every engine.
  // STATIC catalog strings keep Latin digits by house style — one
  // numeral presentation site-wide.
  const locale = useLocale()

  useEffect(() => {
    if (!inView || reduced) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value, durationMs])

  // Reduced-motion users see the final value immediately (derived, no setState).
  const shown = reduced ? (inView ? value : 0) : display
  const formatted = new Intl.NumberFormat(
    locale === 'ar' ? 'ar-u-nu-latn' : 'en-US'
  ).format(shown)

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  )
}

export function TrustBar() {
  const t = useTranslations('stats')
  const items = [
    { key: 'projects' as const, value: asFiniteNumber(t.raw('projects.value')), suffix: t('projects.suffix'), label: t('projects.label') },
    { key: 'hours' as const, value: asFiniteNumber(t.raw('hours.value')), suffix: t('hours.suffix'), label: t('hours.label') },
    { key: 'satisfaction' as const, value: asFiniteNumber(t.raw('satisfaction.value')), suffix: t('satisfaction.suffix'), label: t('satisfaction.label') },
    { key: 'integrations' as const, value: asFiniteNumber(t.raw('integrations.value')), suffix: t('integrations.suffix'), label: t('integrations.label') },
  ]

  return (
    <section
      className="bg-background py-20 sm:py-24"
      aria-labelledby="stats-title"
    >
      <div className="elyra-container max-w-container">
        {/* G2-1 F2: standard SectionHeading (same stats.kicker / stats.title
            catalog keys — kicker→h2 system, KineticWords reveal; content-side
            mt-12 rhythm below). */}
        <SectionHeading
          sec="MOD · PROOF"
          kicker={t('kicker')}
          title={t('title')}
          titleId="stats-title"
        />

        {/* G3-6 Stitch port (design-lab trust-band reference — the G2-1
            Opportunity-3 typographic stats strip): the boxed stat-card grid
            (rounded container + gap-px borders + icon chips + gradient
            accents) becomes ONE continuous typographic strip — oversized
            tabular numerals as the section's hero, small muted labels
            beneath, thin vertical hairline rules BETWEEN stats only.
            The rules are border-s (inline-start — LOGICAL, so the line
            lands between neighbors in BOTH directions) on every non-first
            item: at lg that separates the 4 columns; below lg (2×2 grid)
            it separates the two columns. No boxes, no container chrome,
            no icons — the numerals ARE the composition. dl/dt/dd contract,
            the Counter hook (rAF easeOutCubic count-up + instant final
            value under reduced motion) and the staggered Reveal entrance
            are all preserved from the pre-port design. */}
        <dl className="mt-12 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {items.map((item, i) => {
            return (
              /* Reveal renders the div wrapper (valid dl child) — but that div
                 may only contain dt/dd, so the visible label lives inside dd. */
              <Reveal
                key={item.key}
                delay={i * 0.08}
                variant="zoom"
                className={cn(
                  'px-4 py-2 text-center sm:px-6',
                  /* Column dividers only on non-first-column items of the
                     CURRENT row layout: <lg the grid is 2 cols (odd indexes
                     are left-of-divider), lg it is 4 cols (every i>0). The
                     max-lg override kills the stray outer-start tick the
                     2x2 layout drew on row-start items. */
                  i % 2 === 1 && 'border-s border-border',
                  i > 0 && i % 2 === 0 && 'border-s border-border max-lg:border-s-0'
                )}
              >
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  {/* GLOBAL-1 (plan §8-8 / audit F13): the numerals STAND
                      STILL — a measurement is data, and data doesn't drift
                      (the twin-depth parallax retired with the rule «never
                      animate information»). Signal-blue readout voice. */}
                  <span className="block">
                    <span
                      className="block text-4xl font-bold tracking-tight text-signal tabular-nums sm:text-5xl lg:text-6xl"
                      style={{ fontVariationSettings: '"wght" 700' }}
                    >
                      <Counter value={Number(item.value)} suffix={item.suffix} />
                    </span>
                  </span>
                  {/* GLOBAL-2 (WS10/R10): the readout's pulse — a 5-bar
                      micro-sparkline (decorative; the numeral itself stays
                      perfectly still per «never animate information»). */}
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-4 flex h-4 items-end justify-center gap-0.5"
                  >
                    {TRUST_SPARKS[i % TRUST_SPARKS.length].map((h, si) => (
                      <span
                        key={si}
                        className={`w-0.5 rounded-sm ${si === 4 ? 'bg-signal' : 'bg-signal/30'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </span>
                  <span className="mt-3 block text-sm font-normal tracking-normal text-muted-foreground">{item.label}</span>
                </dd>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
