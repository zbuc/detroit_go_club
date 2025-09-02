# DualPanelEditor Component

A higher-level React component that creates a two-panel editing interface for SGF (Go game) content and Portable Text content. Built on top of existing components with flexible layout options.

## Features

- **Two-panel layout** using CSS Grid
- **Switchable panel positions** (SGF left/right)
- **Individual panel modes** (view/edit for each panel)
- **Flexible configuration** with multiple display options
- **Responsive design** with configurable minimum height
- **Accessibility support** with proper ARIA labels

## Basic Usage

```tsx
import DualPanelEditor from '@/components/DualPanelEditor'

function MyComponent() {
  const [sgfContent, setSgfContent] = useState('(;FF[4]GM[1]SZ[19])')
  const [portableTextContent, setPortableTextContent] = useState([
    {
      _type: 'block',
      children: [{ _type: 'span', text: 'Your content here' }],
    },
  ])

  return (
    <DualPanelEditor
      sgfContent={sgfContent}
      portableTextContent={portableTextContent}
      title="Game Analysis"
      onSgfChange={setSgfContent}
      onPortableTextChange={setPortableTextContent}
    />
  )
}
```

## Props

| Prop                   | Type                                     | Default      | Description                                      |
| ---------------------- | ---------------------------------------- | ------------ | ------------------------------------------------ |
| `sgfContent`           | `string`                                 | -            | **Required.** SGF content to display             |
| `portableTextContent`  | `PortableTextBlock[]`                    | -            | **Required.** Portable text content              |
| `title`                | `string`                                 | -            | Optional title for content panel                 |
| `onSgfChange`          | `(sgf: string) => void`                  | -            | Callback for SGF changes (enables edit mode)     |
| `onPortableTextChange` | `(content: PortableTextBlock[]) => void` | -            | Callback for content changes (enables edit mode) |
| `className`            | `string`                                 | `''`         | Additional CSS classes                           |
| `showLabels`           | `boolean`                                | `true`       | Show panel labels at bottom                      |
| `showHeader`           | `boolean`                                | `true`       | Show header with toggle controls                 |
| `minHeight`            | `string`                                 | `'400px'`    | Minimum height for panels                        |
| `allowLayoutToggle`    | `boolean`                                | `true`       | Allow switching panel positions                  |
| `defaultLayout`        | `'sgf-left' \| 'sgf-right'`              | `'sgf-left'` | Initial panel layout                             |

## Component Structure

```
┌─────────────────────────────────────────────────┐
│                    Header                       │ ← Optional header with layout toggle
├────────────────────┬────────────────────────────┤
│                    │                            │
│    SGF Panel       │    Content Panel           │ ← Panels switch based on layout
│    (Go Board)      │    (Portable Text)         │
│                    │                            │
│    [View/Edit]     │    [View/Edit]             │ ← Individual panel modes
│                    │                            │
├────────────────────┼────────────────────────────┤
│   Panel Label      │    Panel Label             │ ← Optional labels
└────────────────────┴────────────────────────────┘
```

## Panel Features

### SGF Panel

- **View Mode**: Displays Go board using SGFViewer component
- **Edit Mode**: Placeholder for editing functionality (future enhancement)
- **Header**: Shows "Go Board" title with mode badge
- **Toggle**: Edit/View button (when `onSgfChange` provided)

### Content Panel

- **View Mode**: Renders Portable Text using configured components
- **Edit Mode**: Placeholder for Portable Text editor integration
- **Header**: Shows "Content" title with mode badge
- **Toggle**: Edit/View button (when `onPortableTextChange` provided)

## Configuration Examples

### Minimal Setup (Read-only)

```tsx
<DualPanelEditor sgfContent={sgf} portableTextContent={content} />
```

### Full-featured Setup

```tsx
<DualPanelEditor
  sgfContent={sgf}
  portableTextContent={content}
  title="Game Analysis"
  onSgfChange={handleSgfChange}
  onPortableTextChange={handleContentChange}
  defaultLayout="sgf-right"
  minHeight="500px"
  className="my-custom-editor"
/>
```

### Minimal UI (No header/labels)

```tsx
<DualPanelEditor
  sgfContent={sgf}
  portableTextContent={content}
  showHeader={false}
  showLabels={false}
  allowLayoutToggle={false}
  minHeight="300px"
/>
```

## Styling

The component uses Sanity UI components and CSS Grid. You can customize appearance through:

- **CSS Classes**: Add custom classes via `className` prop
- **CSS Grid**: The layout uses `display: grid` with `1fr 1fr` columns
- **Panel Height**: Controlled via `minHeight` prop
- **Gap**: 16px gap between panels

### Custom CSS Example

```css
.my-custom-editor {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.my-custom-editor .panel-left,
.my-custom-editor .panel-right {
  transition: transform 0.2s ease;
}
```

## Integration Notes

### With Sanity CMS

- Works seamlessly with Sanity Portable Text format
- Can be integrated into custom Sanity Studio components
- Uses existing `portableTextComponents` for consistent styling

### With SGF Content

- Leverages existing `SGFViewer` component
- Supports full SGF format specification
- Future: Could integrate with `SGFEditor` for editing capabilities

## Future Enhancements

1. **SGF Editing**: Integrate with SGFEditor component for visual editing
2. **Portable Text Editing**: Add Sanity Portable Text editor integration
3. **Responsive Layout**: Add mobile-friendly stacked layout option
4. **Panel Sizing**: Allow custom panel width ratios
5. **Multiple Layouts**: Support vertical stacking option
6. **Drag & Drop**: Panel resizing and reordering capabilities

## Related Components

- `SGFViewer`: Used for Go board display
- `SGFEditor`: Could be integrated for SGF editing
- `PortableTextComponents`: Used for content rendering
- Sanity UI: Provides the foundational UI components
