import React from 'react'
import DualPanelClient from './DualPanelClient'
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

export default function DualPanelDisplay({
  sgfContent,
  portableTextContent,
  title,
  defaultLayout = 'sgf-left',
  minHeight = '412px',
  showLabels = true,
  allowLayoutToggle = true,
  showHeader = true,
  className = '',
}: DualPanelDisplayProps) {
  const boardSize = sgfContent?.includes('SZ[13]')
    ? '13'
    : sgfContent?.includes('SZ[9]')
      ? '9'
      : '19'

  return (
    <div className={`dual-panel-wrapper ${className}`}>
      {/* SSR Foundation - Basic content layout */}
      <div className="js-fallback">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-6">
          <div className="bg-white rounded border p-4">
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Go Game Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Go Game Record</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Board Size: {boardSize}×{boardSize}
                  </p>
                  <p className="text-xs">Enable JavaScript for interactive board</p>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    View SGF Content
                  </summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto font-mono">
                    {sgfContent}
                  </pre>
                </details>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Analysis</h4>
                <div className="prose prose-gray prose-sm max-w-none">
                  <PortableText value={portableTextContent} components={portableTextComponents} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSR Enhancement - Interactive dual panel with Go board */}
      <div className="js-enhanced">
        <DualPanelClient
          sgfContent={sgfContent}
          portableTextContent={portableTextContent}
          title={title}
          defaultLayout={defaultLayout}
          minHeight={minHeight}
          showLabels={showLabels}
          allowLayoutToggle={allowLayoutToggle}
          showHeader={showHeader}
          className={className}
        />
      </div>
    </div>
  )
}
