'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import {
  isSoundEnabled,
  setSoundEnabled,
  subscribeSoundEnabled,
} from '@/lib/sound'
import { cn } from '@/lib/utils'

/**
 * SoundToggle — SOUND-3 (GLOBAL-1): the persistent ambient-sound switch.
 *
 * The SOUND-2 "always on, no control" decision was reopened by the design
 * audit (F6): WCAG 2.2 SC 1.4.2 (level A) requires a user-accessible
 * mechanism to stop automatically-playing audio, and hover blips re-fire
 * on every pointer traversal. The owner's intent is preserved — sound
 * still defaults ON and arms on the first gesture — this is only the
 * OFF switch.
 *
 * Placement: the footer's telemetry line (next to the Damascus clock and
 * the coordinates — "table instruments"), styled as a mono Latin chrome
 * chip matching the status row. The visible ON/OFF token is Latin by
 * design (the telemetry row is a dir="ltr" mono island, like the
 * coordinates); the accessible name is fully localized via common.sound.
 *
 * Keyboard: the "S" shortcut flips the preference from anywhere except
 * text-entry contexts (inputs / textareas / contenteditable) so typing
 * an "s" never toggles the soundscape. aria-pressed carries the state
 * for assistive tech (the standard toggle-button contract).
 *
 * State source: the lib/sound.ts store (useSyncExternalStore with a
 * deterministic server snapshot of `true` — the default-ON identity;
 * a persisted OFF re-renders immediately after hydration, the sanctioned
 * pattern for localStorage-backed UI in this codebase).
 */
export function SoundToggle({ className }: { className?: string }) {
  const t = useTranslations('common')
  const on = useSyncExternalStore(subscribeSoundEnabled, isSoundEnabled, () => true)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 's' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (!el) return
      const tag = el.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (el as HTMLElement).isContentEditable) return
      setSoundEnabled(!isSoundEnabled())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const label = t('sound')

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label={label}
      title={`${label} — ${on ? 'ON' : 'OFF'} (S)`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1',
        'font-mono text-[10px] uppercase tracking-[0.14em] text-white/60',
        'transition-colors duration-300 hover:border-white/35 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-elyra-dark',
        className
      )}
    >
      {/* Status LED — green when live, dim hollow when muted. */}
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full transition-colors duration-300',
          on ? 'bg-g-green' : 'bg-white/25'
        )}
      />
      <span lang="en" dir="ltr" aria-hidden="true">
        SOUND {on ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}
