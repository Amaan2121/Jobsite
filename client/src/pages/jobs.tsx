import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import JobCard from "@/components/job/job-card";
import AdvancedFilters from "@/components/job/advanced-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Jobs() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    limit: 20,
    offset: 0,
  });

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const loadMore = () => {
    setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4" data-testid="page-title">
            Find Your Perfect Job
          </h1>
          <p className="text-xl text-neutral-600">
            Discover thousands of job opportunities across Pakistan
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <div className="text-neutral-600" data-testid="results-count">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${jobsData?.jobs?.length || 0} jobs found`
                )}
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))
              ) : jobsData?.jobs?.length > 0 ? (
                <>
                  {jobsData.jobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                  
                  {jobsData.jobs.length === filters.limit && (
                    <div className="text-center pt-8">
                      <Button 
                        onClick={loadMore}
                        variant="outline"
                        size="lg"
                        data-testid="button-load-more"
                      >
                        Load More Jobs
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your search filters to find more opportunities.
                  </p>
                  <Button 
                    onClick={() => setFilters({
                      search: "",
                      location: "",
                      jobType: "",
                      experienceLevel: "",
                      salaryMin: "",
                      salaryMax: "",
                      limit: 20,
                      offset: 0,
                    })}
                    data-testid="button-reset-filters"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
