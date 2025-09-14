'use client'

import React, { useState, useCallback } from 'react'
import SGFViewerClient from './SGFViewerClient'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from './PortableTextComponents'

interface DualPanelClientProps {
  sgfContent: string
  portableTextContent: PortableTextBlock[]
  title?: string
  defaultLayout?: 'sgf-left' | 'sgf-right'
  minHeight?: string
  showLabels?: boolean
  allowLayoutToggle?: boolean
  showHeader?: boolean
  className?: string
}

type PanelLayout = 'sgf-left' | 'sgf-right'

export default function DualPanelClient({
  sgfContent,
  portableTextContent,
  title,
  defaultLayout = 'sgf-left',
  minHeight = '412px',
  showLabels = true,
  allowLayoutToggle = true,
  showHeader = true,
  className = '',
}: DualPanelClientProps) {
  const [layout, setLayout] = useState<PanelLayout>(defaultLayout)

  const toggleLayout = useCallback(() => {
    setLayout(layout === 'sgf-left' ? 'sgf-right' : 'sgf-left')
  }, [layout])

  const SGFPanel = useCallback(
    () => (
      <div style={{ height: minHeight, overflow: 'hidden' }}>
        <SGFViewerClient sgfContent={sgfContent} className="h-full" />
      </div>
    ),
    [sgfContent, minHeight]
  )

  const ContentPanel = useCallback(
    () => (
      <div className="bg-white overflow-hidden flex flex-col" style={{ height: minHeight }}>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            <div className="prose prose-gray max-w-none">
              <PortableText value={portableTextContent} components={portableTextComponents} />
            </div>
          </div>
        </div>
      </div>
    ),
    [portableTextContent, title, minHeight]
  )

  return (
    <div
      className={`dual-panel-display bg-gray-50 rounded-lg border border-gray-200 px-4 ${className}`}
    >
      {/* Header with layout toggle */}
      {showHeader && allowLayoutToggle && (
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            {showLabels && (
              <>
                <span className="text-sm text-gray-600">
                  {layout === 'sgf-left' ? 'Board | Analysis' : 'Analysis | Board'}
                </span>
              </>
            )}
          </div>
          <button
            onClick={toggleLayout}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Swap Layout
          </button>
        </div>
      )}

      {/* Two-panel layout using CSS Grid */}
      <div className="grid grid-cols-2 gap-4" style={{ minHeight }}>
        {/* Left Panel */}
        <div className="panel-left">{layout === 'sgf-left' ? <SGFPanel /> : <ContentPanel />}</div>

        {/* Right Panel */}
        <div className="panel-right">{layout === 'sgf-left' ? <ContentPanel /> : <SGFPanel />}</div>
      </div>
    </div>
  )
}
