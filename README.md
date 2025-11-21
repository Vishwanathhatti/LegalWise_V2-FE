# LegalWise Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC)](https://tailwindcss.com/)

Modern, responsive frontend for the LegalWise platform built with Next.js 15, React, TypeScript, and Tailwind CSS.

## ✨ Features

### User Interface
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dark Mode Support** - Theme switching with system preference detection
- **Modern UI Components** - Radix UI primitives with custom styling
- **Real-time Updates** - Socket.IO integration for live messaging and notifications
- **Type Safety** - Full TypeScript implementation
- **Optimized Performance** - Next.js 15 App Router with server components

### Key Features
- **User Dashboard** - Activity statistics and quick access to features
- **Lawyer Matchmaking** - Search and filter verified lawyers
- **Direct Messaging** - Real-time chat with lawyers
- **AI Legal Chatbot** - Intelligent legal assistance
- **Community Forum** - Discussion posts, comments, and engagement
- **Document Management** - Upload, view, and manage legal documents
- **User Profiles** - Comprehensive profile management
- **Admin Dashboard** - Content moderation and system management

## 📋 Prerequisites

- **Node.js:** 18.0.0 or higher
- **npm/yarn:** Latest version
- **Backend API:** Running on `http://localhost:3000`

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Configuration
Create a `.env.local` file in the Frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:3001`

### 4. Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
Frontend/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── chatbot/             # AI chatbot interface
│   ├── community/           # Community forum
│   │   ├── post/[id]/
│   │   ├── create/
│   │   └── page.tsx
│   ├── dashboard/           # User dashboard
│   ├── matchmaking/         # Lawyer search and matching
│   ├── messages/            # Direct messaging
│   ├── profile/             # User profile pages
│   ├── summarizer/          # Document management
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── layout/             # Layout components
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── providers/          # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── AdminAuthProvider.tsx
│   │   ├── SocketProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                 # UI components (Radix UI)
│       ├── accordion.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       └── ...
├── lib/                     # Utilities and helpers
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
├── public/                  # Static assets
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json
└── README.md
```

## 🎨 UI Components

### Radix UI Components
- **Accordion** - Collapsible content sections
- **Avatar** - User profile images with fallbacks
- **Button** - Interactive buttons with variants
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Contextual menus
- **Input** - Form input fields
- **Label** - Form labels
- **Select** - Dropdown selects
- **Tabs** - Tabbed interfaces
- **Toast** - Notification toasts
- **Tooltip** - Contextual hints

### Custom Components
- **Navbar** - Responsive navigation with role-based menu items
- **ProtectedRoute** - Authentication and authorization wrapper
- **LoadingSpinner** - Loading states
- **ErrorBoundary** - Error handling

## 🔌 API Integration

### API Client (`lib/api.ts`)
Centralized API client with:
- **Token Management** - Automatic token inclusion
- **Error Handling** - Consistent error responses
- **Type Safety** - TypeScript interfaces
- **Request/Response Interceptors**

### API Methods

#### User APIs
- `register()` - User registration
- `login()` - User login
- `logout()` - User logout
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile
- `getUserStats()` - Get dashboard stats
- `forgotPassword()` - Request password reset
- `resetPassword()` - Reset password

#### Lawyer APIs
- `registerLawyer()` - Register as lawyer
- `getLawyerProfile()` - Get lawyer profile
- `updateLawyerProfile()` - Update lawyer profile
- `getAllLawyers()` - Get all lawyers
- `rateLawyer()` - Rate a lawyer

#### DM APIs
- `sendDMRequest()` - Send DM request
- `getPendingDMRequests()` - Get pending requests
- `respondToDMRequest()` - Accept/reject request
- `getUserDMs()` - Get all conversations
- `sendDMMessage()` - Send message
- `getDMMessages()` - Get message history

#### Community APIs
- `getPosts()` - Get all posts
- `getTrendingPosts()` - Get trending posts
- `createPost()` - Create new post
- `getPostById()` - Get single post
- `searchPosts()` - Search posts
- `likePost()` - Like a post
- `unlikePost()` - Unlike a post
- `getUserPosts()` - Get user's posts
- `getLikedPosts()` - Get liked posts

#### Comment APIs
- `getComments()` - Get post comments
- `addComment()` - Add comment
- `likeComment()` - Like comment
- `unlikeComment()` - Unlike comment
- `deleteComment()` - Delete comment
- `getUserComments()` - Get user's comments

#### AI Chatbot APIs
- `createConversation()` - Create conversation
- `getConversations()` - Get all conversations
- `getConversation()` - Get specific conversation
- `addMessage()` - Add message to conversation

#### Document APIs
- `uploadDocument()` - Upload document
- `getDocuments()` - Get user documents
- `deleteDocument()` - Delete document

#### Admin APIs
- `adminLogin()` - Admin login
- `getUnverifiedLawyers()` - Get unverified lawyers
- `verifyLawyer()` - Verify lawyer
- `deleteLawyer()` - Delete lawyer
- `getAllUsers()` - Get all users
- `getDashboardStats()` - Get dashboard stats
- `getAllDocuments()` - Get all documents
- `deleteDocument()` - Delete document
- `getAllConversations()` - Get all conversations
- `getAllDirectMessages()` - Get all DMs
- `getAllPosts()` - Get all posts
- `deletePost()` - Delete post
- `getAdminStats()` - Get admin statistics

## 🔐 State Management

### Context Providers

#### AuthProvider
- User authentication state
- Login/logout functionality
- Token management
- User profile data

#### AdminAuthProvider
- Admin authentication state
- Admin-specific operations
- Role verification

#### SocketProvider
- Socket.IO connection management
- Real-time event handling
- Message broadcasting
- Typing indicators

#### ThemeProvider
- Dark/light mode toggle
- System preference detection
- Theme persistence

## 🎯 Key Pages

### User Dashboard (`/dashboard`)
- Activity statistics (AI chats, posts, lawyers, documents)
- Quick access cards
- Recent activity overview

### Lawyer Matchmaking (`/matchmaking`)
- Search and filter lawyers
- View lawyer profiles
- Send DM requests
- Rate lawyers

### Direct Messaging (`/messages`)
- Conversation list
- Real-time chat interface
- Message history
- Typing indicators

### Community Forum (`/community`)
- Browse posts
- Create new posts
- Like and comment
- Trending topics
- Search functionality

### AI Chatbot (`/chatbot`)
- Conversation threads
- AI-powered responses
- Message history
- New conversation creation

### Document Management (`/summarizer`)
- Upload documents
- View document list
- AI summarization
- Delete documents

### User Profile (`/profile`)
- View and edit profile
- Lawyer registration (for users)
- Update lawyer profile (for lawyers)
- Activity tabs (Posts, Comments, Liked Posts)

### Admin Dashboard (`/admin/dashboard`)
- System statistics
- User management
- Lawyer verification
- Content moderation
- Document oversight

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette
- Responsive breakpoints
- Dark mode support

### Custom Styles
- CSS variables for theming
- Custom animations
- Glassmorphism effects
- Gradient backgrounds

## 🚀 Performance Optimization

- **Server Components** - Next.js 15 server components for faster initial load
- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Dynamic imports for heavy components
- **Caching** - API response caching
- **Memoization** - React.memo and useMemo for expensive computations

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🔒 Security

- **XSS Protection** - Input sanitization
- **CSRF Protection** - Token-based protection
- **Secure Headers** - Next.js security headers
- **Authentication** - JWT token validation
- **Authorization** - Role-based access control

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Features
- Mobile-first approach
- Responsive navigation (hamburger menu)
- Adaptive layouts
- Touch-friendly interactions

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check backend is running on http://localhost:3000
# Verify NEXT_PUBLIC_API_URL in .env.local
# Check CORS settings in backend
```

**Socket.IO Not Connecting**
```bash
# Verify NEXT_PUBLIC_SOCKET_URL in .env.local
# Check backend Socket.IO configuration
# Ensure no firewall blocking WebSocket connections
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Type check
npm run type-check
```

**Authentication Issues**
```bash
# Clear browser cookies
# Check token expiration
# Verify backend JWT configuration
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Import project to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Set environment variables
6. Deploy

### Environment Variables for Production
```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend-api.com
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)

## 📄 License

ISC License - See main project LICENSE file

## 🤝 Contributing

Please refer to the main project's Contributing Guide for development guidelines.

---

**LegalWise Frontend** - Beautiful, responsive interface for legal services 🎨
