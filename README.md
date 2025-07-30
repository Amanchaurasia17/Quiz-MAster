# Quiz Master - MERN Stack Quiz Application

A complete, production-ready quiz application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring secure user authentication, comprehensive quiz management, and real-time analytics.

## 🎯 Project Status: ✅ COMPLETE & READY FOR PRODUCTION

All requirements have been successfully implemented and tested. See [PROJECT_VERIFICATION.md](./PROJECT_VERIFICATION.md) for detailed verification.

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Registration & Login**: JWT-based authentication with bcryptjs password hashing
- **Role-based Access Control**: Admin and User roles with appropriate permissions
- **Security Features**: Rate limiting, CORS protection, input validation, XSS prevention
- **Session Management**: Automatic logout on token expiration

### 📊 Quiz Management
- **Complete CRUD Operations**: Create, read, update, delete quizzes (Admin only)
- **Rich Question Types**: Multiple choice with explanations and difficulty levels
- **Categories & Organization**: Programming, Technology, Science with proper categorization
- **Time Management**: Configurable time limits and real-time timer functionality
- **🎲 API Integration**: Generate quizzes automatically from Open Trivia Database (opentdb.com)
- **External Data Source**: Fetch questions with correct_answer and incorrect_answers parameters
- **Question Variety**: Access to 15+ questions per API call with automatic shuffling

### 🎮 Interactive Quiz Experience
- **User-friendly Interface**: Clean, responsive design for all devices
- **Progress Tracking**: Real-time question navigation and progress indicators
- **Instant Feedback**: Immediate scoring and detailed result breakdown
- **Performance Analytics**: Personal dashboard with statistics and progress tracking

### 📈 Results & Analytics
- **Accurate Scoring**: Percentage-based calculation with detailed breakdowns
- **Historical Tracking**: Complete quiz history and performance trends
- **Dashboard Analytics**: Personal statistics, averages, and progress metrics
- **Result Management**: Secure storage and retrieval of all quiz attempts

## 🛠️ Tech Stack

- **Frontend**: React.js, CSS3, Axios
- **Backend**: Node.js, Express.js, Axios (for external API calls)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **External APIs**: Open Trivia Database (opentdb.com)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd quiz-master-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   npm run install-client
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quizmaster
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## 🚀 Usage

1. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

2. **User Workflow**
   - Register/Login to access quizzes
   - Browse available quizzes
   - Take quizzes and view results
   - Track progress and scores

3. **Admin Workflow**
   - Login with admin credentials
   - Create and manage quizzes
   - View user statistics
   - Monitor quiz performance

## 📁 Project Structure

```
quiz-master-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
├── models/                # MongoDB models
├── routes/                # Express routes
├── middleware/            # Custom middleware
├── config/               # Configuration files
├── server.js             # Main server file
└── package.json
```

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

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as part of a Software Engineer Intern assignment for CausalFunnel.

## 🙏 Acknowledgments

- Built with modern web development best practices
- Implements secure authentication patterns
- Follows REST API conventions
- Uses responsive design principles
