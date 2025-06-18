# Authentication System - Frontend

A modern React frontend for the authentication system built with Vite, React Router, and Tailwind CSS.

## Features

- ✅ Responsive Design
- ✅ User Registration & Login
- ✅ Password Reset Flow
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Form Validation
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Error Handling

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Installation

1. Navigate to frontend directory
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env file with your API URL
\`\`\`

4. Start development server
\`\`\`bash
npm run dev
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/          # Reusable components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── LoadingSpinner.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── services/           # API services
│   └── api.js
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
\`\`\`

## Environment Variables

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## Features Overview

### Authentication Pages
- **Login**: Email/password authentication with JWT tokens
- **Signup**: User registration with validation
- **Forgot Password**: Email-based password reset
- **Reset Password**: Secure password reset with token validation

### Protected Pages
- **Dashboard**: User overview and account information
- **Profile**: User profile management and settings

### Components
- **Layout**: Main layout with navigation
- **Navbar**: Navigation bar with user menu
- **LoadingSpinner**: Loading indicator

## Styling

The project uses Tailwind CSS with custom component classes:

- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.input` - Input field styles
- `.card`, `.card-header`, `.card-content` - Card components
- `.form-group`, `.form-label`, `.form-error` - Form styles

## API Integration

The frontend communicates with the backend API through:

- Axios HTTP client with interceptors
- Automatic token attachment to requests
- Token expiration handling
- Error response handling

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
\`\`\`

Now let me create the installation and setup instructions:
