# Todo App Frontend - Next.js 16+

A professional, production-ready Next.js 16+ frontend application for managing tasks with modern authentication and real-time API integration.

## Features

- **🔐 Secure Authentication**: Better Auth integration with JWT tokens
- **📱 Responsive Design**: Mobile-first design for all devices
- **⚡ Type-Safe**: Full TypeScript with strict mode
- **🎨 Professional UI**: Tailwind CSS with custom components
- **🔄 Real-time Sync**: Automatic API synchronization
- **✨ Smooth Animations**: Professional transitions and effects
- **🛡️ Error Handling**: Comprehensive error management
- **📦 Optimized**: Server components, automatic code splitting

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.0+
- **HTTP Client**: Axios with interceptors
- **Validation**: Zod for runtime validation
- **State Management**: React hooks + Custom hooks
- **Authentication**: Better Auth + JWT

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Update .env.local** with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_AUTH_SECRET=admin1234
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Protected pages
│   │   └── tasks/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   ├── auth/                    # Auth forms
│   ├── tasks/                   # Task components
│   └── shared/                  # Shared UI components
│
├── lib/                         # Utilities
│   ├── api.ts                   # API client
│   ├── hooks.ts                 # Custom hooks
│   ├── types.ts                 # TypeScript types
│   ├── validation.ts            # Zod schemas
│   └── utils.ts                 # Helper functions
│
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
└── next.config.js              # Next.js config
```

## Key Features

### Authentication

- Email/password signup and signin
- JWT token management
- Protected routes with automatic redirect
- Session management
- Toast notifications

### Task Management

- Create, read, update, delete tasks
- Mark tasks as complete/pending
- Filter by status (all, pending, completed)
- Sort by created date, title, or updated date
- Real-time UI updates

### Form Validation

- Client-side validation with Zod
- Real-time error messages
- Responsive error handling
- Type-safe form data

### Professional UI

- Responsive navigation bar
- Beautiful card layouts
- Loading spinners
- Modal dialogs
- Toast notifications
- Smooth animations

## API Integration

All API calls go through the centralized `/lib/api.ts` client which:

- Automatically adds JWT authentication headers
- Handles token refresh
- Provides consistent error handling
- Redirects to login on 401 responses

Example:

```typescript
import { tasksApi } from '@/lib/api'

// List tasks
const response = await tasksApi.list('all', 'created', 20, 0)

// Create task
const task = await tasksApi.create({
  title: 'My Task',
  description: 'Task description'
})

// Update task
const updated = await tasksApi.update(1, {
  completed: true
})

// Delete task
await tasksApi.delete(1)
```

## Custom Hooks

### useAuth()

Manage authentication state and operations:

```typescript
const {
  user,
  isLoading,
  isAuthenticated,
  signUp,
  signIn,
  signOut,
  refreshToken,
  error
} = useAuth()
```

### useTasks()

Manage task data:

```typescript
const {
  tasks,
  isLoading,
  error,
  total,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTask
} = useTasks()
```

### useToast()

Show notifications:

```typescript
const { toasts, showToast, removeToast } = useToast()

showToast('Success!', 'success', 3000)
showToast('Error occurred', 'error')
showToast('Info message', 'info')
```

### useDebounce()

Debounce values:

```typescript
const debouncedValue = useDebounce(searchTerm, 300)
```

### useLocalStorage()

Persist state:

```typescript
const [value, setValue] = useLocalStorage('key', initialValue)
```

## TypeScript

Full type safety with strict mode enabled. No `any` types allowed.

Key types:

- `User` - User profile
- `Task` - Task item
- `AuthResponse` - Authentication response
- `ApiError` - API error format
- All component props are fully typed

## Styling

Uses Tailwind CSS with custom configuration including:

- Custom color palette (primary, accent)
- Extended spacing and shadows
- Custom animations and transitions
- Responsive utilities
- Dark mode support (CSS variables)

## Error Handling

Comprehensive error handling:

- Form validation errors
- API error messages
- Network error handling
- Automatic retry logic
- User-friendly error messages

## Performance Optimizations

- Server components by default
- Client components only when needed
- Automatic code splitting
- Image optimization
- Font optimization
- CSS minification

## Security

- JWT tokens in httpOnly cookies (via Better Auth)
- CSRF protection
- User isolation at API level
- Input validation
- SQL injection prevention via ORM
- XSS prevention via React

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Type all props and variables
- Use Tailwind CSS for styling
- Follow component naming conventions
- Extract magic strings to constants

### Component Patterns

```typescript
// Server component (default)
export default function MyPage() {
  return <div>Content</div>
}

// Client component (when needed)
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>...</div>
}
```

### API Calls

Always use the centralized API client:

```typescript
import { tasksApi } from '@/lib/api'

// ✓ Good
const tasks = await tasksApi.list()

// ✗ Bad - Don't use fetch directly
const tasks = await fetch('/api/tasks')
```

## Testing

Run tests:

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Linting

```bash
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript
```

## Build & Deployment

### Local Build

```bash
npm run build    # Build application
npm start        # Start production server
```

### Production Deployment

The frontend is optimized for Vercel:

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically on push

**Environment Variables (Production)**:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AUTH_SECRET=your-production-secret
```

## Troubleshooting

### CORS errors
- Check `NEXT_PUBLIC_API_URL` matches backend origin
- Verify backend CORS configuration
- Check that JWT token is being sent

### 401 Unauthorized
- Verify JWT token is stored correctly
- Check token hasn't expired
- Verify token secret matches backend

### Build errors
- Run `npm install` again
- Clear `.next` directory: `rm -rf .next`
- Check TypeScript: `npm run type-check`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)
- [Axios Documentation](https://axios-http.com)

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
