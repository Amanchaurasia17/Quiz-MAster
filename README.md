# Quiz Master - MERN Stack Quiz Application

A complete, production-ready quiz application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring secure user authentication, comprehensive quiz management, real-time analytics, and AI-powered quiz generation.

## 🎯 Project Status: ✅ LIVE & DEPLOYED

🌐 **Live Application**: https://quizprepare.netlify.app  
🔗 **Backend API**: https://quiz-master-production-3a8f.up.railway.app  
📊 **Database**: MongoDB Atlas (Cloud)

All requirements have been successfully implemented, tested, and deployed to production.

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Registration & Login**: JWT-based authentication with bcryptjs password hashing
- **Role-based Access Control**: Admin and User roles with appropriate permissions
- **Security Features**: Rate limiting, CORS protection, input validation, XSS prevention
- **Session Management**: Automatic logout on token expiration
- **Password Security**: Bcrypt hashing with salt rounds for maximum security

### 📊 Quiz Management (Available to All Users)
- **🎲 AI-Powered Quiz Generation**: Create quizzes instantly using Open Trivia Database API
- **User-Friendly Creation**: Any logged-in user can generate quizzes (no admin required)
- **Complete CRUD Operations**: Create, read, update, delete quizzes
- **Rich Question Types**: Multiple choice with explanations and difficulty levels
- **Categories & Organization**: Technology, Science, History, Sports, General Knowledge, and more
- **Time Management**: Configurable time limits (5-180 minutes) and real-time timer
- **External Data Source**: Fetch 5-50 questions per quiz with automatic shuffling
- **Question Variety**: Access to thousands of questions from opentdb.com

### 🎮 Interactive Quiz Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progress Tracking**: Real-time question navigation and progress indicators
- **Instant Feedback**: Immediate scoring and detailed result breakdown
- **Performance Analytics**: Personal dashboard with statistics and progress tracking
- **Easy Navigation**: Browse quizzes by difficulty, category, and search terms

### 📈 Results & Analytics
- **Accurate Scoring**: Percentage-based calculation with detailed breakdowns
- **Historical Tracking**: Complete quiz history and performance trends
- **Dashboard Analytics**: Personal statistics, averages, and progress metrics
- **Result Management**: Secure storage and retrieval of all quiz attempts
- **Performance Insights**: Track improvement over time

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Modern React with functional components and hooks
- **React Router v6**: Client-side routing and navigation
- **CSS3**: Custom styling with responsive design
- **Axios**: HTTP client for API communication
- **Context API**: State management for authentication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and security

### Security & Performance
- **Helmet**: Security headers and protection
- **Express Rate Limit**: API rate limiting
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive data validation

### External APIs
- **Open Trivia Database**: Question generation from opentdb.com
- **MongoDB Atlas**: Cloud database hosting
- **Railway**: Backend hosting and deployment
- **Netlify**: Frontend hosting and deployment

## 🌐 Deployment Architecture

### Production Environment
- **Frontend**: Deployed on Netlify with automatic builds from GitHub
- **Backend**: Deployed on Railway with environment variables
- **Database**: MongoDB Atlas cloud cluster
- **Domain**: Custom domain with SSL/HTTPS enabled

### Environment Configuration
- **Development**: Local MongoDB with hot reload
- **Production**: Optimized builds with environment-specific configs
- **CI/CD**: Automated deployment pipeline from Git commits

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Git for version control

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amanchaurasia17/Quiz-MAster.git
   cd Quiz-MAster
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quizmaster
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

6. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## 🚀 Quick Start Guide

### For Users
1. **Visit**: https://quizprepare.netlify.app
2. **Register**: Create a new account or login
3. **Browse Quizzes**: Explore available quizzes by category/difficulty
4. **Take Quizzes**: Start any quiz and track your progress
5. **Generate Quizzes**: Create your own quizzes using the AI-powered generator

### For Developers
1. **Fork** the repository
2. **Clone** your fork locally
3. **Follow** the installation steps above
4. **Start** development with `npm run dev`
5. **Build** for production with `npm run build`

## �️ API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |

### Quiz Management Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/quizzes` | Get all quizzes | Public |
| GET | `/api/quizzes/:id` | Get quiz by ID | Public |
| POST | `/api/quizzes` | Create new quiz | Private |
| PUT | `/api/quizzes/:id` | Update quiz | Admin |
| DELETE | `/api/quizzes/:id` | Delete quiz | Admin |
| POST | `/api/quizzes/generate` | Generate AI-powered quiz | Private |
| GET | `/api/quizzes/trivia-categories` | Get trivia categories | Private |

### Results & Analytics Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/results` | Submit quiz result | Private |
| GET | `/api/results/user/:userId` | Get user's results | Private |
| GET | `/api/results/quiz/:quizId` | Get quiz statistics | Private |
| GET | `/api/results/leaderboard` | Get global leaderboard | Public |

### Admin Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/analytics` | Get platform analytics | Admin |

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/quizmaster

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# External APIs
OPEN_TRIVIA_API_URL=https://opentdb.com/api.php
```

### Frontend (client/.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=Quiz Master
REACT_APP_VERSION=1.0.0
```

## 🚀 Usage & Features

### Live Application Access
- **Frontend**: https://quizprepare.netlify.app
- **Backend API**: https://quiz-master-production-3a8f.up.railway.app/api

### User Workflow
1. **Register/Login** - Create account or sign in
2. **Browse Quizzes** - Explore quizzes by category and difficulty
3. **Generate Custom Quizzes** - Use AI-powered quiz generation
4. **Take Quizzes** - Interactive quiz-taking experience
5. **View Results** - Track scores and performance analytics
6. **Leaderboards** - Compare with other users

### Admin Features
1. **Quiz Management** - Create, edit, and delete quizzes
2. **User Management** - Monitor user accounts and activity
3. **Analytics Dashboard** - View platform statistics
4. **Content Moderation** - Review and approve user-generated content

## 📁 Project Structure

```
CausalFunnel-Ass/
├── client/                      # React.js Frontend Application
│   ├── public/                  # Static assets and HTML template
│   │   ├── index.html          # Main HTML file
│   │   ├── favicon.ico         # Site icon
│   │   └── manifest.json       # PWA configuration
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Shared components (Button, Input, Routes)
│   │   │   ├── layout/         # Layout components (Header, Footer)
│   │   │   └── GenerateQuiz.js # AI-powered quiz generation
│   │   ├── pages/              # Page-level components
│   │   │   ├── admin/          # Admin-specific pages
│   │   │   ├── Auth.css        # Authentication styles
│   │   │   ├── Dashboard.js    # User dashboard
│   │   │   ├── Home.js         # Landing page
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Registration page
│   │   │   ├── QuizList.js     # Quiz browsing
│   │   │   ├── QuizTake.js     # Quiz taking interface
│   │   │   └── QuizResult.js   # Results display
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Base API configuration
│   │   │   ├── authService.js  # Authentication services
│   │   │   ├── quizService.js  # Quiz-related API calls
│   │   │   └── resultService.js # Result management
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.js  # Authentication state management
│   │   ├── utils/              # Utility functions
│   │   │   └── helpers.js      # Common helper functions
│   │   ├── App.js              # Main application component
│   │   └── index.js            # Application entry point
│   └── package.json            # Frontend dependencies and scripts
├── models/                     # MongoDB Schema Definitions
│   ├── User.js                # User model with authentication
│   ├── Quiz.js                # Quiz structure and validation
│   └── Result.js              # Quiz result tracking
├── routes/                     # Express.js API Routes
│   ├── auth.js                # Authentication endpoints
│   ├── quizzes.js             # Quiz management endpoints
│   └── results.js             # Result tracking endpoints
├── middleware/                 # Express.js Middleware
│   ├── auth.js                # JWT authentication middleware
│   └── validation.js          # Input validation middleware
├── services/                   # Backend Service Layer
│   └── openTriviaService.js   # Open Trivia Database integration
├── .github/                    # GitHub configuration
│   └── copilot-instructions.md # Development guidelines
├── server.js                   # Express.js server entry point
├── package.json                # Backend dependencies and scripts
├── netlify.toml               # Netlify deployment configuration
├── railway.json               # Railway deployment configuration
└── README.md                  # Project documentation
```

## 🚀 Deployment Architecture

### Production Environment
- **Frontend**: Deployed on **Netlify** with automatic CI/CD
  - URL: https://quizprepare.netlify.app
  - Build: React.js optimized production build
  - CDN: Global content delivery network
  
- **Backend**: Deployed on **Railway** with containerization
  - URL: https://quiz-master-production-3a8f.up.railway.app
  - Runtime: Node.js with Express.js
  - Auto-scaling: Based on traffic demands
  
- **Database**: **MongoDB Atlas** (Cloud Database)
  - Cluster: Shared M0 tier
  - Region: Multi-region replication
  - Security: Network access whitelist + database authentication

### Deployment Workflow
1. **Code Changes** → Git push to GitHub repository
2. **Netlify** → Automatic frontend deployment on push to main
3. **Railway** → Automatic backend deployment on push to main
4. **MongoDB Atlas** → Persistent data storage with automated backups

### Environment Configuration
- **Development**: Local MongoDB + Express + React development servers
- **Production**: Cloud-hosted services with environment-specific configurations
- **Security**: JWT tokens, bcryptjs password hashing, CORS protection

## 🎲 Open Trivia Database Integration

### Data Source Requirements ✅
As specified in the requirements, quiz questions are now fetched from the **Open Trivia Database API**:

- **API Endpoint**: `https://opentdb.com/api.php?amount=15`
- **Question Parameter**: Uses the `question` parameter as the question to be displayed
- **Answer Options**: Concatenated array of `correct_answer` and `incorrect_answers` parameters
- **Correct Answer**: Provided in the `correct_answer` parameter for every question

### Features
- **Automatic Question Generation**: Generate 5-50 questions per quiz from external API
- **Category Mapping**: Supports multiple categories (General Knowledge, Science, Technology, etc.)
- **Difficulty Levels**: Easy, Medium, Hard question filtering
- **Answer Shuffling**: Automatic randomization of answer options for variety
- **HTML Decoding**: Proper handling of HTML entities in questions and answers
- **Error Handling**: Robust API error handling with user-friendly messages

### Usage
1. **Admin Access**: Navigate to Quiz Management → Generate from API
2. **Configure Quiz**: Set title, description, category, difficulty, and question count
3. **API Fetch**: System automatically fetches questions from opentdb.com
4. **Auto-Format**: Questions are formatted to match the internal quiz schema
5. **Immediate Use**: Generated quizzes are ready for users to take

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes` - Create quiz (Admin)
- `POST /api/quizzes/generate` - Generate quiz from Open Trivia DB API (Admin)
- `GET /api/quizzes/trivia-categories` - Get Open Trivia DB categories (Admin)
- `PUT /api/quizzes/:id` - Update quiz (Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin)

### Results
- `POST /api/results` - Submit quiz results
- `GET /api/results/user/:userId` - Get user results

## 🔧 Development

### Available Scripts
- `npm run dev` - Run both frontend and backend
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build production frontend

### Testing
- Ensure all features work correctly
- Test with different user roles
- Verify security measures

## 🚀 Deployment

1. **Environment Variables**
   Set production environment variables

2. **Build the frontend**
   ```bash
   npm run build
   ```

3. **Deploy to your preferred platform**
   - Heroku
   - Vercel
   - Digital Ocean
   - AWS

## 🤝 Contributing

We welcome contributions to Quiz Master! Here's how you can help:

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following our coding guidelines
4. **Test** thoroughly (both frontend and backend)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request with detailed description

### Coding Standards
- **JavaScript**: ES6+ features, consistent formatting
- **React**: Functional components with hooks
- **Node.js**: Express.js best practices, async/await
- **Database**: Mongoose ODM with proper validation
- **Comments**: Clear documentation for complex logic
- **Testing**: Unit tests for critical functionality

### Areas for Contribution
- 🐛 **Bug fixes** - Help resolve issues
- 🚀 **Features** - Add new functionality
- 📝 **Documentation** - Improve guides and comments
- 🎨 **UI/UX** - Enhance user interface
- 🔒 **Security** - Strengthen application security
- ⚡ **Performance** - Optimize application speed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use** - Use in commercial applications
- ✅ **Modification** - Modify and create derivative works
- ✅ **Distribution** - Distribute original or modified versions
- ✅ **Private use** - Use privately without restrictions
- ❌ **Liability** - No warranty or liability from authors
- ❌ **Warranty** - No warranty provided

## 📞 Support & Contact

### � Report Issues
- **GitHub Issues**: [Create an issue](https://github.com/Amanchaurasia17/Quiz-MAster/issues)
- **Bug Reports**: Include steps to reproduce, expected vs actual behavior
- **Feature Requests**: Describe the feature and its use case

### 💬 Community
- **Discussions**: Use GitHub Discussions for questions
- **Pull Requests**: Contribute code improvements
- **Documentation**: Help improve guides and tutorials

### 📧 Direct Contact
- **Developer**: [Aman Chaurasia](https://github.com/Amanchaurasia17)
- **Email**: Available through GitHub profile
- **LinkedIn**: Connect for professional inquiries

## �👨‍💻 About This Project

Created as part of a **Software Engineer Intern assignment for CausalFunnel**, this project demonstrates:

### Technical Excellence
- 🏗️ **Full-Stack Development** - Complete MERN stack implementation
- 🔐 **Security Best Practices** - JWT authentication, password hashing, input validation
- 🌐 **Production Deployment** - Live application with Railway + Netlify + MongoDB Atlas
- 📱 **Responsive Design** - Mobile-first approach with modern UI/UX
- 🔄 **REST API Design** - Following RESTful conventions and best practices
- 🧪 **Quality Assurance** - Error handling, validation, and testing practices

### Key Achievements
- ✅ **User-Friendly Interface** - Intuitive quiz creation and management
- ✅ **AI-Powered Features** - Integration with Open Trivia Database
- ✅ **Real-time Analytics** - User performance tracking and leaderboards
- ✅ **Scalable Architecture** - Modular design supporting future enhancements
- ✅ **Cross-Platform Compatibility** - Works seamlessly across devices

---

## 🙏 Acknowledgments

### Technologies & Services
- **MongoDB Atlas** - Cloud database hosting
- **Railway** - Backend deployment platform
- **Netlify** - Frontend hosting and CI/CD
- **Open Trivia Database** - Free trivia questions API
- **React.js** - Frontend framework
- **Express.js** - Backend framework
- **JWT** - Authentication standard

### Open Source Libraries
- **bcryptjs** - Password hashing
- **mongoose** - MongoDB object modeling
- **axios** - HTTP client library
- **react-router-dom** - React routing
- **cors** - Cross-origin resource sharing

### Development Tools
- **VS Code** - Code editor
- **GitHub Copilot** - AI coding assistance
- **Postman** - API testing
- **Git** - Version control

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ by [Aman Chaurasia](https://github.com/Amanchaurasia17)**

**Live Demo**: [Quiz Master App](https://quizprepare.netlify.app) | **API**: [Backend Service](https://quiz-master-production-3a8f.up.railway.app)



</div>
