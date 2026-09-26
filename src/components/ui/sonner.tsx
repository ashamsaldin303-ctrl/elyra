"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * F-S9-01 (gold-standard audit): next-themes was a dependency used ONLY
 * here (shadcn's stock wrapper syncs the toaster theme with the app theme
 * provider). The site has no dark-mode TOGGLE — the appearance is a
 * build-time constant, so the theme is pinned. GLOBAL-1 (dark-first
 * flip): the pinned value moved "light" → "dark" to match the ink base
 * (the surface variables below already ride the flipped tokens).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
