// Update this in server.js after deployment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL,
      'https://your-actual-netlify-domain.netlify.app' // Replace with your actual Netlify domain
    ]
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];
