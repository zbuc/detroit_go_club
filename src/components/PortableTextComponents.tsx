import { PortableTextComponents } from '@portabletext/react'
import SGFViewer from './SGFViewer'
import GridLayout from './GridLayout'
import DualPanelContent from './DualPanelContent'

export const portableTextComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-700">{children}</li>,
    number: ({ children }) => <li className="text-gray-700">{children}</li>,
  },
  block: {
    normal: ({ children }) => <p className="text-gray-700 mb-4">{children}</p>,
  },
  types: {
    sgf: ({ value }) => (
      <SGFViewer
        sgfContent={value.sgfContent}
        title={value.title}
        boardSize={value.boardSize}
        customSize={value.customSize}
        showControls={value.showControls}
        showCoordinates={value.showCoordinates}
      />
    ),
    gridLayout: ({ value }) => (
      <GridLayout columns={value.columns} gap={value.gap} items={value.items} />
    ),
    dualPanel: ({ value }) => <DualPanelContent data={value} />,
  },
}
