import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gridLayout',
  title: 'Grid Layout',
  type: 'object',
  icon: () => '⊞', // Grid icon
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'string',
      description: 'Choose how many columns this grid should have',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
    }),
    defineField({
      name: 'gap',
      title: 'Grid Gap',
      type: 'string',
      description: 'Spacing between grid items',
      options: {
        list: [
          { title: 'Small (1rem)', value: 'small' },
          { title: 'Medium (1.5rem)', value: 'medium' },
          { title: 'Large (2rem)', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'items',
      title: 'Grid Items',
      type: 'array',
      description: 'Add content items to the grid. Each item will take up one column by default.',
      of: [
        {
          type: 'object',
          name: 'gridItem',
          title: 'Grid Item',
          fields: [
            defineField({
              name: 'span',
              title: 'Column Span',
              type: 'string',
              description: 'How many columns should this item span?',
              options: {
                list: [
                  { title: '1 Column', value: '1' },
                  { title: '2 Columns', value: '2' },
                  { title: '3 Columns', value: '3' },
                  { title: '4 Columns', value: '4' },
                ],
              },
              initialValue: '1',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'sgf' },
                { type: 'gridLayout' },
                {
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              span: 'span',
              content: 'content',
            },
            prepare({ span, content }) {
              const contentType = content?.[0]?._type || 'text'
              const title =
                content?.[0]?.children?.[0]?.text || content?.[0]?.title || `${contentType} content`

              return {
                title: `${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`,
                subtitle: `Spans ${span} column${span !== '1' ? 's' : ''}`,
                // media: span === '1' ? '□' : span === '2' ? '■' : '█',
                media: 'div',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      items: 'items',
    },
    prepare({ columns, items }) {
      const itemCount = items?.length || 0
      return {
        title: 'Grid Layout',
        subtitle: `${columns} columns, ${itemCount} item${itemCount !== 1 ? 's' : ''}`,
        media: 'div',
        // media: '⊞',
      }
    },
  },
})
