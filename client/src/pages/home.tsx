import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import JobSearch from "@/components/job/job-search";
import JobCard from "@/components/job/job-card";
import CompanyCard from "@/components/company/company-card";
import ResumeUpload from "@/components/resume/resume-upload";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, TrendingUp, Database, Building, Heart, ShoppingCart } from "lucide-react";

export default function Home() {
  const { data: featuredJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/featured"],
  });

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job with
              <span className="text-yellow-300"> AI Power</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Pakistan's first AI-powered job platform. Get personalized job matches, AI-optimized resumes, and career guidance.
            </p>
            
            <JobSearch />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-total-jobs">
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 mx-auto" />
                ) : (
                  `${stats?.totalJobs?.toLocaleString() || 0}+`
                )}
              </div>
              <div className="text-neutral-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-companies">
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 mx-auto" />
                ) : (
                  `${stats?.totalCompanies?.toLocaleString() || 0}+`
                )}
              </div>
              <div className="text-neutral-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-candidates">
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 mx-auto" />
                ) : (
                  `${stats?.totalCandidates?.toLocaleString() || 0}+`
                )}
              </div>
              <div className="text-neutral-600">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-neutral-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">AI-Powered Career Tools</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Leverage artificial intelligence to boost your job search and career growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow" data-testid="feature-resume-optimizer">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <Code className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Resume Optimizer</h3>
              <p className="text-neutral-600 mb-6">Get personalized suggestions to improve your resume and beat ATS systems with our advanced AI analysis.</p>
              <button className="text-primary font-medium hover:underline" data-testid="button-try-resume-ai">Try Resume AI →</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow" data-testid="feature-job-matching">
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="text-2xl text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Job Matching</h3>
              <p className="text-neutral-600 mb-6">Our AI analyzes your skills, experience, and preferences to find the perfect job matches for you.</p>
              <button className="text-secondary font-medium hover:underline" data-testid="button-explore-matches">Explore Matches →</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow" data-testid="feature-career-assistant">
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <Database className="text-2xl text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24/7 Career Assistant</h3>
              <p className="text-neutral-600 mb-6">Chat with our AI assistant for career advice, interview tips, and personalized job recommendations.</p>
              <button className="text-accent font-medium hover:underline" data-testid="button-chat-now">Chat Now →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-800">Featured Jobs</h2>
            <a href="/jobs" className="text-primary font-medium hover:underline" data-testid="link-view-all-jobs">View All Jobs →</a>
          </div>
          
          <div className="grid gap-6">
            {jobsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            ) : featuredJobs?.jobs?.length > 0 ? (
              featuredJobs.jobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center py-12 text-neutral-600">
                <p>No featured jobs available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Company Spotlight */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Top Companies Hiring</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover career opportunities with Pakistan's leading companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {companiesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))
            ) : companies?.companies?.length > 0 ? (
              companies.companies.slice(0, 6).map((company: any) => (
                <CompanyCard key={company.id} company={company} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-neutral-600">
                <p>No companies available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resume Upload & AI Analysis Demo */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">AI-Powered Resume Analysis</h2>
              <p className="text-xl mb-8 text-blue-100">
                Upload your resume and get instant AI feedback to improve your chances of landing your dream job.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">ATS Compatibility Check</h4>
                    <p className="text-blue-100">Ensure your resume passes through applicant tracking systems</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Keyword Optimization</h4>
                    <p className="text-blue-100">AI suggests relevant keywords for your target industry</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Content Improvement</h4>
                    <p className="text-blue-100">Get suggestions to enhance your resume content and structure</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-neutral-800">
              <ResumeUpload />
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard Preview */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Your Personal Job Dashboard</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Track applications, manage your profile, and get AI-powered career insights
            </p>
          </div>
          
          <UserDashboard />
        </div>
      </section>

      <Footer />
    </div>
  );
}
