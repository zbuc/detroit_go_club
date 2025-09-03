'use client'

import React, { useState, useCallback } from 'react'
import SGFViewer from './SGFViewer'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from './PortableTextComponents'

interface DualPanelDisplayProps {
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

export default function DualPanelDisplay({
  sgfContent,
  portableTextContent,
  title,
  defaultLayout = 'sgf-left',
  minHeight = '400px',
  showLabels = true,
  allowLayoutToggle = true,
  showHeader = true,
  className = '',
}: DualPanelDisplayProps) {
  const [layout, setLayout] = useState<PanelLayout>(defaultLayout)

  const toggleLayout = useCallback(() => {
    setLayout(layout === 'sgf-left' ? 'sgf-right' : 'sgf-left')
  }, [layout])

  const SGFPanel = useCallback(
    () => (
      <div style={{ flex: 1, minHeight: 'calc(100% - 60px)' }}>
        <SGFViewer sgfContent={sgfContent} />
      </div>
    ),
    [sgfContent]
  )

  const ContentPanel = useCallback(
    () => (
      <div
        className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        style={{ height: '100%', minHeight }}
      >
        <div className="flex-1 overflow-auto" style={{ minHeight: 'calc(100% - 60px)' }}>
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
    <div className={`dual-panel-display ${className}`}>
      {/* Header with layout toggle */}
      {showHeader && (
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-medium text-gray-900">Dual Panel Content</h2>
          {allowLayoutToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {layout === 'sgf-left' ? 'Board | Content' : 'Content | Board'}
              </span>
              <button
                onClick={toggleLayout}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title={`Move Go board to ${layout === 'sgf-left' ? 'right' : 'left'}`}
                aria-label={`Move Go board panel to ${layout === 'sgf-left' ? 'right' : 'left'}`}
              >
                {layout === 'sgf-left' ? '→' : '←'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Two-panel layout using CSS Grid */}
      <div className="grid grid-cols-2 gap-4" style={{ minHeight }}>
        {/* Left Panel */}
        <div className="panel-left">{layout === 'sgf-left' ? <SGFPanel /> : <ContentPanel />}</div>

        {/* Right Panel */}
        <div className="panel-right">{layout === 'sgf-left' ? <ContentPanel /> : <SGFPanel />}</div>
      </div>

      {/* Panel Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">
            {layout === 'sgf-left' ? 'Go Board Panel' : 'Content Panel'}
          </span>
          <span className="text-xs text-gray-500">
            {layout === 'sgf-left' ? 'Content Panel' : 'Go Board Panel'}
          </span>
        </div>
      )}
    </div>
  )
}
