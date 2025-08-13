import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume, calculateJobMatch, generateCoverLetter } from "./services/ai";
import { loginSchema, registerSchema, insertJobSchema, insertJobApplicationSchema, insertResumeAnalysisSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { confirmPassword, ...userData } = validatedData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    res.json({ user: req.user });
  });

  // Job routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const {
        search,
        location,
        jobType,
        experienceLevel,
        salaryMin,
        salaryMax,
        limit = '20',
        offset = '0'
      } = req.query;

      const jobs = await storage.getJobs({
        search: search as string,
        location: location as string,
        jobType: jobType as string,
        experienceLevel: experienceLevel as string,
        salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json({ jobs });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch jobs' });
    }
  });

  app.get('/api/jobs/featured', async (req, res) => {
    try {
      const jobs = await storage.getFeaturedJobs(6);
      res.json({ jobs });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch featured jobs' });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json({ job });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch job' });
    }
  });

  app.post('/api/jobs', authenticateToken, async (req: any, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...jobData,
        postedById: req.user.id,
      });
      res.status(201).json({ job });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create job' });
    }
  });

  // Company routes
  app.get('/api/companies', async (req, res) => {
    try {
      const { limit = '50', offset = '0' } = req.query;
      const companies = await storage.getCompanies(
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json({ companies });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch companies' });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.json({ company });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch company' });
    }
  });

  // Job Application routes
  app.get('/api/applications', authenticateToken, async (req: any, res) => {
    try {
      const applications = await storage.getJobApplicationsByUser(req.user.id);
      res.json({ applications });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch applications' });
    }
  });

  app.post('/api/applications', authenticateToken, async (req: any, res) => {
    try {
      const applicationData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication({
        ...applicationData,
        userId: req.user.id,
      });
      res.status(201).json({ application });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create application' });
    }
  });

  // Resume routes
  app.post('/api/resume/upload', authenticateToken, upload.single('resume'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // In a real app, you'd upload to cloud storage (S3, etc.)
      const resumeUrl = `/uploads/${req.file.filename}`;
      
      // Update user's resume URL
      await storage.updateUser(req.user.id, { resumeUrl });

      res.json({
        message: 'Resume uploaded successfully',
        resumeUrl,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to upload resume' });
    }
  });

  app.post('/api/resume/analyze', authenticateToken, async (req: any, res) => {
    try {
      const { resumeText, targetJobTitle } = req.body;

      if (!resumeText) {
        return res.status(400).json({ message: 'Resume text is required' });
      }

      const analysis = await analyzeResume(resumeText, targetJobTitle);
      
      // Save analysis to database
      const savedAnalysis = await storage.createResumeAnalysis({
        userId: req.user.id,
        resumeUrl: req.user.resumeUrl || '',
        atsScore: analysis.atsScore.toString(),
        keywordOptimization: analysis.keywordOptimization.toString(),
        suggestions: analysis.suggestions,
        analysisData: analysis.analysisData,
      });

      res.json({ analysis, id: savedAnalysis.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to analyze resume' });
    }
  });

  app.get('/api/resume/analyses', authenticateToken, async (req: any, res) => {
    try {
      const analyses = await storage.getResumeAnalysesByUser(req.user.id);
      res.json({ analyses });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch analyses' });
    }
  });

  // Saved Jobs routes
  app.get('/api/saved-jobs', authenticateToken, async (req: any, res) => {
    try {
      const savedJobs = await storage.getSavedJobsByUser(req.user.id);
      res.json({ savedJobs });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch saved jobs' });
    }
  });

  app.post('/api/saved-jobs', authenticateToken, async (req: any, res) => {
    try {
      const { jobId } = req.body;
      const savedJob = await storage.createSavedJob({
        userId: req.user.id,
        jobId,
      });
      res.status(201).json({ savedJob });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to save job' });
    }
  });

  app.delete('/api/saved-jobs/:jobId', authenticateToken, async (req: any, res) => {
    try {
      const success = await storage.deleteSavedJob(req.user.id, req.params.jobId);
      if (!success) {
        return res.status(404).json({ message: 'Saved job not found' });
      }
      res.json({ message: 'Job removed from saved list' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to remove saved job' });
    }
  });

  // Search routes
  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const jobs = await storage.searchJobs(q as string);
      res.json({ jobs });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Search failed' });
    }
  });

  // Stats route
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getJobStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch stats' });
    }
  });

  // AI routes
  app.post('/api/ai/job-match', authenticateToken, async (req: any, res) => {
    try {
      const { jobId, resumeText } = req.body;
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const matchResult = await calculateJobMatch(
        resumeText,
        job.description,
        job.title
      );

      res.json({ match: matchResult });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to calculate job match' });
    }
  });

  app.post('/api/ai/cover-letter', authenticateToken, async (req: any, res) => {
    try {
      const { jobId, resumeText } = req.body;
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const coverLetter = await generateCoverLetter(
        resumeText,
        job.description,
        job.title,
        job.company.name
      );

      res.json({ coverLetter });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate cover letter' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
