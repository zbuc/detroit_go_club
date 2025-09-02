'use client'

import React from 'react'
import DualPanelDisplay from './DualPanelDisplay'
import { type PortableTextBlock } from '@portabletext/react'

interface DualPanelData {
  _type: 'dualPanel'
  title?: string
  layout?: 'sgf-left' | 'sgf-right'
  sgf?: {
    title?: string
    sgfContent: string
    boardSize?: string
    showControls?: boolean
    showCoordinates?: boolean
  }
  content: PortableTextBlock[]
  displayOptions?: {
    minHeight?: string
    showLabels?: boolean
    allowLayoutToggle?: boolean
  }
}

interface DualPanelContentProps {
  data: DualPanelData
  className?: string
}

export default function DualPanelContent({ data, className = '' }: DualPanelContentProps) {
  const { title, layout = 'sgf-left', sgf, content, displayOptions = {} } = data

  // If we don't have both SGF and content, don't render
  if (!sgf?.sgfContent || !content || content.length === 0) {
    console.warn('DualPanelContent: Missing required SGF content or text content')
    return null
  }

  // Extract display options with defaults
  const { minHeight = '400px', showLabels = true, allowLayoutToggle = false } = displayOptions

  // Determine the title - prefer section title, fall back to SGF title
  const displayTitle = title || sgf.title

  return (
    <div className={`dual-panel-content ${className}`}>
      <DualPanelDisplay
        sgfContent={sgf.sgfContent}
        portableTextContent={content}
        title={displayTitle}
        defaultLayout={layout}
        minHeight={minHeight}
        showLabels={showLabels}
        allowLayoutToggle={allowLayoutToggle}
        showHeader={true}
        className="dual-panel-content-display"
      />
    </div>
  )
}
