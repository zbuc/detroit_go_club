'use client'

import { usePathname } from 'next/navigation'

export function ConditionalNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  // Don't render navigation at all on studio routes
  if (isStudioRoute) {
    return null
  }

  return <>{children}</>
}
