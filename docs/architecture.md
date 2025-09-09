# Architecture Overview

## System Design

LearnHub follows a **3-tier architecture** with clear separation of concerns:

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ React Client  │────▶│ Express API   │────▶│   MongoDB     │
│ (Vercel)      │     │ (Railway)     │     │ (Atlas)       │
└───────────────┘     └───────────────┘     └───────────────┘
         │                      │
         └──────▶ Google Books API + Google OAuth
           
```

## Key Design Decisions

### 1. **Stateless Authentication**
- **JWT tokens** for scalability
- **Refresh token rotation** for security
- **Google OAuth** integration for user convenience

### 2. **API-First Design**
- **RESTful endpoints** with consistent structure
- **Rate limiting** to prevent abuse
- **Error handling** with standardized responses

### 3. **External API Integration**
- **Google Books API** for content discovery
- **Retry logic** with exponential backoff
- **Graceful degradation** when APIs are unavailable

### 4. **Database Schema**
- **Document-based** storage for flexible book metadata
- **Compound indexing** for query optimization
- **Embedded documents** for reading progress tracking

## Data Flow

### User Authentication Flow
```
User → Frontend → Backend → JWT → Database → Response
                     ↓
                Google OAuth (optional)
```

### Book Search Flow
```
User Query → Frontend → Backend → Google Books API → Response
                          ↓
                    Rate Limiter → Cache (future)
```

### Library Management Flow
```
User Action → Frontend → Backend → Database → Real-time Update
                           ↓
                    Email Service (notifications)
```

## Security Architecture

- **Input validation** on all endpoints
- **Password hashing** with bcrypt
- **Environment variables** for sensitive data
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse

## Scalability Considerations

- **Stateless design** enables horizontal scaling
- **Database indexing** for query performance
- **API rate limiting** prevents resource exhaustion
- **Modular architecture** allows independent scaling