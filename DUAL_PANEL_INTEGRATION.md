# Dual Panel Editor - Sanity CMS Integration

The DualPanelEditor has been successfully integrated into the Sanity CMS system, allowing content editors to create rich, interactive layouts combining Go board positions with explanatory text.

## 🎯 What's Been Added

### New Schema Type: `dualPanel`

A new content block type that combines:

- **SGF Game Content**: Interactive Go board with game positions
- **Rich Text Content**: Formatted text with markdown capabilities
- **Layout Options**: Left/right positioning and display controls

### Integration Points

- ✅ **Page Content**: Available in the main page content editor
- ✅ **Grid Layout**: Can be used within grid layout cells
- ✅ **Portable Text**: Renders automatically in all content areas
- ✅ **Studio Preview**: Live preview in Sanity Studio interface

## 🚀 How to Use in Sanity Studio

### 1. Creating Dual Panel Content

1. **Navigate to a Page** in Sanity Studio
2. **Add Content Block** → Select "Dual Panel Content" (⊞○ icon)
3. **Configure the Content**:

   **Basic Info:**
   - **Section Title**: Optional title for the entire section
   - **Panel Layout**: Choose "Go Board | Content" or "Content | Go Board"

   **Go Game Configuration:**
   - **Game Title**: Descriptive title for the game/position
   - **SGF Content**: Use the integrated SGF editor (Visual + Text modes)
   - **Board Size**: 19×19, 13×13, or 9×9
   - **Display Options**: Controls and coordinates

   **Text Content:**
   - **Rich Text Editor**: Full formatting capabilities
   - **Lists**: Bullet points and numbered lists
   - **Links**: External links with optional new tab
   - **Images**: Inline images with captions
   - **Styles**: Headers, quotes, emphasis

   **Display Options:**
   - **Minimum Height**: Panel height (300px - 600px)
   - **Show Panel Labels**: Identify which panel is which
   - **Allow Layout Toggle**: Let users switch panel positions

### 2. Example Use Cases

**Game Analysis:**

```
Title: "Famous Endgame Position"
Layout: Go Board | Content
SGF: Complex endgame position
Content: "This position from the 1995 Honinbo title match shows..."
```

**Teaching Content:**

```
Title: "Corner Joseki Study"
Layout: Content | Go Board
SGF: Basic joseki sequence
Content: Step-by-step explanation with bullet points
```

**Historical Games:**

```
Title: "Lee Sedol vs AlphaGo - Move 37"
SGF: Famous game position
Content: Analysis of the surprising shoulder hit
```

## 🔧 Technical Implementation

### Schema Structure

```typescript
{
  _type: 'dualPanel',
  title?: string,
  layout: 'sgf-left' | 'sgf-right',
  sgf: {
    title?: string,
    sgfContent: string, // Uses SGFEditor component
    boardSize: '19' | '13' | '9',
    showControls: boolean,
    showCoordinates: boolean
  },
  content: PortableTextBlock[], // Rich text content
  displayOptions: {
    minHeight: string,
    showLabels: boolean,
    allowLayoutToggle: boolean
  }
}
```

### Component Hierarchy

```
DualPanelContent (Frontend)
├── DualPanelEditor (Core component)
│   ├── SGFViewer (Go board display)
│   └── PortableText (Content rendering)
└── DualPanelPreview (Studio preview)
```

### File Structure

```
sanity/
├── schemas/
│   ├── dualPanel.ts          # Schema definition
│   ├── page.ts               # Updated with dualPanel
│   ├── gridLayout.ts         # Updated with dualPanel
│   └── index.ts              # Schema export
└── components/
    └── DualPanelPreview.tsx  # Studio preview

src/components/
├── DualPanelEditor.tsx       # Core component
├── DualPanelContent.tsx      # Frontend wrapper
├── DualPanelEditorExample.tsx # Usage examples
└── PortableTextComponents.tsx # Updated with dualPanel
```

## 🎨 Frontend Rendering

The dual panel content automatically renders on the frontend using the `DualPanelEditor` component. Features include:

- **Responsive Layout**: CSS Grid-based two-column layout
- **Interactive Go Board**: Full SGF playback with controls
- **Rich Text Rendering**: Styled content with the existing theme
- **Layout Flexibility**: Configurable panel positioning
- **Accessibility**: Proper ARIA labels and semantic structure

## 💡 Content Strategy Tips

### Best Practices

**For Game Analysis:**

- Use descriptive titles that indicate the game phase or theme
- Place the Go board on the left for natural reading flow
- Break complex analysis into numbered points
- Include player names and game context in the text

**For Educational Content:**

- Start with overview text, then show the position
- Use bullet points for key concepts
- Place content on the left, board on the right for instructional flow
- Keep text concise - the board is the focus

**For Historical Content:**

- Include game metadata (date, event, players)
- Use quotes and narrative style for storytelling
- Board position should support the narrative
- Consider multiple dual panels for game progression

### Content Guidelines

**SGF Content:**

- Always validate SGF format in the editor
- Include game information (PW, PB, DT, etc.) when possible
- Use meaningful comments in the SGF for context
- Test playback controls before publishing

**Text Content:**

- Keep paragraphs concise for side-by-side reading
- Use headers to break up longer explanations
- Include relevant links to external resources
- Add alt text for any embedded images

## 🔮 Future Enhancements

**Planned Features:**

- **Mobile Responsive**: Stacked layout for mobile devices
- **Panel Resizing**: Adjustable column widths
- **Multiple Layouts**: Vertical stacking option
- **SGF Editing**: Interactive editing on the frontend
- **Content Sync**: Highlight board positions based on text selection

**Integration Opportunities:**

- **Game Collections**: Link related dual panels
- **Progressive Disclosure**: Expandable analysis sections
- **Interactive Diagrams**: Click-to-show variations
- **Social Features**: Comments and discussions per position

## 📋 Troubleshooting

**Common Issues:**

**SGF Not Displaying:**

- Check SGF format validation in the schema
- Ensure SGF includes required GM[1] property
- Verify board size matches SGF content

**Content Not Rendering:**

- Confirm PortableText content is not empty
- Check for missing required fields in schema
- Validate rich text formatting

**Studio Preview Issues:**

- Preview is intentionally simplified for performance
- Full functionality available on frontend only
- Use preview for layout and content verification

**Layout Problems:**

- Minimum height settings affect mobile display
- Panel labels can be hidden for cleaner look
- Layout toggle setting controls user interaction

The Dual Panel Editor provides a powerful, flexible way to create engaging Go content that combines visual game positions with rich explanatory text, perfect for analysis, teaching, and storytelling in the Go community.
