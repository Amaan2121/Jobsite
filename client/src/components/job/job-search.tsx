import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Sparkles } from "lucide-react";

export default function JobSearch() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedLocation && selectedLocation !== "all") params.append("location", selectedLocation);
    
    setLocation(`/jobs?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularSearches = [
    "Software Engineer",
    "Marketing Manager", 
    "Data Analyst",
    "Sales Executive"
  ];

  const locations = [
    { value: "all", label: "All Pakistan" },
    { value: "karachi", label: "Karachi" },
    { value: "lahore", label: "Lahore" },
    { value: "islamabad", label: "Islamabad" },
    { value: "faisalabad", label: "Faisalabad" },
    { value: "rawalpindi", label: "Rawalpindi" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Job title, skills, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800"
            data-testid="search-input"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-400 z-10" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800" data-testid="location-select">
              <SelectValue placeholder="All Pakistan" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleSearch}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
          data-testid="search-button"
        >
          <Sparkles className="w-5 h-5" />
          <span>AI Search</span>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-neutral-600">Popular searches:</span>
        {popularSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => {
              setSearchTerm(search);
              const params = new URLSearchParams();
              params.append("search", search);
              if (selectedLocation && selectedLocation !== "all") params.append("location", selectedLocation);
              setLocation(`/jobs?${params.toString()}`);
            }}
            className="text-primary hover:underline"
            data-testid={`popular-search-${index}`}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
