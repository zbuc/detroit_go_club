import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from './PortableTextComponents'

interface GridItem {
  _key?: string
  span: string
  content: (PortableTextBlock | { _type: string; [key: string]: unknown })[]
}

interface GridLayoutProps {
  columns: string
  gap: string
  items: GridItem[]
}

export default function GridLayout({ columns, gap, items }: GridLayoutProps) {
  // Map gap values to Tailwind classes
  const gapClasses = {
    small: 'gap-4',
    medium: 'gap-6',
    large: 'gap-8',
  }

  // Map columns to Tailwind grid classes
  const columnClasses = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4',
  }

  // Map span values to Tailwind col-span classes
  const spanClasses = {
    '1': 'col-span-1',
    '2': 'col-span-2',
    '3': 'col-span-3',
    '4': 'col-span-4',
  }

  const gridClass = `grid ${columnClasses[columns as keyof typeof columnClasses] || 'grid-cols-2'} ${
    gapClasses[gap as keyof typeof gapClasses] || 'gap-6'
  }`

  return (
    <div className={`${gridClass} my-6`}>
      {items?.map((item, index) => {
        const spanClass = spanClasses[item.span as keyof typeof spanClasses] || 'col-span-1'

        return (
          <div key={item._key || index} className={spanClass}>
            {item.content && item.content.length > 0 && (
              <div className="h-full">
                <PortableText value={item.content} components={portableTextComponents} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
