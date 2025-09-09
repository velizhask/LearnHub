# LearnHub - Personalized Learning Resource Tracker

A full-stack web application that integrates with Google Books API to help students discover, save, and track their learning progress through educational books.
> 📌 This project was built as part of the **Elice APAC Full-Stack Engineer Challenge**. 

## 🚀 Demo
- 🌐 [Live Demo](https://learnhub-sable-three.vercel.app/)
- 📂 [Repository](https://github.com/velizhask/LearnHub)
- 🎥 [Demo Video](https://drive.google.com/file/d/1nQa2xIDpD7ly2cvTcow4KVicVx4Tim7R/view?usp=sharing)

## 🚀 Features

### Core Functionality
- **📚 Book Search**: Integration with Google Books API for educational content
- **📖 Personal Library**: Save and organize books with reading status tracking
- **🎯 Progress Tracking**: Set and monitor reading goals (yearly/monthly/daily)
- **🔐 User Authentication**: Secure login with JWT and Google OAuth
- **📧 Reading Reminders**: Email notifications for reading goals

### Advanced Features
- **⚡ API Rate Limiting**: Tiered protection (100/15min general, 5/15min auth)
- **🔗 External API Integration**: Google Books, Google OAuth, Gmail notifications
- **📱 Responsive Design**: Mobile-first UI with Tailwind CSS
- **🛡️ Error Handling**: Graceful degradation and retry logic

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI with type safety |
| **Build Tool** | Vite | Fast development and build |
| **Styling** | Tailwind CSS + Radix UI | Utility-first CSS with accessible components |
| **State** | React Query + Context | Server state and global state management |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB + Mongoose | Document database with ODM |
| **Auth** | JWT + Passport.js | Stateless auth with OAuth integration |
| **External APIs** | Google Books, OAuth, Gmail | Content, authentication, notifications |

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Cloud Console account
- Gmail account for notifications

## ⚙️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/learnhub.git
cd learnhub

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp server/.env.example server/.env
```

**Configure `server/.env`:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:8080

# Google APIs (see setup guide below)
GOOGLE_BOOKS_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
USE_MOCK_EMAIL=true
```

### 3. Start Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

**Access Application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api

## 🔧 API Configuration

### Google Books API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Books API
3. Create API key → Add to `.env`

### Google OAuth Setup
1. In Credentials → Create OAuth 2.0 Client ID
2. Authorized origins: `http://localhost:5000`
3. Redirect URIs: `http://localhost:5000/api/auth/google/callback`

### Gmail Configuration
1. Enable 2FA on Gmail
2. Generate App Password
3. Use in `EMAIL_PASS` environment variable

## 📊 API Documentation

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Create account | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `GET` | `/api/books/search` | Search books | ❌ |
| `GET` | `/api/books/featured` | Featured books | ❌ |
| `GET` | `/api/library` | User's library | ✅ |
| `POST` | `/api/library/add` | Add book | ✅ |
| `PATCH` | `/api/library/:id/status` | Update status | ✅ |

## 🧪 Testing with Sample Data

### Demo User Account
```json
{
  "email": "demo@learnhub.com",
  "password": "demo123",
  "name": "Demo User"
}
```

### Sample Book Searches
- `q=javascript` - Programming books
- `q=machine learning` - AI/ML resources  
- `q=mathematics` - Math textbooks
- `q=history` - Historical content

## 📁 Project Structure
```
LearnHub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (BookCard, Navigation)
│   │   ├── contexts/       # React contexts (Auth, Library, Theme)
│   │   ├── hooks/          # Custom hooks (useToast, useLocalStorage)
│   │   ├── pages/          # Route components (Index, Library, Profile)
│   │   └── services/       # API clients (api.ts, googleBooksApi.ts)
├── server/                 # Express backend
│   ├── config/            # Passport configuration
│   ├── middleware/        # Auth, rate limiting
│   ├── models/           # MongoDB schemas (User, Library)
│   ├── routes/           # API endpoints
│   └── services/         # Business logic
└── docs/                 # Documentation
    ├── architecture.md   # System design overview
    ├── technology-choices.md # Tech stack rationale
    ├── critical-analysis.md # Limitations & improvements
    └── sample-data/      # Test data and examples
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && NODE_ENV=production npm start
```

### Environment Variables
- Set secure `JWT_SECRET`
- Use MongoDB Atlas for database
- Configure production domains in CORS
- Set `USE_MOCK_EMAIL=false` for real emails

## 📚 Documentation

- [📐 Architecture Overview](docs/architecture.md) - System design and data flow
- [🔧 Technology Choices](docs/technology-choices.md) - Framework selection rationale  
- [🔍 Critical Analysis](docs/critical-analysis.md) - Strengths, limitations, improvements
- [📊 Sample Data](docs/sample-data/) - Test data and API examples


**Built with ❤️ for learners everywhere**
