'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ConditionalStyles() {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)

    const body = document.body

    if (isStudioRoute) {
      // Remove font variable classes on studio routes
      body.className = ''
    }
  }, [isStudioRoute])

  // Always render the same content during SSR and initial hydration
  if (!isHydrated) {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --foreground-rgb: 0, 0, 0;
              --background-rgb: 255, 255, 255;
            }

            /* Critical CSS for initial render */
            .js-fallback {
              display: block;
            }

            .js-enhanced {
              display: none;
            }
          `,
        }}
      />
    )
  }

  // Don't apply custom styles on studio routes
  if (isStudioRoute) {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root { --foreground-rgb: 0, 0, 0; --background-rgb: 255, 255, 255; }
        `,
        }}
      />
    )
  }

  // Post-hydration: Enhanced styles
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            --foreground-rgb: 0, 0, 0;
            --background-rgb: 255, 255, 255;
          }

          /* Progressive enhancement styles */
          .js-enabled .js-fallback {
            display: none;
          }

          .js-enabled .js-enhanced {
            display: block;
          }

          /* Transition animations to hide hydration shifts */
          .js-enhanced {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }

          .js-enabled .js-enhanced {
            opacity: 1;
          }
        `,
      }}
    />
  )
}
