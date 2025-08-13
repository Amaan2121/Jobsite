import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    logo?: string;
    industry?: string;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  // Mock open jobs count since it's not in the actual data structure
  const openJobs = Math.floor(Math.random() * 30) + 5;

  return (
    <Card className="hover:shadow-md transition-shadow text-center group cursor-pointer" data-testid={`company-card-${company.id}`}>
      <CardContent className="p-6">
        <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:bg-opacity-20 transition-colors">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <Building className="w-8 h-8 text-primary" />
          )}
        </div>
        <h3 className="font-semibold text-neutral-800 mb-1" data-testid="company-name">
          {company.name}
        </h3>
        <p className="text-sm text-neutral-600" data-testid="company-open-jobs">
          {openJobs} open jobs
        </p>
      </CardContent>
    </Card>
  );
}
