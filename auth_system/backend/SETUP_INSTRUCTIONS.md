# Complete Authentication System Setup Guide

This guide will help you set up both the backend (Node.js) and frontend (React) applications.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git
- A Gmail account (for email functionality)

## Backend Setup

### 1. Clone and Install Backend

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd auth-system

# Install backend dependencies
npm install
\`\`\`

### 2. Database Setup

\`\`\`bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE auth_system;

# Exit MySQL
exit
\`\`\`

### 3. Environment Configuration

\`\`\`bash
# Copy environment file
cp .env.example .env
\`\`\`

Edit `.env` file with your configuration:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# App Configuration
APP_NAME=Auth System
\`\`\`

### 4. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

### 5. Start Backend Server

\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

The backend will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory

\`\`\`bash
cd frontend
\`\`\`

### 2. Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

\`\`\`bash
# Copy environment file
cp .env.example .env
\`\`\`

Edit `.env` file:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 4. Start Frontend Development Server

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at `http://localhost:5173`

## Testing the Application

### 1. Test Backend API

Use Postman or curl to test the API endpoints:

\`\`\`bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirm_password": "Password123!"
  }'
\`\`\`

### 2. Test Frontend

1. Open `http://localhost:5173`
2. Try signing up with a new account
3. Check your email for password reset functionality
4. Test login and protected routes

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/verify-reset-token/:token` | Verify reset token |

### User Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update user profile |

## Postman Collection

Import this collection to test all endpoints:

\`\`\`json
{
  "info": {
    "name": "Auth System API",
    "description": "Complete authentication system API collection"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"Password123!\",\n  \"confirm_password\": \"Password123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/signup",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"Password123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Forgot Password",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/forgot-password",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "forgot-password"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
\`\`\`

## Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI
2. Create Heroku app
3. Set environment variables
4. Deploy

\`\`\`bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# Set other environment variables
git push heroku main
\`\`\`

### Frontend Deployment (Vercel)

1. Install Vercel CLI
2. Build and deploy

\`\`\`bash
npm run build
vercel --prod
\`\`\`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials
   - Ensure database exists

2. **Email Not Sending**
   - Check Gmail app password
   - Verify SMTP settings
   - Check spam folder

3. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check API URL in frontend .env

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

### Logs

Check application logs:

\`\`\`bash
# Backend logs
npm run dev

# Frontend logs
npm run dev
\`\`\`

## Security Considerations

- Use strong JWT secrets in production
- Enable HTTPS in production
- Use environment variables for sensitive data
- Implement rate limiting
- Add input sanitization
- Use secure headers

## License

MIT License - see LICENSE file for details
\`\`\`

This complete authentication system includes:

**Backend Features:**
- ✅ User signup with validation
- ✅ JWT-based login
- ✅ Password reset via email (5-minute expiration)
- ✅ Secure password hashing (bcrypt)
- ✅ Protected routes with middleware
- ✅ MySQL database with proper schema
- ✅ Email service with HTML templates
- ✅ Input validation with Joi
- ✅ Error handling and logging

**Frontend Features:**
- ✅ Modern React with Vite
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Form validation
- ✅ Protected routes
- ✅ Toast notifications
- ✅ Loading states
- ✅ Password reset flow with success/error states

**Security Features:**
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ 5-minute token expiration for password reset
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ SQL injection protection

The system is production-ready and follows best practices for security, code organization, and user experience.
