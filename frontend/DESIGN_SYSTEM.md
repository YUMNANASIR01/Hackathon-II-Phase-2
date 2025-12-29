# Design System - Professional Dark Theme

## Color System

### Primary Colors (Purple)
- **50**: #f5f3ff - Lightest
- **100**: #ede9fe
- **200**: #ddd6fe
- **300**: #c4b5fd
- **400**: #a78bfa
- **500**: #8b5cf6
- **600**: #7c3aed - **Main Brand Color**
- **700**: #6d28d9
- **800**: #5b21b6
- **900**: #4c1d95 - Darkest

### Background Colors
- **#0b0b0f** - Main background (very dark)
- **#111827** - Card backgrounds
- **#1f2937** - Borders and dividers
- **gray-900** - Section backgrounds
- **gray-950** - Gradient endpoints

### Text Colors
- **#e5e7eb** - Primary text (light gray)
- **#9ca3af** - Secondary text (muted gray)
- **#6b7280** - Tertiary text (dimmed gray)

### Semantic Colors
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f59e0b (Yellow)
- **Info**: #3b82f6 (Blue)

## Typography

### Font Family
- System: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.
- All sans-serif, system fonts for performance

### Font Sizes & Line Heights
- **xs**: 0.75rem (12px) - line-height: 1rem
- **sm**: 0.875rem (14px) - line-height: 1.25rem
- **base**: 1rem (16px) - line-height: 1.5rem
- **lg**: 1.125rem (18px) - line-height: 1.75rem
- **xl**: 1.25rem (20px) - line-height: 1.75rem
- **2xl**: 1.5rem (24px) - line-height: 2rem
- **3xl**: 1.875rem (30px) - line-height: 2.25rem
- **4xl**: 2.25rem (36px) - line-height: 2.5rem

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing Scale

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)

## Component Styles

### Buttons

#### Primary Button
- Background: #7c3aed
- Text: White
- Hover: #6d28d9
- Focus: Ring #7c3aed with dark offset
- Active: scale-95
- Shadow: md → lg on hover

#### Secondary Button
- Background: #1f2937
- Text: #e5e7eb
- Border: #374151
- Hover: #111827
- Focus: Ring gray-600

#### Ghost Button
- Background: Transparent
- Text: #a78bfa
- Hover: #1f2937
- Focus: Ring #7c3aed

#### Danger Button
- Background: #ef4444
- Text: White
- Hover: #dc2626
- Focus: Ring #ef4444

### Form Elements

#### Input
- Background: #111827
- Border: #374151
- Text: #e5e7eb
- Placeholder: #6b7280
- Focus: Ring #7c3aed, background #0f172a
- Error: Border #ef4444, ring #ef4444
- Disabled: Background #1f2937, opacity 50%

#### Textarea
- Same as Input
- Min-height: 120px
- Resizable vertically

#### Labels
- Color: #e5e7eb
- Font-weight: 500
- Margin-bottom: 0.5rem

### Cards
- Background: #111827
- Border: #1f2937
- Shadow: lg
- Hover: shadow-xl, border #374151
- Border-radius: 8px

### Modals
- Background: #111827
- Border: #1f2937
- Shadow: 2xl
- Backdrop: rgba(0,0,0,0.6)
- Overlay opacity: 60%

### Badges & Indicators
- Success: bg-green-500 text-white
- Error: bg-red-500 text-white
- Warning: bg-yellow-500 text-white
- Info: bg-blue-500 text-white

## Shadows

### Dark Mode Shadows
- **xs**: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
- **sm**: 0 1px 3px 0 rgba(0, 0, 0, 0.4)
- **md**: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
- **lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
- **xl**: 0 20px 25px -5px rgba(0, 0, 0, 0.6)
- **2xl**: 0 25px 50px -12px rgba(0, 0, 0, 0.6)

## Border Radius

- **Default**: 8px (rounded-lg)
- **Cards**: 12px (rounded-lg)
- **Buttons**: 8px (rounded-lg)
- **Large Components**: 16px

## Transitions

- **Duration**: 200ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Properties**: all
- **Time function**: ease

## Animations

### Fade In
```
from: opacity 0
to: opacity 1
duration: 300ms
```

### Slide In (Down)
```
from: translate Y -10px, opacity 0
to: translate Y 0, opacity 1
duration: 300ms
```

### Spin
```
360° rotation
duration: 2s
infinite
```

## Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Spacing & Layout

### Container
- Max-width: 1280px (max-w-7xl)
- Padding: 1rem (px-4) on mobile, 1.5rem (px-6) on sm, 2rem (px-8) on lg

### Page Padding
- Vertical: 3rem (py-12) on desktop, 2rem (py-8) on mobile
- Horizontal: Container managed

### Component Gaps
- Small components: 0.5rem (gap-2)
- Medium components: 1rem (gap-4)
- Large components: 1.5rem (gap-6)

## Interaction States

### Hover
- Shadows increase
- Colors lighten slightly
- Scale effects on interactive elements (buttons: 95%)

### Focus
- Purple ring outline (#7c3aed)
- Dark offset for visibility
- 2px ring width

### Active
- Button scale: 95%
- Color slightly darker
- Provides tactile feedback

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- No hover effects

## Accessibility

- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Visible purple rings
- **Touch Targets**: 44px minimum height
- **Text**: 16px minimum on mobile
- **Labels**: All form inputs have labels

## Usage Examples

### Button Primary
```tsx
<Button variant="primary" size="md">
  Create Task
</Button>
```

### Input with Label
```tsx
<Input
  label="Task Title"
  placeholder="Enter task title"
  error={errors.title}
/>
```

### Card Component
```tsx
<Card className="p-6">
  Card content here
</Card>
```

### Modal
```tsx
<Modal isOpen={isOpen} title="Delete Task" onClose={onClose}>
  Are you sure?
</Modal>
```

## Color Accessibility

- Text on dark backgrounds uses light colors (gray-100, gray-200, gray-300)
- Interactive elements use purple (#7c3aed) for consistency
- Error states clearly marked with red
- Success states marked with green
- All colors meet WCAG AA standards for contrast
