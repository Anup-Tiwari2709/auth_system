# Authentication System - Backend

A complete authentication system built with Node.js, Express, and MySQL featuring signup, login, and secure password reset functionality.

## Features

- ✅ User Registration (Signup)
- ✅ JWT-based Authentication (Login)
- ✅ Password Reset via Email
- ✅ Secure Password Hashing
- ✅ Input Validation
- ✅ Email Verification
- ✅ Token Expiration (5 minutes for reset tokens)
- ✅ Protected Routes
- ✅ User Profile Management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Environment Variables**: dotenv

## Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd auth-system-backend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env file with your configuration
\`\`\`

4. Set up MySQL database
- Create a MySQL database named `auth_system`
- Update database credentials in `.env` file

5. Start the server
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

## API Endpoints

### Authentication Routes

#### 1. User Signup
- **POST** `/api/auth/signup`
- **Body**:
\`\`\`json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirm_password": "Password123!"
}
\`\`\`

#### 2. User Login
- **POST** `/api/auth/login`
- **Body**:
\`\`\`json
{
  "email": "john@example.com",
  "password": "Password123!"
}
\`\`\`

#### 3. Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**:
\`\`\`json
{
  "email": "john@example.com"
}
\`\`\`

#### 4. Reset Password
- **POST** `/api/auth/reset-password`
- **Body**:
\`\`\`json
{
  "token": "reset_token_here",
  "password": "NewPassword123!",
  "confirm_password": "NewPassword123!"
}
\`\`\`

#### 5. Verify Reset Token
- **GET** `/api/auth/verify-reset-token/:token`

### User Routes (Protected)

#### 1. Get User Profile
- **GET** `/api/user/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### 2. Update User Profile
- **PUT** `/api/user/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
\`\`\`json
{
  "first_name": "John",
  "last_name": "Doe"
}
\`\`\`

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Security Features

- Passwords are hashed using bcryptjs with salt rounds of 12
- JWT tokens for secure authentication
- Password reset tokens expire after 5 minutes
- Input validation and sanitization
- SQL injection protection
- CORS configuration

## Email Configuration

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `SMTP_PASS`

## Environment Variables

\`\`\`env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auth_system
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
APP_NAME=Auth System
\`\`\`

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

### Password Reset Tokens Table
\`\`\`sql
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
\`\`\`

## Testing with Postman

Import the provided Postman collection to test all endpoints.

## License

MIT License
\`\`\`

Now let me create the frontend React application:
