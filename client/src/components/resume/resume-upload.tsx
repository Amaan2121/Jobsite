import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ResumeUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);
      
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to upload resume");

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to upload resume");
      return response.json();
    },
    onSuccess: async (data) => {
      setUploadProgress(100);
      
      // Simulate AI analysis with mock data for demonstration
      const mockAnalysis = {
        atsScore: 85,
        keywordOptimization: 72,
        suggestions: [
          "Add more specific technical skills",
          "Include quantifiable achievements",
          "Improve keyword density for ATS compatibility"
        ]
      };
      
      setTimeout(() => {
        setAnalysisResult(mockAnalysis);
        toast({
          title: "Resume uploaded successfully!",
          description: "AI analysis is complete. Check your results below.",
        });
      }, 1500);
    },
    onError: (error: any) => {
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (resumeText: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to analyze resume");

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ resumeText })
      });

      if (!response.ok) throw new Error("Failed to analyze resume");
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadProgress(0);
    setAnalysisResult(null);
    uploadMutation.mutate(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-6">
      {!analysisResult ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? "border-primary bg-primary bg-opacity-5" 
              : "border-neutral-300 hover:border-primary"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('resume-upload')?.click()}
          data-testid="resume-drop-zone"
        >
          <input
            id="resume-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            data-testid="resume-file-input"
          />
          
          <CloudUpload className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          
          <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-neutral-600 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <p className="text-sm text-neutral-500 mb-4">
            Supports PDF, DOC, DOCX (Max 5MB)
          </p>
          
          <Button
            variant="outline"
            disabled={uploadMutation.isPending}
            data-testid="button-choose-file"
          >
            {uploadMutation.isPending ? "Uploading..." : "Choose File"}
          </Button>
          
          {uploadMutation.isPending && uploadProgress > 0 && (
            <div className="mt-4 max-w-xs mx-auto">
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-neutral-600">
                Uploading and analyzing... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">AI Analysis Complete</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ATS Compatibility Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-neutral-200 rounded-full">
                    <div 
                      className="h-2 bg-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.atsScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium" data-testid="ats-score">
                    {analysisResult.atsScore}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Keyword Optimization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-neutral-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.keywordOptimization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium" data-testid="keyword-score">
                    {analysisResult.keywordOptimization}%
                  </span>
                </div>
              </div>
              
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <h4 className="font-medium text-blue-900">Improvement Suggestions</h4>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span data-testid={`suggestion-${index}`}>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Button variant="outline" data-testid="button-view-detailed-analysis">
                View Detailed Analysis →
              </Button>
              <Button 
                onClick={() => {
                  setAnalysisResult(null);
                  setUploadProgress(0);
                }}
                data-testid="button-upload-another"
              >
                Upload Another Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
