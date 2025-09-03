import { defineField, defineType } from 'sanity'
import type { PreviewProps } from 'sanity'

export default defineType({
  name: 'dualPanel',
  title: 'Dual Panel Content',
  type: 'object',
  icon: () => '⊞○', // Grid and Go stone icon
  description: 'Side-by-side display of SGF game board and rich text content',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title for this dual panel section',
      placeholder: 'e.g. "Game Analysis" or "Opening Study"',
    }),
    defineField({
      name: 'layout',
      title: 'Panel Layout',
      type: 'string',
      description: 'Which panel should appear on the left side',
      options: {
        list: [
          { title: 'Go Board | Content', value: 'sgf-left' },
          { title: 'Content | Go Board', value: 'sgf-right' },
        ],
        layout: 'radio',
      },
      initialValue: 'sgf-left',
    }),
    defineField({
      name: 'sgf',
      title: 'Go Game (SGF)',
      type: 'object',
      description: 'Configure the Go board and game content',
      fields: [
        defineField({
          name: 'title',
          title: 'Game Title',
          type: 'string',
          description: 'Descriptive title for the game or position',
          placeholder: 'e.g. "Famous Joseki" or "Endgame Problem"',
        }),
        defineField({
          name: 'sgfContent',
          title: 'SGF Content',
          type: 'string',
          description: 'SGF game record - use the Visual Editor for interactive editing',
          components: {
            input: (props) => {
              // Dynamically import the SGF editor component
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const SGFEditor = require('../components/SGFEditor').default
              return SGFEditor(props)
            },
          },
          validation: (Rule) =>
            Rule.required()
              .min(10)
              .custom((sgf: string | undefined) => {
                if (!sgf) return 'SGF content is required'
                const trimmed = sgf.trim()
                if (!trimmed.startsWith('(;')) {
                  return 'SGF must start with "(;" - check your SGF format'
                }
                if (!trimmed.endsWith(')')) {
                  return 'SGF must end with ")" - check your SGF format'
                }
                if (!trimmed.includes('GM[1]')) {
                  return 'SGF should include GM[1] for Go game'
                }
                return true
              }),
        }),
        defineField({
          name: 'boardSize',
          title: 'Board Size',
          type: 'string',
          options: {
            list: [
              { title: '19×19 (Standard)', value: '19' },
              { title: '13×13 (Medium)', value: '13' },
              { title: '9×9 (Small)', value: '9' },
            ],
            layout: 'radio',
          },
          initialValue: '19',
        }),
        defineField({
          name: 'showControls',
          title: 'Show Game Controls',
          type: 'boolean',
          description: 'Display navigation controls for stepping through moves',
          initialValue: true,
        }),
        defineField({
          name: 'showCoordinates',
          title: 'Show Board Coordinates',
          type: 'boolean',
          description: 'Display coordinate labels around the board',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Text Content',
      type: 'array',
      description: 'Rich text content displayed alongside the Go board',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
            ],
          },
        },
        // Allow nested images within the content
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'displayOptions',
      title: 'Display Options',
      type: 'object',
      description: 'Configure how the dual panel is displayed',
      fields: [
        defineField({
          name: 'minHeight',
          title: 'Minimum Height',
          type: 'string',
          description: 'CSS height value for the panels',
          options: {
            list: [
              { title: 'Small (300px)', value: '300px' },
              { title: 'Medium (400px)', value: '400px' },
              { title: 'Large (500px)', value: '500px' },
              { title: 'Extra Large (600px)', value: '600px' },
            ],
          },
          initialValue: '400px',
        }),
        defineField({
          name: 'showLabels',
          title: 'Show Panel Labels',
          type: 'boolean',
          description: 'Display labels identifying each panel',
          initialValue: true,
        }),
        defineField({
          name: 'allowLayoutToggle',
          title: 'Allow Layout Toggle',
          type: 'boolean',
          description: 'Allow users to switch panel positions',
          initialValue: false,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  components: {
    preview: (props: PreviewProps) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DualPanelPreview = require('../components/DualPanelPreview').default
      return DualPanelPreview(props)
    },
  },
  preview: {
    select: {
      title: 'title',
      sgfTitle: 'sgf.title',
      sgfContent: 'sgf.sgfContent',
      content: 'content',
      layout: 'layout',
    },
    prepare({ title, sgfTitle, sgfContent, content, layout }) {
      return {
        title: title || 'Dual Panel Content',
        sgfTitle,
        sgfContent,
        content,
        layout,
        media: '⊞○',
      }
    },
  },
})
