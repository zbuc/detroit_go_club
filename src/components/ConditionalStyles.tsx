'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ConditionalStyles() {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  useEffect(() => {
    const body = document.body

    if (isStudioRoute) {
      // Remove font variable classes on studio routes
      body.className = ''
    } else {
      // Add font variable classes on app routes
      // body.className = `${archivoVariable} ${loraVariable}`
    }
  }, [isStudioRoute])

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

  return (
    <style
      dangerouslySetInnerHTML={{
        // Core styles can be set here to be inlined
        // instead of pulled as a separate CSS file
        __html: `
        :root {}
      `,
      }}
    />
  )
}
