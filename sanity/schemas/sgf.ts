import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sgf',
  title: 'SGF Game Record',
  type: 'object',
  icon: () => '●○', // Go stones representation
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional descriptive title for this game position',
      placeholder: 'e.g. "Basic corner joseki" or "Famous game: Lee Sedol vs AlphaGo"',
    }),
    defineField({
      name: 'sgfContent',
      title: 'SGF Content',
      type: 'string',
      description:
        'Create or edit your SGF game record. Use the Visual Editor for interactive editing or Text Editor for direct SGF input.',
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
            // Basic SGF structure validation
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
      description: 'Standard board sizes or custom dimensions',
      options: {
        list: [
          { title: '19×19 (Standard)', value: '19' },
          { title: '13×13 (Medium)', value: '13' },
          { title: '9×9 (Small)', value: '9' },
          { title: 'Custom size', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: '19',
    }),
    defineField({
      name: 'customSize',
      title: 'Custom Board Dimensions',
      type: 'string',
      description: 'Format: "width:height" (e.g., "9:15" for 9 wide, 15 tall)',
      placeholder: '9:15',
      hidden: ({ parent }) => parent?.boardSize !== 'custom',
      validation: (Rule) =>
        Rule.custom((value: string | undefined, context) => {
          const parent = context.parent as { boardSize?: string }
          if (parent?.boardSize === 'custom') {
            if (!value) return 'Custom size required when board size is custom'
            const match = value.match(/^(\d+):(\d+)$/)
            if (!match) return 'Format must be "width:height" (e.g., "9:15")'
            const [, width, height] = match
            if (parseInt(width) < 5 || parseInt(height) < 5) {
              return 'Minimum board size is 5×5'
            }
            if (parseInt(width) > 52 || parseInt(height) > 52) {
              return 'Maximum board size is 52×52'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'showControls',
      title: 'Show Game Controls',
      type: 'boolean',
      description: 'Display navigation controls for stepping through the game',
      initialValue: true,
    }),
    defineField({
      name: 'showCoordinates',
      title: 'Show Board Coordinates',
      type: 'boolean',
      description: 'Display coordinate labels around the board edge',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sgfContent: 'sgfContent',
      boardSize: 'boardSize',
      customSize: 'customSize',
    },
    prepare({ title, sgfContent, boardSize, customSize }) {
      // Extract game info from SGF
      let subtitle = 'Go Game Record'

      if (sgfContent) {
        const playerWhite = sgfContent.match(/PW\[([^\]]*)\]/)
        const playerBlack = sgfContent.match(/PB\[([^\]]*)\]/)

        if (playerWhite && playerBlack) {
          subtitle = `${playerBlack[1]} vs ${playerWhite[1]}`
        } else if (playerWhite || playerBlack) {
          const player = (playerWhite || playerBlack)?.[1]
          subtitle = `Game with ${player}`
        }

        // Add board size info
        const size = boardSize === 'custom' && customSize ? customSize : boardSize
        if (size) {
          subtitle += ` (${size}×${size === customSize ? customSize.split(':')[1] : size})`
        }
      }

      return {
        title: title || 'SGF Game Record',
        subtitle,
      }
    },
  },
})
