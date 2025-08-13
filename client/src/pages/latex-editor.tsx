import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { FileText, Download, Save, Sparkles, Eye, Code, Plus, Trash2, Edit3 } from 'lucide-react';

interface LaTeXResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  education: Array<{
    institution: string;
    location: string;
    degree: string;
    startDate: string;
    endDate: string;
    details?: string[];
  }>;
  experience: Array<{
    company: string;
    location: string;
    position: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  leadership?: Array<{
    organization: string;
    position: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  certifications?: string[];
  skills?: string[];
}

interface Template {
  id: string;
  name: string;
  resumeData: LaTeXResumeData;
  latexContent: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LaTeXEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('editor');
  const [templateName, setTemplateName] = useState('My Resume');
  const [latexContent, setLatexContent] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(true);

  // Initialize with sample data from the provided template
  const [resumeData, setResumeData] = useState<LaTeXResumeData>({
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '+92 300 1234567',
    linkedin: 'https://www.linkedin.com/in/yourprofile',
    education: [
      {
        institution: 'University Name',
        location: 'City, Pakistan',
        degree: 'Your Degree',
        startDate: 'Month Year',
        endDate: 'Month Year',
        details: ['Relevant coursework or achievements']
      }
    ],
    experience: [
      {
        company: 'Company Name',
        location: 'City, Pakistan',
        position: 'Your Position',
        startDate: 'Month Year',
        endDate: 'Month Year',
        achievements: ['Your key achievement or responsibility']
      }
    ],
    leadership: [
      {
        organization: 'Organization Name',
        position: 'Your Role',
        startDate: 'Month Year',
        endDate: 'Month Year',
        achievements: ['Your contribution or achievement']
      }
    ],
    certifications: ['Your certification or award'],
    skills: ['Skill 1', 'Skill 2', 'Skill 3']
  });

  // Fetch user's templates
  const { data: templatesData } = useQuery({
    queryKey: ['/api/latex-templates'],
    enabled: true
  });

  // Generate LaTeX mutation
  const generateLatexMutation = useMutation({
    mutationFn: (data: LaTeXResumeData) => apiRequest('/api/latex-templates/generate', {
      method: 'POST',
      body: { resumeData: data }
    }),
    onSuccess: (data: any) => {
      setLatexContent(data.latexContent);
      toast({
        title: 'Success',
        description: 'LaTeX resume generated successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate LaTeX resume',
        variant: 'destructive'
      });
    }
  });

  // Enhance resume mutation
  const enhanceResumeMutation = useMutation({
    mutationFn: ({ data, targetJobTitle }: { data: LaTeXResumeData; targetJobTitle?: string }) => 
      apiRequest('/api/latex-templates/enhance', {
        method: 'POST',
        body: { resumeData: data, targetJobTitle }
      }),
    onSuccess: (data: any) => {
      setResumeData(data.enhancedData);
      toast({
        title: 'Success',
        description: 'Resume enhanced with AI suggestions!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to enhance resume',
        variant: 'destructive'
      });
    }
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: (templateData: any) => {
      if (isNewTemplate) {
        return apiRequest('/api/latex-templates', {
          method: 'POST',
          body: templateData
        });
      } else {
        return apiRequest(`/api/latex-templates/${currentTemplate?.id}`, {
          method: 'PUT',
          body: templateData
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/latex-templates'] });
      toast({
        title: 'Success',
        description: 'Template saved successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        variant: 'destructive'
      });
    }
  });

  const handleGenerateLatex = () => {
    generateLatexMutation.mutate(resumeData);
  };

  const handleEnhanceResume = (targetJobTitle?: string) => {
    enhanceResumeMutation.mutate({ data: resumeData, targetJobTitle });
  };

  const handleSaveTemplate = () => {
    if (!latexContent) {
      handleGenerateLatex();
      return;
    }

    saveTemplateMutation.mutate({
      name: templateName,
      resumeData,
      latexContent,
      isDefault: false
    });
  };

  const handleLoadTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setResumeData(template.resumeData);
    setLatexContent(template.latexContent);
    setTemplateName(template.name);
    setIsNewTemplate(false);
  };

  const handleNewTemplate = () => {
    setCurrentTemplate(null);
    setIsNewTemplate(true);
    setTemplateName('New Resume');
    // Reset to default data
    setResumeData({
      name: 'Your Name',
      email: 'your.email@example.com',
      phone: '+92 300 1234567',
      linkedin: 'https://www.linkedin.com/in/yourprofile',
      education: [],
      experience: [],
      leadership: [],
      certifications: [],
      skills: []
    });
    setLatexContent('');
  };

  const updateResumeField = (section: keyof LaTeXResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  };

  const addEducation = () => {
    updateResumeField('education', [
      ...resumeData.education,
      {
        institution: '',
        location: '',
        degree: '',
        startDate: '',
        endDate: '',
        details: []
      }
    ]);
  };

  const addExperience = () => {
    updateResumeField('experience', [
      ...resumeData.experience,
      {
        company: '',
        location: '',
        position: '',
        startDate: '',
        endDate: '',
        achievements: []
      }
    ]);
  };

  const addLeadership = () => {
    updateResumeField('leadership', [
      ...(resumeData.leadership || []),
      {
        organization: '',
        position: '',
        startDate: '',
        endDate: '',
        achievements: []
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI LaTeX Resume Editor</h1>
            <p className="text-muted-foreground mt-2">
              Create professional resumes with advanced LaTeX formatting and AI assistance
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Resume Templates</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  <Button onClick={handleNewTemplate} variant="outline" className="justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Template
                  </Button>
                  {templatesData?.templates?.map((template: Template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Updated: {new Date(template.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            onClick={() => handleLoadTemplate(template)}
                            size="sm"
                          >
                            Load
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSaveTemplate} disabled={saveTemplateMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Resume Editor
            </TabsTrigger>
            <TabsTrigger value="latex" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              LaTeX Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Resume Information</CardTitle>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Enhance
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Resume Enhancement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="targetJob">Target Job Title (Optional)</Label>
                            <Input
                              id="targetJob"
                              placeholder="e.g., Senior Software Engineer"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEnhanceResume((e.target as HTMLInputElement).value);
                                }
                              }}
                            />
                          </div>
                          <Button 
                            onClick={() => handleEnhanceResume()}
                            disabled={enhanceResumeMutation.isPending}
                            className="w-full"
                          >
                            {enhanceResumeMutation.isPending ? 'Enhancing...' : 'Enhance Resume'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={handleGenerateLatex} disabled={generateLatexMutation.isPending}>
                      <FileText className="w-4 h-4 mr-2" />
                      {generateLatexMutation.isPending ? 'Generating...' : 'Generate LaTeX'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.name}
                      onChange={(e) => updateResumeField('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => updateResumeField('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.phone}
                      onChange={(e) => updateResumeField('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.linkedin}
                      onChange={(e) => updateResumeField('linkedin', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Education Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button onClick={addEducation} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => {
                              const newEducation = [...resumeData.education];
                              newEducation[index].institution = e.target.value;
                              updateResumeField('education', newEducation);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => {
                              const newEducation = [...resumeData.education];
                              newEducation[index].location = e.target.value;
                              updateResumeField('education', newEducation);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const newEducation = [...resumeData.education];
                              newEducation[index].degree = e.target.value;
                              updateResumeField('education', newEducation);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={edu.startDate}
                              placeholder="Sept 2020"
                              onChange={(e) => {
                                const newEducation = [...resumeData.education];
                                newEducation[index].startDate = e.target.value;
                                updateResumeField('education', newEducation);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={edu.endDate}
                              placeholder="July 2024"
                              onChange={(e) => {
                                const newEducation = [...resumeData.education];
                                newEducation[index].endDate = e.target.value;
                                updateResumeField('education', newEducation);
                              }}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Details (one per line)</Label>
                          <Textarea
                            value={edu.details?.join('\n') || ''}
                            onChange={(e) => {
                              const newEducation = [...resumeData.education];
                              newEducation[index].details = e.target.value.split('\n').filter(line => line.trim());
                              updateResumeField('education', newEducation);
                            }}
                            placeholder="Relevant coursework, GPA, honors, etc."
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const newEducation = resumeData.education.filter((_, i) => i !== index);
                          updateResumeField('education', newEducation);
                        }}
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Experience Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <Button onClick={addExperience} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const newExperience = [...resumeData.experience];
                              newExperience[index].company = e.target.value;
                              updateResumeField('experience', newExperience);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => {
                              const newExperience = [...resumeData.experience];
                              newExperience[index].location = e.target.value;
                              updateResumeField('experience', newExperience);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const newExperience = [...resumeData.experience];
                              newExperience[index].position = e.target.value;
                              updateResumeField('experience', newExperience);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={exp.startDate}
                              placeholder="Sept 2024"
                              onChange={(e) => {
                                const newExperience = [...resumeData.experience];
                                newExperience[index].startDate = e.target.value;
                                updateResumeField('experience', newExperience);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={exp.endDate}
                              placeholder="Current"
                              onChange={(e) => {
                                const newExperience = [...resumeData.experience];
                                newExperience[index].endDate = e.target.value;
                                updateResumeField('experience', newExperience);
                              }}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Achievements (one per line)</Label>
                          <Textarea
                            value={exp.achievements.join('\n')}
                            onChange={(e) => {
                              const newExperience = [...resumeData.experience];
                              newExperience[index].achievements = e.target.value.split('\n').filter(line => line.trim());
                              updateResumeField('experience', newExperience);
                            }}
                            placeholder="Key accomplishments and responsibilities"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const newExperience = resumeData.experience.filter((_, i) => i !== index);
                          updateResumeField('experience', newExperience);
                        }}
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Leadership Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Leadership Experience</h3>
                    <Button onClick={addLeadership} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Leadership
                    </Button>
                  </div>
                  {resumeData.leadership?.map((lead, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Organization</Label>
                          <Input
                            value={lead.organization}
                            onChange={(e) => {
                              const newLeadership = [...(resumeData.leadership || [])];
                              newLeadership[index].organization = e.target.value;
                              updateResumeField('leadership', newLeadership);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={lead.position}
                            onChange={(e) => {
                              const newLeadership = [...(resumeData.leadership || [])];
                              newLeadership[index].position = e.target.value;
                              updateResumeField('leadership', newLeadership);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={lead.startDate}
                              onChange={(e) => {
                                const newLeadership = [...(resumeData.leadership || [])];
                                newLeadership[index].startDate = e.target.value;
                                updateResumeField('leadership', newLeadership);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={lead.endDate}
                              onChange={(e) => {
                                const newLeadership = [...(resumeData.leadership || [])];
                                newLeadership[index].endDate = e.target.value;
                                updateResumeField('leadership', newLeadership);
                              }}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Achievements (one per line)</Label>
                          <Textarea
                            value={lead.achievements.join('\n')}
                            onChange={(e) => {
                              const newLeadership = [...(resumeData.leadership || [])];
                              newLeadership[index].achievements = e.target.value.split('\n').filter(line => line.trim());
                              updateResumeField('leadership', newLeadership);
                            }}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const newLeadership = (resumeData.leadership || []).filter((_, i) => i !== index);
                          updateResumeField('leadership', newLeadership);
                        }}
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Skills and Certifications */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea
                      id="skills"
                      value={resumeData.skills?.join(', ') || ''}
                      onChange={(e) => updateResumeField('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      placeholder="JavaScript, React, Node.js, Python, SQL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications (one per line)</Label>
                    <Textarea
                      id="certifications"
                      value={resumeData.certifications?.join('\n') || ''}
                      onChange={(e) => updateResumeField('certifications', e.target.value.split('\n').filter(line => line.trim()))}
                      placeholder="AWS Certified Developer\nGoogle Analytics Certified"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="latex" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>LaTeX Source Code</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateLatex} 
                      disabled={generateLatexMutation.isPending}
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button 
                      onClick={() => navigator.clipboard.writeText(latexContent)}
                      size="sm"
                      variant="outline"
                    >
                      Copy Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full border rounded-md p-4">
                  <pre className="text-sm">
                    <code>{latexContent || 'Generate LaTeX code to view here...'}</code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-8 shadow-sm">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{resumeData.name}</h1>
                    <p className="text-sm text-gray-600">
                      {resumeData.email} | {resumeData.phone} | LinkedIn Profile
                    </p>
                  </div>
                  
                  {resumeData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold border-b border-gray-300 mb-2">EDUCATION</h2>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong>{edu.institution}</strong>, {edu.location}
                            </div>
                            <div className="text-sm">{edu.startDate} - {edu.endDate}</div>
                          </div>
                          <div className="text-sm">{edu.degree}</div>
                          {edu.details && edu.details.length > 0 && (
                            <ul className="list-disc list-inside text-sm mt-1">
                              {edu.details.map((detail, i) => (
                                <li key={i}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold border-b border-gray-300 mb-2">EXPERIENCE</h2>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong>{exp.company}</strong>
                            </div>
                            <div className="text-sm">{exp.location}</div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="italic">{exp.position}</div>
                            <div className="text-sm">{exp.startDate} - {exp.endDate}</div>
                          </div>
                          {exp.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-sm mt-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.leadership && resumeData.leadership.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold border-b border-gray-300 mb-2">POSITIONS OF LEADERSHIP</h2>
                      {resumeData.leadership.map((lead, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <strong>{lead.organization}</strong>
                            <div className="text-sm">{lead.startDate} - {lead.endDate}</div>
                          </div>
                          <div className="italic text-sm">{lead.position}</div>
                          {lead.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-sm mt-1">
                              {lead.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.certifications && resumeData.certifications.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold border-b border-gray-300 mb-2">CERTIFICATIONS</h2>
                      <ul className="list-disc list-inside text-sm">
                        {resumeData.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resumeData.skills && resumeData.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold border-b border-gray-300 mb-2">SKILLS</h2>
                      <ul className="list-disc list-inside text-sm">
                        <li><strong>Technical Skills:</strong> {resumeData.skills.join(', ')}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}