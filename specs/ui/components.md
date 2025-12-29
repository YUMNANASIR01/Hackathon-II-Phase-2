# UI Components Specification - Phase II Frontend

**Document Date**: December 28, 2024
**Phase**: II - Full-Stack Web Application
**Status**: Specification

---

## 1. Layout Components

### Navbar Component

**Path**: `frontend/components/layout/Navbar.tsx`
**Used**: On all pages after authentication

**Props**:
```typescript
interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
}
```

**Features**:
- App logo/name on left
- User name display: "Hi, [Name]"
- Logout button on right
- Responsive hamburger menu on mobile

**States**:
- Loading: Show skeleton while user data loads
- Authenticated: Show user name and logout
- Mobile: Hamburger menu collapses navigation

**Style**:
- Height: 64px
- Background: White
- Border-bottom: 1px solid #E5E7EB
- Shadow: Subtle

**Responsive**:
- Mobile: Hamburger menu, vertical layout
- Desktop: Horizontal layout, full navigation

---

### Sidebar Component (Optional)

**Path**: `frontend/components/layout/Sidebar.tsx`
**Used**: Optional on desktop layouts

**Features**:
- Navigation links
- Collapsible on smaller screens
- Active link highlighting

---

### Layout Wrapper

**Path**: `frontend/components/layout/Layout.tsx`
**Used**: Wraps authenticated pages

**Features**:
- Renders Navbar
- Renders page content
- Responsive container with proper padding

---

## 2. Authentication Components

### LoginForm Component

**Path**: `frontend/components/auth/LoginForm.tsx`
**Used**: `/login` page

**Props**:
```typescript
interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Features**:
- Email input
- Password input
- Login button
- Error message display
- Link to signup
- Form validation before submit

**Validation**:
- Email: Valid format
- Password: Non-empty
- Show error messages inline

**Loading**:
- Disable button while submitting
- Show spinner on button

**Error Handling**:
- Display error message in red
- Clear error on input change
- Show specific messages: "Invalid credentials", "User not found", etc.

---

### SignupForm Component

**Path**: `frontend/components/auth/SignupForm.tsx`
**Used**: `/register` page

**Props**:
```typescript
interface SignupFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Features**:
- Name input (optional)
- Email input
- Password input with requirements
- Confirm password input
- Signup button
- Link to login
- Password requirements display

**Validation**:
- Email: Valid format, unique
- Password:
  - Min 8 characters
  - At least one uppercase (A-Z)
  - At least one number (0-9)
- Confirm password: Must match
- Show validation errors

**Password Requirements Display**:
- ✓ At least 8 characters
- ✓ At least one uppercase letter
- ✓ At least one number
- Update in real-time as user types

---

### LogoutButton Component

**Path**: `frontend/components/auth/LogoutButton.tsx`
**Used**: In Navbar

**Props**:
```typescript
interface LogoutButtonProps {
  onLogout: () => void;
  isLoading?: boolean;
}
```

**Features**:
- Shows confirmation dialog
- Calls logout function
- Shows loading state
- Redirects to login

---

## 3. Task Components

### TaskList Component

**Path**: `frontend/components/tasks/TaskList.tsx`
**Used**: `/tasks` page

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  filter?: 'all' | 'pending' | 'completed';
  sortBy?: 'created' | 'title';
  onDeleteTask: (id: number) => Promise<void>;
  onEditTask: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
}
```

**Features**:
- Renders list of TaskItem components
- Shows empty state if no tasks
- Shows loading skeleton
- Handles pagination (optional)

**Empty State**:
- Message: "No tasks yet. Create one to get started!"
- Icon: Plus icon
- Clickable: Navigate to create task

**Loading State**:
- Show skeleton loaders
- 3-5 skeleton items

---

### TaskItem Component

**Path**: `frontend/components/tasks/TaskItem.tsx`
**Used**: Inside TaskList

**Props**:
```typescript
interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  isDeleting?: boolean;
}
```

**Layout**:
```
[☐] Task Title
    Task description preview...
    Created: 2 days ago | Status: Pending
    [Edit] [Delete]
```

**Features**:
- Checkbox to toggle completion
- Title (strikethrough if completed)
- Description preview (100 chars)
- Created date
- Status badge
- Edit button
- Delete button
- Hover effects

**Checkbox**:
- Updates immediately (optimistic)
- Shows loading spinner while updating
- Strikethrough on complete
- Gray out text on complete

**Edit Button**:
- Icon: Pencil
- Opens edit form/modal
- Or navigates to edit page

**Delete Button**:
- Icon: Trash
- Shows confirmation dialog
- Removes item on confirm
- Handles errors gracefully

---

### TaskForm Component

**Path**: `frontend/components/tasks/TaskForm.tsx`
**Used**: Create/Edit task form or modal

**Props**:
```typescript
interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  initialData?: Task;
  isLoading?: boolean;
  error?: string;
  onCancel?: () => void;
}
```

**Features**:
- Title input (required)
- Description textarea (optional)
- Submit button (Create/Update)
- Cancel button
- Character counters
- Validation errors

**Title Input**:
- Placeholder: "Task title..."
- Required: Yes
- Max: 255 characters
- Show counter: "X/255"

**Description Input**:
- Placeholder: "Add a description..."
- Optional
- Max: 1000 characters
- Show counter: "X/1000"

**Buttons**:
- Submit: "Create Task" or "Update Task"
- Cancel: "Cancel"
- Submit disabled while loading or empty

---

### TaskFilters Component

**Path**: `frontend/components/tasks/TaskFilters.tsx`
**Used**: `/tasks` page

**Props**:
```typescript
interface TaskFiltersProps {
  activeFilter?: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  sortBy?: 'created' | 'title';
  onSortChange: (sort: 'created' | 'title') => void;
}
```

**Features**:
- Filter buttons: All, Pending, Completed
- Sort dropdown
- Active filter highlighted
- Real-time filtering

**Filter Buttons**:
- All
- Pending
- Completed
- Active: Bold, blue background
- Inactive: Gray

**Sort Dropdown**:
- Created (Newest) - default
- Created (Oldest)
- Title (A-Z)
- Title (Z-A)

---

### CreateTaskButton Component

**Path**: `frontend/components/tasks/CreateTaskButton.tsx`
**Used**: `/tasks` page

**Props**:
```typescript
interface CreateTaskButtonProps {
  onClick: () => void;
}
```

**Features**:
- Large primary button
- Text: "Create New Task"
- Icon: Plus sign
- Navigates to create page or opens modal

---

## 4. Shared Components

### Button Component

**Path**: `frontend/components/shared/Button.tsx`
**Used**: Throughout app

**Props**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}
```

**Variants**:
- Primary (blue): Main actions
- Secondary (gray): Secondary actions
- Danger (red): Destructive actions

**Sizes**:
- Small: 32px height
- Medium: 40px height
- Large: 44px height (touch-friendly)

**Features**:
- Show loading spinner when loading
- Disable on loading or when disabled prop
- Smooth transitions
- Hover effects

---

### Input Component

**Path**: `frontend/components/shared/Input.tsx`
**Used**: Forms

**Props**:
```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  maxLength?: number;
  showCounter?: boolean;
}
```

**Features**:
- Label above input
- Error message below
- Character counter (if maxLength)
- Required indicator
- Focus states
- Error styling (red border)

---

### Textarea Component

**Path**: `frontend/components/shared/Textarea.tsx`
**Used**: Task description

**Props**:
```typescript
interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
}
```

**Features**:
- Same as Input but for multi-line
- Auto-expand (optional)
- Character counter

---

### Card Component

**Path**: `frontend/components/shared/Card.tsx`
**Used**: Container for content

**Props**:
```typescript
interface CardProps {
  children: ReactNode;
  padding?: 'small' | 'medium' | 'large';
  shadow?: boolean;
}
```

**Features**:
- White background
- Border and shadow
- Configurable padding
- Rounded corners

---

### Modal Component

**Path**: `frontend/components/shared/Modal.tsx`
**Used**: Confirmations, forms

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}
```

**Features**:
- Backdrop overlay
- Centered content
- Close button
- Action buttons (confirm/cancel)
- Keyboard close (ESC)

---

### ConfirmDialog Component

**Path**: `frontend/components/shared/ConfirmDialog.tsx`
**Used**: Deletion confirmations

**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}
```

**Features**:
- Modal with question
- Confirm and cancel buttons
- Danger styling (red) if isDangerous
- Requires explicit confirmation

---

### Toast Component

**Path**: `frontend/components/shared/Toast.tsx`
**Used**: Notifications

**Props**:
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}
```

**Features**:
- Auto-dismiss after duration
- Different colors for types
- Slide in/out animation
- Can be dismissed manually

**Types**:
- Success: Green
- Error: Red
- Info: Blue

---

### LoadingSpinner Component

**Path**: `frontend/components/shared/LoadingSpinner.tsx`
**Used**: Loading states

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```

**Features**:
- Rotating spinner animation
- Multiple sizes
- Custom color support

---

### ErrorBoundary Component

**Path**: `frontend/components/shared/ErrorBoundary.tsx`
**Used**: Wraps pages

**Features**:
- Catches React errors
- Shows fallback UI
- Logs errors
- Retry button

---

### SkeletonLoader Component

**Path**: `frontend/components/shared/SkeletonLoader.tsx`
**Used**: Loading states

**Props**:
```typescript
interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  count?: number;
  circle?: boolean;
}
```

**Features**:
- Gray animated background
- Pulsing effect
- Configurable size and count

---

## 5. Component Organization

### Directory Structure
```
frontend/components/
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── Layout.tsx
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── LogoutButton.tsx
├── tasks/
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── TaskForm.tsx
│   ├── TaskFilters.tsx
│   └── CreateTaskButton.tsx
└── shared/
    ├── Button.tsx
    ├── Input.tsx
    ├── Textarea.tsx
    ├── Card.tsx
    ├── Modal.tsx
    ├── ConfirmDialog.tsx
    ├── Toast.tsx
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── SkeletonLoader.tsx
```

---

## 6. Component Patterns

### All Components Follow These Patterns

**TypeScript Types**:
```typescript
// Always export interfaces
export interface ComponentProps {
  // explicit prop types
}

export function Component({ prop }: ComponentProps) {
  // implementation
}
```

**Props**:
- All props typed explicitly
- No `any` types
- Optional props marked with `?`

**Styling**:
- Use Tailwind CSS classes
- No inline styles
- No CSS modules unless necessary
- Follow BEM conventions in class names

**Accessibility**:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators

**Performance**:
- Use `memo()` for components that don't change often
- Lazy load heavy components
- Avoid unnecessary re-renders

---

**Specification Date**: December 28, 2024
**Status**: ACTIVE
**Next Review**: During implementation
