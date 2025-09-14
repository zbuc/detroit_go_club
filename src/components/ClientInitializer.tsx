'use client'

import { useEffect } from 'react'

export default function ClientInitializer() {
  useEffect(() => {
    // Add js-enabled class after hydration to enable progressive enhancement
    setTimeout(() => {
      document.documentElement.classList.add('js-enabled')
    }, 0)
  }, [])

  return null
}
