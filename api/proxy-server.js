/**
 * Backend Proxy Server for API Key Security
 * This server handles all AI API calls to keep API keys secure
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware with comprehensive headers
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  // Frame protection
  frameguard: {
    action: 'deny'
  },
  // HSTS (only in production)
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  // No-sniff header
  noSniff: true,
  // XSS protection
  xssFilter: true,
  // Referrer policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  // Permissions policy
  permissionsPolicy: {
    features: {
      geolocation: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
      magnetometer: ["'none'"],
      gyroscope: ["'none'"],
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3005',
    'http://localhost:3010',
    'http://192.168.100.2:3000',
    'http://192.168.100.2:3005',
    'http://192.168.100.2:3010',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request validation and sanitization middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true,
  type: 'application/json'
}));

// Request sanitization middleware
app.use((req, res, next) => {
  // Sanitize URL parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key]
          .trim()
          .substring(0, 1000)
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    }
  }
  
  // Log suspicious requests
  const suspiciousPatterns = [
    /\.\.\//,  // Path traversal
    /<script/i,  // Script injection
    /javascript:/i,  // JavaScript protocol
    /on\w+\s*=/i,  // Event handlers
    /union.*select/i,  // SQL injection
    /drop.*table/i,  // SQL injection
  ];
  
  const requestString = JSON.stringify({
    url: req.url,
    query: req.query,
    body: req.body
  });
  
  if (suspiciousPatterns.some(pattern => pattern.test(requestString))) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      timestamp: new Date().toISOString()
    });
    
    // Don't block immediately, but could implement rate limiting here
  }
  
  next();
});

// Initialize AI service with server-side API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.VITE_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('[AI Proxy] No Gemini API key found. Please set GEMINI_API_KEY or GOOGLE_AI_API_KEY in api/.env');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// AI Chatbot Proxy Endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const { message, brokerContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Sanitize input
    const sanitizedMessage = message.trim().substring(0, 2000); // Limit message length

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are BrokerBot, an expert AI assistant for forex trading. You have access to a database of forex brokers in JSON format below. Use this data to answer user questions accurately. You can and should create links in your response using markdown format [link text](url).

- To link to a broker's detail page within this app, use the 'internalPath' value. For example: "You can see more details on [Pepperstone](/#/broker/pepperstone)".
- To link to a broker's official website, use the 'websiteUrl' value. For example: "Visit the [official Pepperstone website](https://pepperstone.com/)".
- To link to the comparison page, use '/#/compare'. For example: "You can compare them on our [comparison page](/#/compare)".

**Answering "Best Broker" Questions:**
When asked for the "best" broker for a specific category (e.g., "best ECN brokers", "best for beginners"), identify the top 2-3 brokers from the data that match the criteria. Explain your reasoning briefly. For example, for "beginners", look for low minimum deposits, high overall scores, and user-friendly platforms. For "ECN", look for brokers with \`executionType\` of 'ECN' and low costs.

If a user asks to compare brokers, use the data to provide a comparison. If the question is about a specific broker, use the data for that broker and provide helpful links. If it's a general forex question not related to the data, answer it from your general knowledge. Be helpful, concise, and friendly. Use markdown for formatting, like bolding broker names with **.

Broker Data:
${brokerContext || 'No broker data provided'}

User's question: "${sanitizedMessage}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

// AI Tutor Proxy Endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const { topic, difficulty, userLevel } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Invalid topic format' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert forex trading tutor. Provide educational content about "${topic}" suitable for a ${difficulty || 'beginner'} level. The user has a ${userLevel || 'beginner'} level of knowledge.

Please provide:
1. Clear explanation of the concept
2. Practical examples
3. Key takeaways
4. A simple quiz question (multiple choice) to test understanding

Format your response in markdown with clear sections.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      content: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tutor API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

// Broker Matcher Proxy Endpoint
app.post('/api/broker-matcher', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const { preferences, tradingStyle, experience, budget, region } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Invalid preferences format' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a forex broker matching expert. Based on the following user preferences, recommend the most suitable brokers:

User Profile:
- Trading Style: ${tradingStyle || 'Not specified'}
- Experience Level: ${experience || 'Beginner'}
- Budget/Initial Deposit: ${budget || 'Not specified'}
- Region: ${region || 'Not specified'}
- Specific Preferences: ${JSON.stringify(preferences)}

Please analyze these requirements and recommend 3-5 brokers that would be most suitable. For each recommendation, provide:
1. Broker name
2. Why it matches their needs
3. Key features that benefit them
4. Any potential considerations

Format your response as a JSON array of broker recommendations with detailed explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      recommendations: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Broker Matcher API Error:', error);
    res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    });
  }
});

// Users API endpoints for development
app.post('/api/users', async (req, res) => {
  try {
    const { id, email, name, preferences } = req.body;
    
    // Validate required fields
    if (!id || !email || !name) {
      return res.status(400).json({
        error: 'Missing required fields: id, email, name'
      });
    }
    
    // Mock user data storage (in production, this would be a database)
    const mockUser = {
      id,
      email,
      name,
      preferences: preferences || {},
      created_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: [],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Created user:', mockUser);
    
    res.json({
      success: true,
      user: mockUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    // Mock user data (in production, this would be a database query)
    const mockUser = {
      id,
      email: `user-${id}@example.com`,
      name: `User ${id}`,
      preferences: {
        tradingLevel: 'beginner',
        riskTolerance: 'medium'
      },
      created_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: ['EUR/USD', 'GBP/USD'],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Retrieved user:', mockUser);
    
    res.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

app.put('/api/users', async (req, res) => {
  try {
    const { id, name, preferences } = req.body;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    // Mock updated user data
    const mockUpdatedUser = {
      id,
      email: `user-${id}@example.com`,
      name: name || `User ${id}`,
      preferences: preferences || {},
      updated_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: ['EUR/USD', 'GBP/USD'],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Updated user:', mockUpdatedUser);
    
    res.json({
      success: true,
      user: mockUpdatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    console.log('[Dev API] Deleted user:', id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

// Performance Analytics Endpoint
app.post('/api/analytics/performance', async (req, res) => {
  try {
    const performanceData = req.body;

    // Validate required fields
    if (!performanceData || typeof performanceData !== 'object') {
      return res.status(400).json({
        error: 'Invalid performance data format'
      });
    }

    // Validate required metrics
    const requiredFields = ['url', 'timestamp', 'metrics'];
    const missingFields = requiredFields.filter(field => !performanceData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Add server timestamp and processing info
    const enrichedData = {
      ...performanceData,
      serverTimestamp: new Date().toISOString(),
      processedAt: new Date().getTime(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      // Add performance analysis
      analysis: {
        performanceScore: calculatePerformanceScore(performanceData.metrics),
        recommendations: generatePerformanceRecommendations(performanceData.metrics),
        riskLevel: assessPerformanceRisk(performanceData.metrics)
      }
    };

    // Log performance data (in production, this would go to a database)
    console.log('[Performance Analytics]', {
      url: enrichedData.url,
      score: enrichedData.analysis.performanceScore,
      risk: enrichedData.analysis.riskLevel,
      timestamp: enrichedData.serverTimestamp
    });

    // Store performance data (in production, this would be saved to database)
    // For now, we'll just acknowledge receipt

    res.json({
      success: true,
      message: 'Performance data received',
      analysis: enrichedData.analysis,
      timestamp: enrichedData.serverTimestamp
    });

  } catch (error) {
    console.error('Performance Analytics API Error:', error);
    res.status(500).json({
      error: 'Failed to process performance data',
      message: error.message
    });
  }
});

// Helper function to calculate performance score
function calculatePerformanceScore(metrics) {
  let score = 100;

  // FCP scoring (0-2500ms = good, 2500-4000ms = needs improvement, >4000ms = poor)
  if (metrics.fcp) {
    if (metrics.fcp > 4000) score -= 30;
    else if (metrics.fcp > 2500) score -= 15;
  }

  // LCP scoring (0-2500ms = good, 2500-4000ms = needs improvement, >4000ms = poor)
  if (metrics.lcp) {
    if (metrics.lcp > 4000) score -= 30;
    else if (metrics.lcp > 2500) score -= 15;
  }

  // FID scoring (0-100ms = good, 100-300ms = needs improvement, >300ms = poor)
  if (metrics.fid) {
    if (metrics.fid > 300) score -= 20;
    else if (metrics.fid > 100) score -= 10;
  }

  // CLS scoring (0-0.1 = good, 0.1-0.25 = needs improvement, >0.25 = poor)
  if (metrics.cls) {
    if (metrics.cls > 0.25) score -= 25;
    else if (metrics.cls > 0.1) score -= 12;
  }

  // TTI scoring (0-3800ms = good, 3800-7300ms = needs improvement, >7300ms = poor)
  if (metrics.tti) {
    if (metrics.tti > 7300) score -= 25;
    else if (metrics.tti > 3800) score -= 12;
  }

  return Math.max(0, Math.min(100, score));
}

// Helper function to generate performance recommendations
function generatePerformanceRecommendations(metrics) {
  const recommendations = [];

  if (metrics.fcp && metrics.fcp > 2500) {
    recommendations.push('Optimize server response time and reduce render-blocking resources');
  }

  if (metrics.lcp && metrics.lcp > 2500) {
    recommendations.push('Optimize images and reduce main thread work');
  }

  if (metrics.fid && metrics.fid > 100) {
    recommendations.push('Reduce JavaScript execution time and break up long tasks');
  }

  if (metrics.cls && metrics.cls > 0.1) {
    recommendations.push('Ensure proper image dimensions and avoid layout shifts');
  }

  if (metrics.tti && metrics.tti > 3800) {
    recommendations.push('Reduce JavaScript bundles and optimize critical rendering path');
  }

  if (metrics.bundleSize && metrics.bundleSize > 1024 * 1024) {
    recommendations.push('Implement code splitting and tree shaking to reduce bundle size');
  }

  if (recommendations.length === 0) {
    recommendations.push('Performance is optimal - continue monitoring');
  }

  return recommendations;
}

// Helper function to assess performance risk
function assessPerformanceRisk(metrics) {
  let riskScore = 0;

  if (metrics.fcp && metrics.fcp > 4000) riskScore += 3;
  if (metrics.lcp && metrics.lcp > 4000) riskScore += 3;
  if (metrics.fid && metrics.fid > 300) riskScore += 2;
  if (metrics.cls && metrics.cls > 0.25) riskScore += 2;
  if (metrics.tti && metrics.tti > 7300) riskScore += 2;

  if (riskScore >= 8) return 'HIGH';
  if (riskScore >= 4) return 'MEDIUM';
  return 'LOW';
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔒 Secure API Proxy Server running on port ${PORT}`);
console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3005'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
