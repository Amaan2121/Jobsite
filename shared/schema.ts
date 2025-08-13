import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const jobTypeEnum = pgEnum("job_type", ["full_time", "part_time", "contract", "freelance", "remote"]);
export const experienceLevelEnum = pgEnum("experience_level", ["entry", "mid", "senior", "executive"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "under_review", "interview_scheduled", "rejected", "accepted"]);
export const userRoleEnum = pgEnum("user_role", ["job_seeker", "employer", "admin"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default("job_seeker"),
  profilePicture: text("profile_picture"),
  phone: text("phone"),
  location: text("location"),
  bio: text("bio"),
  skills: jsonb("skills").$type<string[]>().default([]),
  experience: text("experience"),
  education: text("education"),
  resumeUrl: text("resume_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  portfolioUrl: text("portfolio_url"),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry"),
  size: text("size"),
  website: text("website"),
  logo: text("logo"),
  location: text("location"),
  foundedYear: integer("founded_year"),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  culture: text("culture"),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  location: text("location").notNull(),
  jobType: jobTypeEnum("job_type").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  currency: text("currency").default("PKR"),
  skills: jsonb("skills").$type<string[]>().default([]),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  isRemote: boolean("is_remote").default(false),
  isActive: boolean("is_active").default(true),
  postedById: uuid("posted_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Job Applications table
export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: applicationStatusEnum("status").default("pending"),
  aiMatchScore: decimal("ai_match_score", { precision: 5, scale: 2 }),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resume Analysis table
export const resumeAnalyses = pgTable("resume_analyses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  resumeUrl: text("resume_url").notNull(),
  atsScore: decimal("ats_score", { precision: 5, scale: 2 }),
  keywordOptimization: decimal("keyword_optimization", { precision: 5, scale: 2 }),
  suggestions: jsonb("suggestions").$type<string[]>().default([]),
  analysisData: jsonb("analysis_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved Jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// LaTeX Resume Templates table
export const latexResumeTemplates = pgTable("latex_resume_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  resumeData: jsonb("resume_data").notNull(),
  latexContent: text("latex_content").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  applications: many(jobApplications),
  savedJobs: many(savedJobs),
  resumeAnalyses: many(resumeAnalyses),
  ownedCompany: one(companies, {
    fields: [users.id],
    references: [companies.ownerId],
  }),
  postedJobs: many(jobs),
}));

export const companiesRelations = relations(companies, ({ many, one }) => ({
  jobs: many(jobs),
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ many, one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(jobApplications),
  savedByUsers: many(savedJobs),
  postedBy: one(users, {
    fields: [jobs.postedById],
    references: [users.id],
  }),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, {
    fields: [savedJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

export const resumeAnalysesRelations = relations(resumeAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [resumeAnalyses.userId],
    references: [users.id],
  }),
}));

export const latexResumeTemplatesRelations = relations(latexResumeTemplates, ({ one }) => ({
  user: one(users, {
    fields: [latexResumeTemplates.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  appliedAt: true,
  updatedAt: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  savedAt: true,
});

export const insertLatexResumeTemplateSchema = createInsertSchema(latexResumeTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;
export type LatexResumeTemplate = typeof latexResumeTemplates.$inferSelect;
export type InsertLatexResumeTemplate = z.infer<typeof insertLatexResumeTemplateSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
