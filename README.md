# 📚 Portfolio Admin Backend

A comprehensive backend server for managing portfolio content, built with **Express.js**, **PostgreSQL**, and **Supabase**.

---

## 🎯 Overview

This backend server provides RESTful APIs for:
- 🔐 **User Authentication** - JWT-based admin login
- 📝 **Content Management** - About me, skills, projects, education, certifications, etc.
- 📸 **File Uploads** - Image uploads via Cloudinary
- 📧 **Email Notifications** - Contact form submissions via Nodemailer
- 📞 **SMS Notifications** - Twilio integration for alerts
- 🗂️ **Database Management** - PostgreSQL with Supabase

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **Node.js** | Runtime environment |
| **PostgreSQL** | Primary database |
| **Supabase** | Database hosting & authentication |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **Bcryptjs** | Password hashing |
| **Cloudinary** | Image storage & hosting |
| **Nodemailer** | Email service |
| **Twilio** | SMS service |
| **CORS** | Cross-origin request handling |
| **Multer** | File upload middleware |
| **Dotenv** | Environment variable management |

---

## 📋 Prerequisites

Before you start, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (or Supabase account)
- **Cloudinary** account (for image uploads)
- **Nodemailer** configured email service
- **Twilio** account (optional, for SMS)

---

## 🚀 Installation & Setup

### 1. **Install Dependencies**

```bash
cd Portfolio-Admin
npm install
```

### 2. **Environment Configuration**

Create a `.env` file in the `Portfolio-Admin` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=1h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here

# Database Configuration (Supabase)
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Cloudinary Configuration (Image Uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# SMS Configuration (Twilio - Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 3. **Generate Admin Password Hash**

To create a bcrypt hash for your admin password:

```bash
node config/generateHash.js your_desired_password
```

Copy the generated hash and update `ADMIN_PASSWORD_HASH` in `.env`

### 4. **Database Setup**

The database uses PostgreSQL with Supabase. Ensure your `DATABASE_URL` is correctly set.

**Note:** Supabase connection issues may occur if your network doesn't support IPv6. Use the Supabase pooler URL instead:
```
postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres
```

---

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```
Requires `nodemon` (installed as dev dependency)

### Production Mode
```bash
npm start
```

Server will run on **http://localhost:5000** (or your configured PORT)

---

## 📡 API Endpoints

### 🔐 **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Admin login, returns JWT token | No |
| POST | `/verify` | Verify JWT token validity | No |

### 🎓 **Education Routes** (`/api/education`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all education records | No |
| POST | `/` | Create new education record | Yes |
| PUT | `/:id` | Update education record | Yes |
| DELETE | `/:id` | Delete education record | Yes |

### 💼 **Skills Routes** (`/api/skills`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all skills | No |
| POST | `/` | Create new skill | Yes |
| PUT | `/:id` | Update skill | Yes |
| DELETE | `/:id` | Delete skill | Yes |
| POST | `/reorder` | Reorder skills | Yes |

### 📂 **Skill Categories Routes** (`/api/skillcategories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all skill categories | No |
| POST | `/` | Create new category | Yes |
| PUT | `/:id` | Update category | Yes |
| DELETE | `/:id` | Delete category | Yes |

### 📸 **Upload Routes** (`/api/upload`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Upload image to Cloudinary | Yes |

### 📝 **About Me Routes** (`/api/aboutme`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get about me content | No |
| PUT | `/` | Update about me content | Yes |

### 🎯 **Projects Routes** (`/api/projects`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all projects | No |
| POST | `/` | Create new project | Yes |
| PUT | `/:id` | Update project | Yes |
| DELETE | `/:id` | Delete project | Yes |

### 🏆 **Achievements Routes** (`/api/achievements`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all achievements | No |
| POST | `/` | Create new achievement | Yes |
| PUT | `/:id` | Update achievement | Yes |
| DELETE | `/:id` | Delete achievement | Yes |

### 📜 **Certificates Routes** (`/api/certificates`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all certificates | No |
| POST | `/` | Create new certificate | Yes |
| PUT | `/:id` | Update certificate | Yes |
| DELETE | `/:id` | Delete certificate | Yes |

### 👤 **Personal Info Routes** (`/api/personalinfo`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get personal information | No |
| PUT | `/` | Update personal information | Yes |

### 🔗 **Links Routes** (`/api/links`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all links | No |
| POST | `/` | Create new link | Yes |
| PUT | `/:id` | Update link | Yes |
| DELETE | `/:id` | Delete link | Yes |

### 📊 **Dashboard Routes** (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get dashboard statistics | Yes |

### 🟢 **Status Routes** (`/api/status`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Check API health status | No |

---

## 🏗️ Project Structure

```
Portfolio-Admin/
├── config/
│   ├── db.js                    # Database connection setup
│   ├── generateHash.js          # Password hash generator utility
│   └── supabase.js              # Supabase client initialization
├── controller/
│   ├── aboutme.controller.js    # About me business logic
│   ├── achievements.controller.js
│   ├── auth.controller.js       # Authentication logic
│   ├── certificates.controller.js
│   ├── dashboard.controller.js  # Dashboard statistics
│   ├── education.controller.js
│   ├── links.controller.js
│   ├── personalInfo.controller.js
│   ├── projects.controller.js
│   ├── skillcategories.controller.js
│   ├── skills.controller.js
│   ├── status.controller.js
│   └── upload.controller.js     # File upload handling
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── routes/
│   ├── aboutme.routes.js
│   ├── achievements.routes.js
│   ├── auth.routes.js
│   ├── certificates.routes.js
│   ├── dashboard.routes.js
│   ├── education.routes.js
│   ├── links.routes.js
│   ├── personalInfo.routes.js
│   ├── projects.routes.js
│   ├── skillcategories.routes.js
│   ├── skills.routes.js
│   ├── status.routes.js
│   └── upload.routes.js
├── api/
│   └── education.api.js         # External API integrations
├── utils/                       # Utility functions
├── .env                         # Environment variables
├── .gitignore
├── server.js                    # Main server entry point
├── package.json
└── vercel.json                  # Vercel deployment config
```

---

## 🔐 Authentication System

### JWT Token Flow

1. **Login**: Send credentials to `/api/auth/login`
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Response**: Receive JWT token
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "username": "admin",
       "role": "admin"
     }
   }
   ```

3. **Use Token**: Include in Authorization header for protected routes
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Verification**: Server validates token before allowing access

### Password Security

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Passwords are **never stored in plain text**
- Generate new hashes with: `node config/generateHash.js new_password`

---

## 🗄️ Database Schema

The backend uses PostgreSQL with the following main tables:
- `users` - Admin credentials
- `about_me` - About section content
- `skills` - Individual skills
- `skill_categories` - Skill groupings
- `education` - Educational records
- `projects` - Project portfolio items
- `certifications` - Certification records
- `achievements` - Achievements and awards
- `links` - Social media & external links
- `personal_info` - Contact information

**Important Database Note:**
- The `skill_items` table has a unique constraint on `(category_id, order_index)`
- When reordering skills, use two-phase updates to avoid constraint violations

---

## 🐛 Known Issues & Notes

### Database Connection Issues
- ⚠️ **IPv6 Problem**: Supabase direct host may only resolve IPv6. If you experience connection failures:
  - Use Supabase **pooler URL** instead: `postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres`
  - This uses TCP connection pooling and supports IPv4

### Route Definition Order
- ⚠️ **Important**: In Express routes, define static paths (like `/reorder`) before dynamic parameters (`:id`)
- Example: Define `/skills/reorder` before `/skills/:id`, otherwise `/reorder` will be caught by the `:id` route handler

### Environment Variables
- ⚠️ **ESM Imports**: Modules imported before `dotenv.config()` won't see environment variables
- Solution: Load `dotenv` inside `config/db.js` before reading `DATABASE_URL`

---

## 🚀 Deployment

### Vercel Deployment

The project includes a `vercel.json` configuration for easy deployment:

1. Push code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set all required environment variables in your hosting platform (Vercel, Heroku, etc.)

---

## 📧 Contact & Support

For issues or questions:
- Check the [QUICK-START.md](../QUICK-START.md) for quick setup
- Review [JWT-AUTH-README.md](../JWT-AUTH-README.md) for authentication details
- Check logs for error messages and debugging information

---

## 📄 License

ISC

---

## ✨ Features

✅ JWT-based authentication
✅ Secure password hashing
✅ CORS-enabled for cross-origin requests
✅ Comprehensive REST API
✅ File upload to Cloudinary
✅ Email & SMS notifications
✅ Database connection pooling
✅ Protected admin routes
✅ Error handling and logging
✅ Production-ready configuration

---

**Last Updated**: May 2026
