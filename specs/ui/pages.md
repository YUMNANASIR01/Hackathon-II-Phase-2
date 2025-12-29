# UI Pages Specification - Phase II Frontend

**Document Date**: December 28, 2024
**Phase**: II - Full-Stack Web Application
**Status**: Specification

---

## 1. Login Page

**Path**: `/login`
**Protected**: No (accessible to unauthenticated users)
**Redirect**: If user is already logged in, redirect to `/tasks`

### Layout
- Centered form container
- Logo/title at top
- Email input field
- Password input field
- Login button
- "Don't have an account? Sign up" link

### Form Fields

**Email Input**
- Type: email
- Placeholder: "Enter your email"
- Validation: Valid email format required
- Required: Yes

**Password Input**
- Type: password
- Placeholder: "Enter your password"
- Validation: Minimum 8 characters
- Required: Yes

**Login Button**
- Text: "Login"
- Disabled: While request is pending
- Loading: Show spinner while authenticating
- On Success: Redirect to `/tasks`
- On Error: Display error message in red

### Additional Elements
- Link to signup: "/register"
- Error display: Show message from backend if login fails
- Loading state: Show loading spinner on button during API call

### Responsive Design
- Mobile (320px): Full width form, padding
- Tablet (768px): Form centered with max-width 400px
- Desktop (1024px): Form centered with max-width 500px

---

## 2. Signup Page

**Path**: `/register`
**Protected**: No (accessible to unauthenticated users)
**Redirect**: If user is already logged in, redirect to `/tasks`

### Layout
- Centered form container
- Logo/title at top
- Name input field
- Email input field
- Password input field
- Confirm password input field
- Signup button
- "Already have an account? Login" link

### Form Fields

**Name Input**
- Type: text
- Placeholder: "Enter your full name"
- Validation: 1-255 characters
- Required: No

**Email Input**
- Type: email
- Placeholder: "Enter your email"
- Validation: Valid email format, must be unique
- Required: Yes
- Error: Show "Email already exists" if duplicate

**Password Input**
- Type: password
- Placeholder: "Create a password"
- Validation:
  - Minimum 8 characters
  - At least one uppercase letter (A-Z)
  - At least one number (0-9)
- Show password requirements on field focus
- Required: Yes

**Confirm Password Input**
- Type: password
- Placeholder: "Confirm your password"
- Validation: Must match password field
- Required: Yes

**Signup Button**
- Text: "Create Account"
- Disabled: While request is pending or form invalid
- Loading: Show spinner while registering
- On Success: Redirect to `/tasks`
- On Error: Display error message in red

### Additional Elements
- Password strength indicator (optional)
- Link to login: "/login"
- Error display: Show validation errors in red below fields
- Success message: Brief confirmation before redirect

### Responsive Design
- Mobile (320px): Full width form, padding
- Tablet (768px): Form centered with max-width 400px
- Desktop (1024px): Form centered with max-width 500px

---

## 3. Tasks Page (Dashboard)

**Path**: `/tasks`
**Protected**: Yes (requires authentication)
**Redirect**: If not logged in, redirect to `/login`

### Layout Structure
```
┌─────────────────────────────────────┐
│        Navbar (see below)            │
├─────────────────────────────────────┤
│                                     │
│  Welcome, [User Name]!              │
│                                     │
│  [Create Task Button]               │
│  [Filter Buttons]                   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Task List                    │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ ☐ Task Title          │  │  │
│  │  │   Description preview... │  │  │
│  │  │   [Edit] [Delete]     │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ ☑ Completed Task      │  │  │
│  │  │   [Edit] [Delete]     │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Navbar Component
- Logo/app name on left
- Welcome message: "Hi, [User Name]"
- Logout button on right
- Responsive: Hamburger menu on mobile

### Welcome Section
- Greeting: "Welcome, [User Name]!"
- Show current date
- Quick stats (optional): X tasks total, Y completed, Z pending

### Create Task Section
- Large button: "Create New Task"
- When clicked: Opens create task form/modal or navigates to create page

### Filter Controls
- Buttons for filtering:
  - "All Tasks" (default selected)
  - "Pending" (incomplete tasks)
  - "Completed" (completed tasks)
- Active filter highlighted with different background color
- Filter updates list in real-time

### Sort Controls
- Dropdown: "Sort by..."
- Options:
  - "Created Date (Newest)" (default)
  - "Created Date (Oldest)"
  - "Title (A-Z)"
  - "Title (Z-A)"

### Task List
- Displays all tasks for current user filtered/sorted as selected
- Empty state: Show message "No tasks yet. Create one to get started!"

#### Individual Task Item
```
☐ [checkbox] Task Title
  Task description preview (first 100 chars)...
  Created: 2 days ago | Status: Pending
  [Edit] [Delete]
```

**Checkbox**
- Click to toggle completion status
- Updates immediately (optimistic update)
- Visual feedback: strikethrough on completed tasks

**Edit Button**
- Opens edit task form/modal
- Pre-fills with current task data
- Shows save/cancel buttons

**Delete Button**
- Shows confirmation dialog: "Delete this task?"
- Removes task from list on confirm

### Loading States
- Initial load: Show skeleton loaders for task list
- Creating task: Show loading spinner on button
- Deleting task: Fade out task being deleted
- Updating: Show loading state on checkbox

### Error Handling
- Network error: Show banner at top: "Connection error. Retrying..."
- Failed task creation: Show toast: "Failed to create task"
- Failed task deletion: Show toast: "Failed to delete task"
- Retry button: Allow user to retry failed operations

### Empty State
- No tasks created yet
- Show message: "No tasks yet. Click 'Create New Task' to get started!"
- Show illustration (optional)

### Responsive Design
- Mobile (320px):
  - Single column layout
  - Hamburger menu for navbar
  - Full-width filter buttons
  - Task items stack vertically

- Tablet (768px):
  - Two column layout possible
  - Inline filter buttons
  - Task list with padding

- Desktop (1024px+):
  - Full layout
  - Sidebar possible (optional)
  - Wider task list
  - Better spacing

---

## 4. Create/Edit Task Page (Optional)

**Path**: `/tasks/new` (create) or `/tasks/[id]/edit` (edit)
**Protected**: Yes (requires authentication)
**Redirect**: If not logged in, redirect to `/login`

### Layout
- Navbar at top
- Form in center
- Two-column on large screens

### Form Fields

**Title Input**
- Type: text
- Placeholder: "Task title..."
- Validation: 1-255 characters required
- Required: Yes
- Character counter: Show "X/255"

**Description Input**
- Type: textarea
- Placeholder: "Add a description (optional)..."
- Validation: Max 1000 characters
- Required: No
- Character counter: Show "X/1000"

### Form Actions
- Save button: "Create Task" (new) or "Update Task" (edit)
- Cancel button: "Cancel"
- On save: Show loading spinner
- On success: Redirect to `/tasks`
- On error: Show error message

### Responsive Design
- Mobile: Full width form with padding
- Desktop: Centered form with max-width 600px

---

## 5. Navigation Flow

```
Login (/login)
  ↓ [Create Account]
  ↓ [Sign Up] →
Signup (/register)
  ↓ [Already have account?]
  ↓ [Back to Login]

Signup (/register) or Login (/login)
  ↓ [Successfully authenticate]
  ↓
Tasks (/tasks)
  ↓ [Logout button]
  ↓
Login (/login)
```

---

## 6. Global Styles & Branding

### Color Scheme
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Danger: #EF4444 (Red)
- Background: #F9FAFB (Light Gray)
- Text: #111827 (Dark Gray)
- Border: #E5E7EB (Light Border)

### Typography
- Heading 1 (h1): 2.25rem, bold
- Heading 2 (h2): 1.875rem, semibold
- Heading 3 (h3): 1.5rem, semibold
- Body text: 1rem, regular
- Small text: 0.875rem, regular

### Spacing
- Padding: 4px, 8px, 16px, 24px, 32px
- Margin: Same as padding
- Border radius: 8px (standard), 4px (small)

### Buttons
- Height: 44px (touch-friendly)
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Transitions: Smooth hover effects (200ms)

### Cards/Containers
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Padding: 16px - 24px
- Box shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))

### Forms
- Input height: 44px
- Padding: 12px
- Border: 1px solid #D1D5DB
- Focus: Border blue, box shadow
- Error: Border red, error text red
- Disabled: Gray background, no cursor

### Loading States
- Spinner: 20px, rotates 2s
- Skeleton: Animated gray background
- Pulse effect: Opacity animation

### Transitions
- Duration: 200ms
- Easing: ease-in-out
- Properties: color, background, border, opacity, transform

---

## 7. Accessibility Requirements

- Color contrast: WCAG AA minimum (4.5:1 for text)
- Touch targets: Minimum 44x44px
- Focus indicators: Visible on all interactive elements
- Form labels: Associated with inputs
- Error messages: Clear and descriptive
- Alt text: On all images
- Keyboard navigation: All pages keyboard accessible
- Screen reader: Semantic HTML, ARIA labels where needed

---

## 8. Performance Considerations

- Lazy load images
- Code splitting for pages
- Optimize bundle size
- Cache static assets
- Debounce filter/search inputs
- Optimistic updates for better UX

---

**Specification Date**: December 28, 2024
**Status**: ACTIVE
**Next Review**: During implementation
