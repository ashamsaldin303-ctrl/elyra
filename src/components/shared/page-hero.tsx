'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeroAtmosphere } from './hero-atmosphere'
import { DamascusClock } from '@/components/layout/damascus-clock'

interface PageHeroProps {
  namespace: string
  ctaHref?: string
  className?: string
  /** G3-5 (SO-1): optional per-page decorative motif (aria-hidden is the
   *  CALLER's responsibility — motifs are purely presentational). Rendered
   *  absolutely inside the hero section, after the base gradient layers, so
   *  each service page can carry a signature zone without forking the
   *  generic hero. Keep it reduced-motion safe + RTL safe. */
  decorative?: React.ReactNode
  /** IA — «نَسيم الواجهات»: the living background layer (aurora +
   *  starfield + blueprint + outlined watermark). When present it
   *  replaces the legacy static radial gradient; the fig/spec strings
   *  are Latin technical chrome (homepage idiom — not catalog copy). */
  atmosphere?: {
    fig: string
    spec: string
    word: string
  }
}

/**
 * Dark page hero used across all inner pages (consistent navbar treatment,
 * dramatic design — guide §2 says all heroes are dark).
 *
 * Phase 3 (§4.1): above-the-fold content uses CSS-only entrance keyframes
 * (`hero-enter`) — framer-motion removed, so inner-page LCP paints with the
 * first server-rendered frame. h1/subtitle (LCP candidates) carry no delay.
 */
export function PageHero({ namespace, ctaHref = '/contact', className, decorative, atmosphere }: PageHeroProps) {
  const t = useTranslations(namespace)
  const locale = useLocale()

  return (
    <section
      className={cn(
        /* MOBILE-2: `page-hero` is a stable MARKER class (zero visual
           change by itself) — the mobile rune tier's CSS in globals.css
           targets it to open the ~120px lower signature band while
           html[data-rune-mobile] is live (see the MOBILE-2 block there). */
        'page-hero',
        /* IA fix — `isolate` creates a stacking context on the section
           itself. WITHOUT it, every negative-z child (the .hero-fallback
           gradient, the atmosphere strata, the service motifs) escapes
           to the ROOT stacking context and paints BEHIND the section's
           own bg-elyra-dark fill — the literal "flat blue wall" the
           owner reported: the fallback gradient was never visible on
           inner pages. isolation:isolate contains the negative-z layer
           INSIDE the section (painted above its background, below the
           in-flow content) with zero z-index side effects on any
           descendant or sibling. */
        'relative isolate overflow-hidden bg-elyra-dark text-elyra-on-dark',
        'pt-28 pb-16 sm:pt-40 sm:pb-28',
        className
      )}
      aria-labelledby="page-hero-title"
    >
      <div className="hero-fallback absolute inset-0 -z-10" aria-hidden="true" />
      {atmosphere ? (
        <HeroAtmosphere fig={atmosphere.fig} spec={atmosphere.spec} word={atmosphere.word} />
      ) : (
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(66,133,244,0.18), transparent 70%)' }}
          aria-hidden="true"
        />
      )}
      {decorative}
      {/* GLOBAL-2 (ROUND-2 WS1): the centered landing hero is RETIRED —
          inner pages now open as INSTRUMENT TITLE BLOCKS: a start-aligned
          display statement at poster weight, a mono readout row, and a
          telemetry rail on the end margin (studio time + spec). The
          LCP-safe CSS-only entrance contract (hero-enter, no framer,
          server-rendered) is untouched — D14 stays authoritative. */}
      <div className="elyra-container max-w-container relative">
        <div className="hero-enter hero-enter-1 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="kicker kicker-on-dark">{t('kicker')}</span>
          {atmosphere ? (
            <span
              lang="en"
              dir="ltr"
              aria-hidden="true"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-elyra-gold/80"
            >
              {atmosphere.fig}
            </span>
          ) : null}
        </div>
        <h1
          id="page-hero-title"
          className="hero-enter mt-6 max-w-5xl text-balance text-start text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          // wght 800 — the GLOBAL-2 poster voice (the home hero keeps its
          // own variable-wght cursor binding; two registers, one family).
          style={{ fontVariationSettings: '"wght" 800' }}
        >
          <span className="block">{t('title')}</span>
          {t.has('titleAccent') ? (
            <span className="block text-signal">{t('titleAccent')}</span>
          ) : null}
        </h1>
        <p className="hero-enter mt-6 max-w-2xl text-pretty text-start text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
          {t('subtitle')}
        </p>
        {ctaHref && t.has('cta') ? (
          <div className="hero-enter hero-enter-2 mt-10">
            <Link
              href={ctaHref}
              data-cursor="magnet"
              className="btn-energy group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-elyra-dark"
            >
              {t('cta')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
        {/* Telemetry rail — the page's instrument margin (desktop). */}
        <div
          aria-hidden="true"
          lang="en"
          dir="ltr"
          className="pointer-events-none absolute end-0 top-2 hidden flex-col items-end gap-4 xl:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            {atmosphere?.spec ?? 'GRID 12 × 8 · SPEC v2.5'}
          </span>
          <span className="h-20 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <DamascusClock locale={locale} className="text-[10px] text-white/40" />
        </div>
      </div>
    </section>
  )
}
