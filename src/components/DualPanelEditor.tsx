'use client'

import React, { useState, useCallback } from 'react'
import { Button, Card, Flex, Stack, Text, Badge } from '@sanity/ui'
import { ArrowLeftIcon, ArrowRightIcon, EditIcon, PlayIcon } from '@sanity/icons'
import SGFViewer from './SGFViewer'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from './PortableTextComponents'

interface DualPanelEditorProps {
  sgfContent: string
  portableTextContent: PortableTextBlock[]
  title?: string
  onSgfChange?: (sgf: string) => void
  onPortableTextChange?: (content: PortableTextBlock[]) => void
  className?: string
  // Additional display options
  showLabels?: boolean
  showHeader?: boolean
  minHeight?: string
  allowLayoutToggle?: boolean
  defaultLayout?: PanelLayout
}

type PanelLayout = 'sgf-left' | 'sgf-right'
type PanelMode = 'view' | 'edit'

export default function DualPanelEditor({
  sgfContent,
  portableTextContent,
  title,
  onSgfChange,
  onPortableTextChange,
  className = '',
  showLabels = true,
  showHeader = true,
  minHeight = '400px',
  allowLayoutToggle = true,
  defaultLayout = 'sgf-left',
}: DualPanelEditorProps) {
  const [layout, setLayout] = useState<PanelLayout>(defaultLayout)
  const [sgfMode, setSgfMode] = useState<PanelMode>('view')
  const [contentMode, setContentMode] = useState<PanelMode>('view')

  const toggleLayout = useCallback(() => {
    setLayout(layout === 'sgf-left' ? 'sgf-right' : 'sgf-left')
  }, [layout])

  const toggleSgfMode = useCallback(() => {
    setSgfMode((mode) => (mode === 'view' ? 'edit' : 'view'))
  }, [])

  const toggleContentMode = useCallback(() => {
    setContentMode((mode) => (mode === 'view' ? 'edit' : 'view'))
  }, [])

  const SGFPanel = useCallback(
    () => (
      <Card padding={0} style={{ height: '100%', minHeight }}>
        <Stack space={0}>
          {/* SGF Panel Header */}
          <Flex
            justify="space-between"
            align="center"
            padding={3}
            style={{ borderBottom: '1px solid #e1e3e6' }}
          >
            <Flex align="center" gap={2}>
              <Text size={1} weight="medium">
                Go Board
              </Text>
              <Badge tone="primary" mode="outline">
                {sgfMode}
              </Badge>
            </Flex>
            {onSgfChange && (
              <Button
                mode="ghost"
                icon={sgfMode === 'view' ? EditIcon : PlayIcon}
                onClick={toggleSgfMode}
                title={sgfMode === 'view' ? 'Edit SGF' : 'View SGF'}
                text={sgfMode === 'view' ? 'Edit' : 'View'}
                fontSize={1}
              />
            )}
          </Flex>

          {/* SGF Content */}
          <div style={{ flex: 1, minHeight: 'calc(100% - 60px)' }}>
            <SGFViewer sgfContent={sgfContent} />
          </div>
        </Stack>
      </Card>
    ),
    [sgfContent, sgfMode, minHeight, onSgfChange, toggleSgfMode]
  )

  const ContentPanel = useCallback(
    () => (
      <Card padding={0} style={{ height: '100%', minHeight }}>
        <Stack space={0}>
          {/* Content Panel Header */}
          <Flex
            justify="space-between"
            align="center"
            padding={3}
            style={{ borderBottom: '1px solid #e1e3e6' }}
          >
            <Flex align="center" gap={2}>
              <Text size={1} weight="medium">
                Content
              </Text>
              <Badge tone="primary" mode="outline">
                {contentMode}
              </Badge>
            </Flex>
            {onPortableTextChange && (
              <Button
                mode="ghost"
                icon={contentMode === 'view' ? EditIcon : PlayIcon}
                onClick={toggleContentMode}
                title={contentMode === 'view' ? 'Edit Content' : 'View Content'}
                text={contentMode === 'view' ? 'Edit' : 'View'}
                fontSize={1}
              />
            )}
          </Flex>

          {/* Content */}
          <div style={{ flex: 1, minHeight: 'calc(100% - 60px)', overflow: 'auto' }}>
            <Stack space={4} padding={4}>
              {title && (
                <Text size={3} weight="semibold">
                  {title}
                </Text>
              )}
              <div className="prose prose-gray max-w-none">
                <PortableText value={portableTextContent} components={portableTextComponents} />
              </div>

              {/* Placeholder for editing mode */}
              {contentMode === 'edit' && onPortableTextChange && (
                <Card tone="caution" padding={3}>
                  <Text size={1}>
                    Content editing interface would be integrated here (requires Sanity Portable
                    Text editor)
                  </Text>
                </Card>
              )}
            </Stack>
          </div>
        </Stack>
      </Card>
    ),
    [portableTextContent, contentMode, title, minHeight, onPortableTextChange, toggleContentMode]
  )

  return (
    <div className={`dual-panel-editor ${className}`}>
      {/* Header with layout toggle */}
      {showHeader && (
        <Flex justify="space-between" align="center" paddingBottom={3}>
          <Text size={2} weight="medium">
            Dual Panel Editor
          </Text>
          {allowLayoutToggle && (
            <Flex gap={2} align="center">
              <Text size={1} muted>
                {layout === 'sgf-left' ? 'Board | Content' : 'Content | Board'}
              </Text>
              <Button
                mode="ghost"
                icon={layout === 'sgf-left' ? ArrowRightIcon : ArrowLeftIcon}
                onClick={toggleLayout}
                title={`Move Go board to ${layout === 'sgf-left' ? 'right' : 'left'}`}
                aria-label={`Move Go board panel to ${layout === 'sgf-left' ? 'right' : 'left'}`}
              />
            </Flex>
          )}
        </Flex>
      )}

      {/* Two-panel layout using CSS Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          minHeight,
        }}
      >
        {/* Left Panel */}
        <div className="panel-left">{layout === 'sgf-left' ? <SGFPanel /> : <ContentPanel />}</div>

        {/* Right Panel */}
        <div className="panel-right">{layout === 'sgf-left' ? <ContentPanel /> : <SGFPanel />}</div>
      </div>

      {/* Panel Labels */}
      {showLabels && (
        <Flex justify="space-between" paddingTop={2}>
          <Text size={0} muted>
            {layout === 'sgf-left' ? 'Go Board Panel' : 'Content Panel'}
          </Text>
          <Text size={0} muted>
            {layout === 'sgf-left' ? 'Content Panel' : 'Go Board Panel'}
          </Text>
        </Flex>
      )}
    </div>
  )
}
