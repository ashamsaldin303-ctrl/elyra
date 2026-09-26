'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Wrench, ArrowRight, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { getLenis } from '@/lib/lenis-holder'
import { useIsRtl } from '@/lib/use-rtl'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/shared/reveal'
import { BeforeAfter, toMockContent, type ScenePalette } from '@/components/home/before-after'
import { asStringArray } from '@/lib/catalog-guards'

type Category = 'websites' | 'automation'

interface ProjectDef {
  key: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'
  category: Category
  variant: 'site-new' | 'property-new' | 'academy-new' | 'dining-new' | 'kanban-new' | 'dashboard-new'
  accent: string
  /** R9: dashboard skin — p5 dark SaaS; p6 is the kanban board (G3-4). */
  tone?: 'dark' | 'light'
  /** G3-4: per-scene brand palette (G2-2 F2) — when present its primary
   *  becomes the scene accent and its neutrals replace the shared stone
   *  scale inside the scene. */
  palette?: ScenePalette
}

/* G3-4 per-scene palettes — each project's "after" scene now carries its
 * Stitch brand world's neutrals, not just a swapped accent (the G2-2 F2
 * sameness cure). p5 keeps its dark Google-blue console (accent only);
 * p6's kanban scene owns its warm-graphite tokens internally.
 * • p1 لمسة — quiet-luxury boutique: warm stone/clay on linen off-white
 * • p2 عقار بلس — trustworthy portal: emerald/teal on warm off-white
 * • p3 مسار — warm education: terracotta + charcoal on cream
 * • p4 بيت الشام — Levantine hospitality: espresso/cream/tomato
 */
const PROJECTS: ProjectDef[] = [
  {
    key: 'p1',
    category: 'websites',
    variant: 'site-new',
    accent: '#A96A4F',
    palette: {
      primary: '#A96A4F',
      surface: '#FBF8F3',
      surfaceMuted: '#F3EDE3',
      border: '#E7DDD0',
      borderSoft: '#F0E9DE',
      ink: '#2E2721',
      inkSoft: '#4A423A',
      inkMuted: '#8A7E72',
      inkFaint: '#B3A99D',
    },
  },
  {
    key: 'p2',
    category: 'websites',
    variant: 'property-new',
    accent: '#0E8A5F',
    palette: {
      primary: '#0E8A5F',
      surface: '#FCFDFB',
      surfaceMuted: '#EEF5F0',
      border: '#DAE7DE',
      borderSoft: '#E8F1EA',
      ink: '#12241C',
      inkSoft: '#2A4237',
      inkMuted: '#6B7C73',
      inkFaint: '#9BABA2',
    },
  },
  {
    key: 'p3',
    category: 'websites',
    variant: 'academy-new',
    accent: '#C05B3C',
    palette: {
      primary: '#C05B3C',
      surface: '#FDF9F1',
      surfaceMuted: '#F6EFE2',
      border: '#EBDFCC',
      borderSoft: '#F2EADB',
      ink: '#33291F',
      inkSoft: '#50453A',
      inkMuted: '#8A7A66',
      inkFaint: '#B5A78F',
    },
  },
  {
    key: 'p4',
    category: 'websites',
    variant: 'dining-new',
    accent: '#C23A22',
    palette: {
      primary: '#C23A22',
      surface: '#FFF9EC',
      surfaceMuted: '#F7EEDA',
      border: '#EADBC0',
      borderSoft: '#F2EAD6',
      ink: '#2B1B12',
      inkSoft: '#4E3A2B',
      inkMuted: '#8C7563',
      inkFaint: '#B8A48E',
    },
  },
  { key: 'p5', category: 'automation', variant: 'dashboard-new', accent: '#4285F4', tone: 'dark' }, // SaaS console (google blue, dark)
  {
    key: 'p6',
    category: 'automation',
    variant: 'kanban-new',
    accent: '#D97706', // warm-graphite planner + amber (G3-4: was a light-tone DashNewScene twin of p5)
  },
]

type Filter = 'all' | Category

export function WorkGrid() {
  const t = useTranslations('pages.work')
  const tc = useTranslations('common')
  const isRtl = useIsRtl()
  const [filter, setFilter] = useState<Filter>('all')
  /* GLOBAL-2 (WS4): the Case Sheet dossier state (Radix Sheet = focus trap
     + ESC + the Lenis single-writer contract, same as the navbar sheet). */
  const [openCase, setOpenCase] = useState<ProjectDef | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  )

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('filters.all') },
    { id: 'websites', label: t('filters.websites') },
    { id: 'automation', label: t('filters.automation') },
  ]

  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="work-grid-title">
      <div className="elyra-container max-w-container">
        {/* sr-only h2: fixes the broken aria-labelledby reference AND the
            h1→h3 heading-order jump flagged by Lighthouse. */}
        <h2 id="work-grid-title" className="sr-only">{t('gridTitle')}</h2>
        {/* FIX(2-c/14): plain toggle-button group — the previous
            role="tablist"/"tab" markup had no tabpanels, no aria-controls
            and no roving tabindex (an incomplete tabs pattern). These are
            filters with visible text labels, so aria-pressed buttons are
            the correct semantics. */}
        {/* GLOBAL-1 (plan §3.7): the filter chips became ONE segmented
            instrument control — a hairline container with the active cell
            filled (the aria-pressed + polite-count contracts are
            untouched — FIX(2-c/14) / AUDIT-C4 stay authoritative). */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1">
            {filters.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  data-cursor="magnet"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* AUDIT-C4 NIT (fix 6): filter changes were silent to SR users —
            the grid re-renders with a different card set and nothing
            announced it. This persistent polite status region (sr-only,
            OUTSIDE the keyed grid so it never remounts — remounted live
            regions don't reliably announce) reports the result count on
            every filter change. resultsCount is a full CLDR plural like
            calculator.pagesValue; its `#` arms render Latin digits on
            current engines ('ar' → latn) — same documented limitation. */}
        <p role="status" aria-live="polite" className="sr-only">
          {t('resultsCount', { count: visible.length })}
        </p>

        {/* Phase 3 §4.3: framer layout-animation replaced by a CSS fade
            keyed on the filter — filtering stays instant and framer-free,
            dropping /work's initial JS below the 200KB target.
            R2: cards are BIGGER (gap-10, larger type) and reveal with the
            zoom variant + per-card stagger — the same scroll-animation
            language as the deconstructed card, scaled for the grid.
            R8.1: single column up to lg (1024px) — the dense before/after
            mockups need ~600px+ of width to stay legible; the old
            md:grid-cols-2 squeezed them into ~340px at tablet / preview
            panel widths (the "didn't display well" report). */}
        <div key={filter} className="reveal-filter-in mt-14 grid gap-10 lg:grid-cols-2">
          {visible.map((p, i) => {
            // L6-R2 (fix 6): runtime-narrowed catalog reads (was `as string[]`).
            const metrics = asStringArray(t.raw(`projects.${p.key}.metrics`))
            const services = asStringArray(t.raw(`projects.${p.key}.services`))
            // UI-4: per-project mock content for the realistic "after" scene
            const mock = toMockContent(t.raw(`projects.${p.key}.mock`))
            return (
              <article key={p.key}>
                <Reveal variant="zoom" delay={i * 0.07}>
                  {/* AUDIT-A5 LOW (fix 5): these cards are deliberately
                      NON-interactive (no link/expand/handler — making them
                      interactive is a product decision out of scope here),
                      so the data-cursor="zoom" marker and the hover lift
                      (group-hover:-translate-y-1.5 + card-lift-hover) were
                      removed: pointer users were invited to click and
                      nothing happened. The comparison mockup keeps its
                      static frame. */}
                  {/* GLOBAL-2 (WS4): the comparison becomes a PLATE — mono
                      caption bar (folio · category · scene) + bezel ticks. */}
                  <div className="corner-ticks relative overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
                      <span lang="en" dir="ltr" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        PLT-0{i + 1} · {p.category}
                      </span>
                      <span lang="en" dir="ltr" className="font-mono text-[10px] uppercase tracking-[0.18em] text-elyra-gold/70">
                        {p.variant}
                      </span>
                    </div>
                    <BeforeAfter
                      variant={p.variant}
                      accent={p.accent}
                      palette={p.palette}
                      tone={p.tone}
                      label={t(`projects.${p.key}.title`)}
                      mock={mock}
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {t(`projects.${p.key}.type`)}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">{t(`projects.${p.key}.title`)}</h3>
                  </div>
                  <p className="mt-2.5 text-sm text-muted-foreground">{t(`projects.${p.key}.desc`)}</p>

                  {/* Services delivered (Phase 2 content enrichment) */}
                  <ul className="mt-4 space-y-1.5">
                    {services.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wrench className="size-3.5 shrink-0 text-signal/70" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {metrics.map((m, idx) => (
                      <li key={idx} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary-strong">
                        {m}
                      </li>
                    ))}
                  </ul>

                  {/* GLOBAL-1 (plan 0.9 / audit F7): every sheet gets an
                      OUTCOME PATH — the same prefill contract the simulator
                      and the bento agent produce (service + idea), so the
                      gallery stops dead-ending. The card body stays
                      non-interactive (AUDIT-A5 fix 5 intact); this link is
                      the one explicit, labelled action. */}
                  <Link
                    href={`/contact?service=${p.category === 'automation' ? 'automation' : 'websites'}&idea=${encodeURIComponent(t(`projects.${p.key}.title`))}`}
                    data-cursor="magnet"
                    className="group/link mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-signal transition-colors duration-300 hover:border-signal/40 hover:bg-signal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {t('requestCta')}
                    <ArrowRight
                      className="size-4 transition-transform group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenCase(p)}
                    data-cursor="magnet"
                    className="btn-line mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-signal/40 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {t('openCase')}
                  </button>
                </Reveal>
              </article>
            )
          })}
        </div>

        {/* GLOBAL-2 (WS4): Case Sheet — the missing depth layer (audit R3/F7):
            each plate opens a full case dossier (interactive comparison,
            results readout, services, prefill CTA) in a Radix Sheet. */}
        <Sheet
          open={openCase !== null}
          onOpenChange={(next) => {
            if (next) getLenis()?.stop()
            else getLenis()?.start()
            if (!next) setOpenCase(null)
          }}
        >
          <SheetContent
            side={isRtl ? 'left' : 'right'}
            className="flex h-dvh w-full max-w-3xl flex-col overflow-y-auto border-white/10 bg-elyra-deep p-0 text-elyra-on-dark"
          >
            {openCase ? (
              <>
                <SheetHeader className="flex flex-row items-start justify-between gap-4 px-6 pt-6">
                  <SheetTitle className="text-2xl font-extrabold tracking-tight">
                    {t(`projects.${openCase.key}.title`)}
                  </SheetTitle>
                  <SheetClose
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
                    aria-label={tc('close')}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </SheetClose>
                </SheetHeader>
                <div className="px-6 pb-10 pt-4">
                  <p lang="en" dir="ltr" className="font-mono text-[10px] uppercase tracking-[0.18em] text-elyra-gold/70">
                    PLT-0{PROJECTS.findIndex((x) => x.key === openCase.key) + 1} · {openCase.variant}
                  </p>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                    <BeforeAfter
                      variant={openCase.variant}
                      accent={openCase.accent}
                      palette={openCase.palette}
                      tone={openCase.tone}
                      label={t(`projects.${openCase.key}.title`)}
                      mock={toMockContent(t.raw(`projects.${openCase.key}.mock`))}
                    />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/70">
                    {t(`projects.${openCase.key}.desc`)}
                  </p>
                  <p lang="en" dir="ltr" className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Results
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {asStringArray(t.raw(`projects.${openCase.key}.metrics`)).map((m) => (
                      <li key={m} className="border-b border-white/5 pb-1.5 text-sm font-medium text-signal">
                        {m}
                      </li>
                    ))}
                  </ul>
                  <p lang="en" dir="ltr" className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Services
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {asStringArray(t.raw(`projects.${openCase.key}.services`)).map((s) => (
                      <li key={s} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/contact?service=${openCase.category === 'automation' ? 'automation' : 'websites'}&idea=${encodeURIComponent(t(`projects.${openCase.key}.title`))}`}
                    className="btn-energy mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground"
                  >
                    {t('requestCta')}
                  </Link>
                </div>
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </section>
  )
}
