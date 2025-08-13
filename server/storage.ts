import { users, companies, jobs, jobApplications, resumeAnalyses, savedJobs, type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type JobApplication, type InsertJobApplication, type ResumeAnalysis, type InsertResumeAnalysis, type SavedJob, type InsertSavedJob } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, ilike, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Company methods
  getCompany(id: string): Promise<Company | undefined>;
  getCompanies(limit?: number, offset?: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined>;

  // Job methods
  getJob(id: string): Promise<(Job & { company: Company }) | undefined>;
  getJobs(filters?: {
    search?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[];
    limit?: number;
    offset?: number;
  }): Promise<(Job & { company: Company })[]>;
  getFeaturedJobs(limit?: number): Promise<(Job & { company: Company })[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined>;

  // Job Application methods
  getJobApplication(id: string): Promise<(JobApplication & { job: Job & { company: Company }; user: User }) | undefined>;
  getJobApplicationsByUser(userId: string): Promise<(JobApplication & { job: Job & { company: Company } })[]>;
  getJobApplicationsByJob(jobId: string): Promise<(JobApplication & { user: User })[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication | undefined>;

  // Resume Analysis methods
  getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined>;
  getResumeAnalysesByUser(userId: string): Promise<ResumeAnalysis[]>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;

  // Saved Jobs methods
  getSavedJobsByUser(userId: string): Promise<(SavedJob & { job: Job & { company: Company } })[]>;
  createSavedJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  deleteSavedJob(userId: string, jobId: string): Promise<boolean>;
  
  // Search methods
  searchJobs(query: string, limit?: number): Promise<(Job & { company: Company })[]>;
  getJobStats(): Promise<{ totalJobs: number; totalCompanies: number; totalCandidates: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser as any).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [user] = await db.update(users).set(updateData as any).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async getCompanies(limit = 50, offset = 0): Promise<Company[]> {
    return await db.select().from(companies).limit(limit).offset(offset).orderBy(desc(companies.createdAt));
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany as any).returning();
    return company;
  }

  async updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [company] = await db.update(companies).set(updateData as any).where(eq(companies.id, id)).returning();
    return company || undefined;
  }

  async getJob(id: string): Promise<(Job & { company: Company }) | undefined> {
    const [result] = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.jobs,
      company: result.companies
    };
  }

  async getJobs(filters?: {
    search?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[];
    limit?: number;
    offset?: number;
  }): Promise<(Job & { company: Company })[]> {
    let whereConditions = [eq(jobs.isActive, true)];

    if (filters?.search) {
      whereConditions.push(
        sql`${jobs.title} ILIKE ${`%${filters.search}%`} OR ${jobs.description} ILIKE ${`%${filters.search}%`}`
      );
    }

    if (filters?.location && filters.location !== "All Pakistan") {
      whereConditions.push(ilike(jobs.location, `%${filters.location}%`));
    }

    if (filters?.jobType) {
      whereConditions.push(eq(jobs.jobType, filters.jobType as any));
    }

    if (filters?.experienceLevel) {
      whereConditions.push(eq(jobs.experienceLevel, filters.experienceLevel as any));
    }

    if (filters?.salaryMin) {
      whereConditions.push(sql`${jobs.salaryMin} >= ${filters.salaryMin}`);
    }

    if (filters?.salaryMax) {
      whereConditions.push(sql`${jobs.salaryMax} <= ${filters.salaryMax}`);
    }

    const results = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(...whereConditions))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0)
      .orderBy(desc(jobs.createdAt));

    return results.map(result => ({
      ...result.jobs,
      company: result.companies
    }));
  }

  async getFeaturedJobs(limit = 6): Promise<(Job & { company: Company })[]> {
    const results = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true))
      .limit(limit)
      .orderBy(desc(jobs.createdAt));

    return results.map(result => ({
      ...result.jobs,
      company: result.companies
    }));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob as any).returning();
    return job;
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [job] = await db.update(jobs).set(updateData as any).where(eq(jobs.id, id)).returning();
    return job || undefined;
  }

  async getJobApplication(id: string): Promise<(JobApplication & { job: Job & { company: Company }; user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(users, eq(jobApplications.userId, users.id))
      .where(eq(jobApplications.id, id));

    if (!result) return undefined;

    return {
      ...result.job_applications,
      job: {
        ...result.jobs,
        company: result.companies
      },
      user: result.users
    };
  }

  async getJobApplicationsByUser(userId: string): Promise<(JobApplication & { job: Job & { company: Company } })[]> {
    const results = await db
      .select()
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobApplications.userId, userId))
      .orderBy(desc(jobApplications.appliedAt));

    return results.map(result => ({
      ...result.job_applications,
      job: {
        ...result.jobs,
        company: result.companies
      }
    }));
  }

  async getJobApplicationsByJob(jobId: string): Promise<(JobApplication & { user: User })[]> {
    const results = await db
      .select()
      .from(jobApplications)
      .innerJoin(users, eq(jobApplications.userId, users.id))
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.appliedAt));

    return results.map(result => ({
      ...result.job_applications,
      user: result.users
    }));
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const [application] = await db.insert(jobApplications).values(insertApplication).returning();
    return application;
  }

  async updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication | undefined> {
    const updateData = { ...updates, updatedAt: new Date() };
    const [application] = await db.update(jobApplications).set(updateData).where(eq(jobApplications.id, id)).returning();
    return application || undefined;
  }

  async getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined> {
    const [analysis] = await db.select().from(resumeAnalyses).where(eq(resumeAnalyses.id, id));
    return analysis || undefined;
  }

  async getResumeAnalysesByUser(userId: string): Promise<ResumeAnalysis[]> {
    return await db.select().from(resumeAnalyses).where(eq(resumeAnalyses.userId, userId)).orderBy(desc(resumeAnalyses.createdAt));
  }

  async createResumeAnalysis(insertAnalysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const [analysis] = await db.insert(resumeAnalyses).values(insertAnalysis as any).returning();
    return analysis;
  }

  async getSavedJobsByUser(userId: string): Promise<(SavedJob & { job: Job & { company: Company } })[]> {
    const results = await db
      .select()
      .from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(savedJobs.userId, userId))
      .orderBy(desc(savedJobs.savedAt));

    return results.map(result => ({
      ...result.saved_jobs,
      job: {
        ...result.jobs,
        company: result.companies
      }
    }));
  }

  async createSavedJob(insertSavedJob: InsertSavedJob): Promise<SavedJob> {
    const [savedJob] = await db.insert(savedJobs).values(insertSavedJob).returning();
    return savedJob;
  }

  async deleteSavedJob(userId: string, jobId: string): Promise<boolean> {
    const result = await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    return (result.rowCount || 0) > 0;
  }

  async searchJobs(query: string, limit = 20): Promise<(Job & { company: Company })[]> {
    const results = await db
      .select()
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(
        sql`${jobs.title} ILIKE ${`%${query}%`} OR ${jobs.description} ILIKE ${`%${query}%`} OR ${companies.name} ILIKE ${`%${query}%`}`
      )
      .limit(limit)
      .orderBy(desc(jobs.createdAt));

    return results.map(result => ({
      ...result.jobs,
      company: result.companies
    }));
  }

  async getJobStats(): Promise<{ totalJobs: number; totalCompanies: number; totalCandidates: number }> {
    const [jobCount] = await db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.isActive, true));
    const [companyCount] = await db.select({ count: sql<number>`count(*)` }).from(companies);
    const [candidateCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "job_seeker"));

    return {
      totalJobs: jobCount.count,
      totalCompanies: companyCount.count,
      totalCandidates: candidateCount.count
    };
  }
}

export const storage = new DatabaseStorage();
