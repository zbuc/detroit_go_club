import { PortableTextComponents } from '@portabletext/react'
import SGFViewer from './SGFViewer'
import GridLayout from './GridLayout'
import DualPanelContent from './DualPanelContent'

// Helper function to generate URL-friendly slugs from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export const portableTextComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside space-y-3 my-4 ml-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside space-y-3 my-4 ml-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-700 pl-2">{children}</li>,
    number: ({ children }) => <li className="text-gray-700 pl-2">{children}</li>,
  },
  block: {
    normal: ({ children }) => <p className="text-gray-700 mb-4">{children}</p>,
    h1: ({ children, value }) => {
      const text = value?.children?.[0]?.text || ''
      const slug = generateSlug(text)
      return (
        <h1 id={slug} className="text-3xl font-bold text-gray-900 mt-8 mb-4 scroll-mt-20">
          <a href={`#${slug}`} className="no-underline hover:text-blue-600 transition-colors">
            {children}
          </a>
        </h1>
      )
    },
    h2: ({ children, value }) => {
      const text = value?.children?.[0]?.text || ''
      const slug = generateSlug(text)
      return (
        <h2 id={slug} className="text-2xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-20">
          <a href={`#${slug}`} className="no-underline hover:text-blue-600 transition-colors">
            {children}
          </a>
        </h2>
      )
    },
    h3: ({ children, value }) => {
      const text = value?.children?.[0]?.text || ''
      const slug = generateSlug(text)
      return (
        <h3 id={slug} className="text-xl font-semibold text-gray-900 mt-5 mb-2 scroll-mt-20">
          <a href={`#${slug}`} className="no-underline hover:text-blue-600 transition-colors">
            {children}
          </a>
        </h3>
      )
    },
    h4: ({ children, value }) => {
      const text = value?.children?.[0]?.text || ''
      const slug = generateSlug(text)
      return (
        <h4 id={slug} className="text-lg font-semibold text-gray-900 mt-4 mb-2 scroll-mt-20">
          <a href={`#${slug}`} className="no-underline hover:text-blue-600 transition-colors">
            {children}
          </a>
        </h4>
      )
    },
  },
  types: {
    table: ({ value }) => {
      const { rows } = value
      if (!rows || rows.length === 0) return null

      const headerRow = rows[0]?.cells || []
      const bodyRows = rows.slice(1) || []

      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full max-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
            {headerRow.length > 0 && (
              <thead className="bg-gray-50">
                <tr>
                  {headerRow.map((cell: string, index: number) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="bg-white divide-y divide-gray-200">
              {bodyRows.map((row: { cells: string[] }, rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {(row.cells || []).map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-4 text-sm text-gray-900 border-b border-gray-200 ${cellIndex === 0 ? 'font-bold' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
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
