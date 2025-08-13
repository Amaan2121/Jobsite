import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Briefcase, Star, TrendingUp, Target } from "lucide-react";

export default function UserDashboard() {
  // Mock data for demonstration
  const mockUser = {
    name: "Ahmad Hassan",
    title: "Software Engineer",
  };

  const mockStats = {
    applications: 12,
    interviews: 3,
    saved: 25,
    profileViews: 89,
  };

  const mockApplications = [
    {
      id: "1",
      jobTitle: "Frontend Developer",
      company: "TechCorp",
      status: "under_review",
      appliedDate: "2 days ago",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "2", 
      jobTitle: "Data Analyst",
      company: "DataFirm PK",
      status: "interview_scheduled",
      appliedDate: "5 days ago",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "3",
      jobTitle: "Product Manager", 
      company: "InnovatePK",
      status: "rejected",
      appliedDate: "1 week ago",
      statusColor: "bg-red-100 text-red-800",
    },
  ];

  const mockInsights = [
    {
      type: "skill",
      icon: Star,
      color: "primary",
      title: "Skill Recommendation",
      message: "Consider learning React Native to increase your mobile development opportunities by 40%.",
    },
    {
      type: "trend",
      icon: TrendingUp,
      color: "secondary", 
      title: "Market Trend",
      message: "Frontend Developer roles in Lahore have increased by 25% this month.",
    },
    {
      type: "optimization",
      icon: Target,
      color: "accent",
      title: "Profile Optimization",
      message: "Add 2-3 more skills to your profile to improve job matching by 15%.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "interview_scheduled": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold" data-testid="dashboard-user-name">
                {mockUser.name}
              </h3>
              <p className="text-blue-100" data-testid="dashboard-user-title">
                {mockUser.title}
              </p>
            </div>
          </div>
          <Button 
            variant="outline"
            className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
            data-testid="button-edit-profile-dashboard"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="dashboard-stat-applications">
              {mockStats.applications}
            </div>
            <div className="text-neutral-600">Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary" data-testid="dashboard-stat-interviews">
              {mockStats.interviews}
            </div>
            <div className="text-neutral-600">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent" data-testid="dashboard-stat-saved">
              {mockStats.saved}
            </div>
            <div className="text-neutral-600">Saved Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-600" data-testid="dashboard-stat-profile-views">
              {mockStats.profileViews}
            </div>
            <div className="text-neutral-600">Profile Views</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Applications
            </h4>
            <div className="space-y-3">
              {mockApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                  data-testid={`dashboard-application-${application.id}`}
                >
                  <div>
                    <div className="font-medium" data-testid="dashboard-application-title">
                      {application.jobTitle}
                    </div>
                    <div className="text-sm text-neutral-600" data-testid="dashboard-application-company">
                      {application.company}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`${getStatusColor(application.status)} mb-1`}
                      data-testid="dashboard-application-status"
                    >
                      {formatStatus(application.status)}
                    </Badge>
                    <div className="text-xs text-neutral-500" data-testid="dashboard-application-date">
                      {application.appliedDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Career Insights */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              AI Career Insights
            </h4>
            <div className="space-y-4">
              {mockInsights.map((insight, index) => {
                const IconComponent = insight.icon;
                const colorClasses = {
                  primary: "bg-primary bg-opacity-5 border-primary border-opacity-20 text-primary",
                  secondary: "bg-secondary bg-opacity-5 border-secondary border-opacity-20 text-secondary", 
                  accent: "bg-accent bg-opacity-5 border-accent border-opacity-20 text-accent",
                };
                
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${colorClasses[insight.color as keyof typeof colorClasses]}`}
                    data-testid={`dashboard-insight-${index}`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`mt-1 w-4 h-4 ${
                        insight.color === 'primary' ? 'text-primary' :
                        insight.color === 'secondary' ? 'text-secondary' : 'text-accent'
                      }`} />
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          insight.color === 'primary' ? 'text-primary' :
                          insight.color === 'secondary' ? 'text-secondary' : 'text-accent'
                        }`} data-testid="dashboard-insight-title">
                          {insight.title}
                        </h5>
                        <p className="text-sm text-neutral-700" data-testid="dashboard-insight-message">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
