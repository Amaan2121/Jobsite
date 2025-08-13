import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, RotateCcw } from "lucide-react";

interface AdvancedFiltersProps {
  filters: {
    search: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    salaryMin: string;
    salaryMax: string;
  };
  onFiltersChange: (filters: Partial<typeof filters>) => void;
}

export default function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const industries = [
    "All Industries",
    "Information Technology",
    "Banking & Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail"
  ];

  const experienceLevels = [
    "Any Experience",
    "Entry Level (0-2 years)",
    "Mid Level (3-5 years)",
    "Senior Level (6-10 years)",
    "Executive (10+ years)"
  ];

  const salaryRanges = [
    "Any Salary",
    "30,000 - 60,000",
    "60,000 - 100,000", 
    "100,000 - 150,000",
    "150,000+"
  ];

  const jobTypes = [
    "All Types",
    "Full-time",
    "Part-time", 
    "Contract",
    "Freelance",
    "Remote"
  ];

  const locations = [
    "All Pakistan",
    "Karachi",
    "Lahore",
    "Islamabad",
    "Faisalabad",
    "Rawalpindi"
  ];

  const handleReset = () => {
    onFiltersChange({
      search: "",
      location: "",
      jobType: "",
      experienceLevel: "",
      salaryMin: "",
      salaryMax: "",
    });
  };

  const handleSalaryRangeChange = (range: string) => {
    if (range === "Any Salary") {
      onFiltersChange({ salaryMin: "", salaryMax: "" });
      return;
    }
    
    const [min, max] = range.split(" - ");
    onFiltersChange({
      salaryMin: min?.replace(",", "") || "",
      salaryMax: max?.replace(",", "").replace("+", "") || "",
    });
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-filter">Search Keywords</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
            <Input
              id="search-filter"
              placeholder="Keywords..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
              data-testid="filter-search"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Select 
            value={filters.location || "All Pakistan"} 
            onValueChange={(value) => onFiltersChange({ location: value === "All Pakistan" ? "" : value })}
          >
            <SelectTrigger data-testid="filter-location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select 
            value={filters.jobType || "All Types"} 
            onValueChange={(value) => onFiltersChange({ jobType: value === "All Types" ? "" : value.toLowerCase().replace("-", "_") })}
          >
            <SelectTrigger data-testid="filter-job-type">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select 
            value={filters.experienceLevel || "Any Experience"} 
            onValueChange={(value) => {
              let level = "";
              if (value.includes("Entry")) level = "entry";
              else if (value.includes("Mid")) level = "mid";
              else if (value.includes("Senior")) level = "senior";
              else if (value.includes("Executive")) level = "executive";
              
              onFiltersChange({ experienceLevel: level });
            }}
          >
            <SelectTrigger data-testid="filter-experience">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Salary Range (PKR)</Label>
          <Select 
            value={
              !filters.salaryMin && !filters.salaryMax ? "Any Salary" :
              filters.salaryMin === "30000" && filters.salaryMax === "60000" ? "30,000 - 60,000" :
              filters.salaryMin === "60000" && filters.salaryMax === "100000" ? "60,000 - 100,000" :
              filters.salaryMin === "100000" && filters.salaryMax === "150000" ? "100,000 - 150,000" :
              filters.salaryMin === "150000" ? "150,000+" : "Any Salary"
            }
            onValueChange={handleSalaryRangeChange}
          >
            <SelectTrigger data-testid="filter-salary">
              <SelectValue placeholder="Select salary range" />
            </SelectTrigger>
            <SelectContent>
              {salaryRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
            data-testid="button-reset-filters"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
