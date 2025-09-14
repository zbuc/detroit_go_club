import SGFViewerClient from './SGFViewerClient'

interface SGFViewerProps {
  sgfContent: string
  title?: string
  boardSize?: string
  customSize?: string
  showControls?: boolean
  showCoordinates?: boolean
  showVariants?: boolean | number
  className?: string
}

export default function SGFViewer({
  sgfContent,
  title,
  boardSize = '19',
  customSize,
  showControls = true,
  showCoordinates = true,
  showVariants = true,
  className = '',
}: SGFViewerProps) {
  if (!sgfContent) {
    return (
      <div className="sgf-error p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        <p>No SGF content provided</p>
      </div>
    )
  }

  return (
    <div className={`sgf-viewer-wrapper ${className}`}>
      {/* SSR Foundation - Basic fallback always renders */}
      <div className="js-fallback">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="mb-4">
            {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
            <p className="text-sm text-gray-600 mb-2">Go Game Record</p>
            <p className="text-xs text-gray-500">
              Board Size: {boardSize === 'custom' && customSize ? customSize : boardSize}×
              {boardSize === 'custom' && customSize ? customSize : boardSize}
            </p>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              View SGF Content
            </summary>
            <pre className="text-xs bg-white p-3 mt-2 border rounded overflow-x-auto font-mono">
              {sgfContent}
            </pre>
          </details>

          <div className="mt-4 text-sm text-gray-600">
            <p>Enable JavaScript to view the interactive Go board.</p>
          </div>
        </div>
      </div>

      {/* CSR Enhancement - Interactive Go board */}
      <div className="js-enhanced">
        <SGFViewerClient
          sgfContent={sgfContent}
          title={title}
          boardSize={boardSize}
          customSize={customSize}
          showControls={showControls}
          showCoordinates={showCoordinates}
          showVariants={showVariants}
          className={className}
        />
      </div>
    </div>
  )
}
