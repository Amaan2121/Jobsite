import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, Star } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: applications } = useQuery({
    queryKey: ["/api/applications"],
    enabled: !!user,
  });

  const { data: savedJobs } = useQuery({
    queryKey: ["/api/saved-jobs"],
    enabled: !!user,
  });

  const { data: resumeAnalyses } = useQuery({
    queryKey: ["/api/resume/analyses"],
    enabled: !!user,
  });

  if (!user && !isLoading) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-primary to-blue-700 p-6 text-white rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <User className="text-2xl" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold" data-testid="user-name">
                          {user?.user?.firstName} {user?.user?.lastName}
                        </h1>
                        <p className="text-blue-100" data-testid="user-role">
                          {user?.user?.role === "job_seeker" ? "Job Seeker" : user?.user?.role}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
                      data-testid="button-edit-profile"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-neutral-600">
                      <Mail className="w-5 h-5" />
                      <span data-testid="user-email">{user?.user?.email}</span>
                    </div>
                    {user?.user?.phone && (
                      <div className="flex items-center space-x-3 text-neutral-600">
                        <Phone className="w-5 h-5" />
                        <span data-testid="user-phone">{user.user.phone}</span>
                      </div>
                    )}
                    {user?.user?.location && (
                      <div className="flex items-center space-x-3 text-neutral-600">
                        <MapPin className="w-5 h-5" />
                        <span data-testid="user-location">{user.user.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {user?.user?.experience && (
                      <div className="flex items-start space-x-3 text-neutral-600">
                        <Briefcase className="w-5 h-5 mt-1" />
                        <div>
                          <div className="font-medium">Experience</div>
                          <div className="text-sm" data-testid="user-experience">{user.user.experience}</div>
                        </div>
                      </div>
                    )}
                    {user?.user?.education && (
                      <div className="flex items-start space-x-3 text-neutral-600">
                        <GraduationCap className="w-5 h-5 mt-1" />
                        <div>
                          <div className="font-medium">Education</div>
                          <div className="text-sm" data-testid="user-education">{user.user.education}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {user?.user?.skills && user.user.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-neutral-800 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.user.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" data-testid={`skill-${index}`}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user?.user?.bio && (
                  <div className="mt-6">
                    <h3 className="font-medium text-neutral-800 mb-3">About</h3>
                    <p className="text-neutral-600" data-testid="user-bio">{user.user.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dashboard Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-applications">
                    {applications?.applications?.length || 0}
                  </div>
                  <div className="text-neutral-600">Applications</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {applications?.applications?.filter((app: any) => app.status === "interview_scheduled").length || 0}
                  </div>
                  <div className="text-neutral-600">Interviews</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent" data-testid="stat-saved-jobs">
                    {savedJobs?.savedJobs?.length || 0}
                  </div>
                  <div className="text-neutral-600">Saved Jobs</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-neutral-600">0</div>
                  <div className="text-neutral-600">Profile Views</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Recent Applications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications?.applications?.length > 0 ? (
                    <div className="space-y-4">
                      {applications.applications.slice(0, 5).map((application: any) => (
                        <div key={application.id} className="flex justify-between items-center p-3 border border-neutral-200 rounded-lg" data-testid={`application-${application.id}`}>
                          <div>
                            <div className="font-medium" data-testid="application-job-title">
                              {application.job.title}
                            </div>
                            <div className="text-sm text-neutral-600" data-testid="application-company">
                              {application.job.company.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                application.status === "accepted" ? "default" :
                                application.status === "interview_scheduled" ? "secondary" :
                                application.status === "rejected" ? "destructive" :
                                "outline"
                              }
                              data-testid="application-status"
                            >
                              {application.status.replace("_", " ")}
                            </Badge>
                            <div className="text-xs text-neutral-500 mt-1">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-600">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
                      <p>No applications yet</p>
                      <p className="text-sm">Start applying to jobs to see your applications here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Career Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>AI Career Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary bg-opacity-5 rounded-lg border border-primary border-opacity-20">
                      <div className="flex items-start space-x-3">
                        <Star className="text-primary mt-1 w-4 h-4" />
                        <div>
                          <h5 className="font-medium text-primary mb-1">Profile Optimization</h5>
                          <p className="text-sm text-neutral-700">
                            Complete your profile to increase visibility to employers by 60%.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-secondary bg-opacity-5 rounded-lg border border-secondary border-opacity-20">
                      <div className="flex items-start space-x-3">
                        <Star className="text-secondary mt-1 w-4 h-4" />
                        <div>
                          <h5 className="font-medium text-secondary mb-1">Skill Recommendation</h5>
                          <p className="text-sm text-neutral-700">
                            Add trending skills like React or Node.js to match more job opportunities.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent bg-opacity-5 rounded-lg border border-accent border-opacity-20">
                      <div className="flex items-start space-x-3">
                        <Star className="text-accent mt-1 w-4 h-4" />
                        <div>
                          <h5 className="font-medium text-accent mb-1">Market Trend</h5>
                          <p className="text-sm text-neutral-700">
                            Job opportunities in your field have increased by 25% this month.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
