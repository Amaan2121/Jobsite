import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Star, Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
    salaryMin?: string;
    salaryMax?: string;
    currency?: string;
    skills: string[];
    company: {
      id: string;
      name: string;
      logo?: string;
    };
    createdAt: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to save jobs");
      
      const response = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: job.id })
      });
      
      if (!response.ok) throw new Error("Failed to save job");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job saved!",
        description: "This job has been added to your saved jobs.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to apply for jobs");
      
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: job.id })
      });
      
      if (!response.ok) throw new Error("Failed to apply for job");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to apply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const currency = job.currency || "PKR";
    
    if (job.salaryMin && job.salaryMax) {
      return `${currency} ${parseInt(job.salaryMin).toLocaleString()} - ${parseInt(job.salaryMax).toLocaleString()}`;
    }
    
    if (job.salaryMin) {
      return `${currency} ${parseInt(job.salaryMin).toLocaleString()}+`;
    }
    
    return null;
  };

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full_time": return "bg-green-100 text-green-800";
      case "part_time": return "bg-yellow-100 text-yellow-800";
      case "contract": return "bg-blue-100 text-blue-800";
      case "freelance": return "bg-purple-100 text-purple-800";
      case "remote": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`job-card-${job.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start space-x-4 mb-4 sm:mb-0 flex-grow">
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.company.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="text-primary font-semibold text-sm">
                  {job.company.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-semibold text-neutral-800 mb-1" data-testid="job-title">
                {job.title}
              </h3>
              <p className="text-primary font-medium mb-2" data-testid="job-company">
                {job.company.name}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-3 text-sm text-neutral-600">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span data-testid="job-location">{job.location}</span>
                </span>
                
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid="job-type">
                    {job.jobType.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </span>
                
                {formatSalary() && (
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span data-testid="job-salary">{formatSalary()}</span>
                  </span>
                )}
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs"
                      data-testid={`job-skill-${index}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end space-y-3 sm:ml-4">
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <Star className="w-4 h-4 fill-current" />
              <span data-testid="job-match-score">AI Match</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveJobMutation.mutate()}
                disabled={saveJobMutation.isPending}
                data-testid="button-save-job"
              >
                <Heart className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending}
                data-testid="button-apply-job"
              >
                {applyMutation.isPending ? "Applying..." : "Apply Now"}
              </Button>
            </div>
            
            <div className="text-xs text-neutral-500">
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
