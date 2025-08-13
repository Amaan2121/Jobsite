import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, Globe } from "lucide-react";

export default function Companies() {
  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4" data-testid="page-title">
            Explore Companies
          </h1>
          <p className="text-xl text-neutral-600">
            Discover amazing companies across Pakistan and find your next career opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))
          ) : companiesData?.companies?.length > 0 ? (
            companiesData.companies.map((company: any) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow cursor-pointer group" data-testid={`company-card-${company.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:bg-opacity-20 transition-colors">
                      <Building className="text-2xl text-primary" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-1" data-testid="company-name">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <Badge variant="secondary" className="mb-2">
                          {company.industry}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3" data-testid="company-description">
                      {company.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-neutral-600">
                    {company.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span data-testid="company-location">{company.location}</span>
                      </div>
                    )}
                    
                    {company.size && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span data-testid="company-size">{company.size}</span>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          data-testid="company-website"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {company.benefits && company.benefits.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-neutral-800 mb-2">Benefits</div>
                      <div className="flex flex-wrap gap-1">
                        {company.benefits.slice(0, 3).map((benefit: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {company.benefits.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{company.benefits.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="text-sm text-primary font-medium" data-testid="company-open-positions">
                      Open Positions Available
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                No companies found
              </h3>
              <p className="text-neutral-600">
                Companies will appear here once they start posting jobs on our platform.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
