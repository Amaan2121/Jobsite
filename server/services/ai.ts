import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-default_key"
});

export interface ResumeAnalysisResult {
  atsScore: number;
  keywordOptimization: number;
  suggestions: string[];
  analysisData: {
    strengths: string[];
    weaknesses: string[];
    missingKeywords: string[];
    formatIssues: string[];
    contentQuality: number;
    structureScore: number;
  };
}

export interface JobMatchResult {
  matchScore: number;
  reasoning: string;
  skillsMatch: string[];
  skillsGap: string[];
  recommendations: string[];
}

export async function analyzeResume(resumeText: string, targetJobTitle?: string): Promise<ResumeAnalysisResult> {
  try {
    const prompt = `Analyze the following resume and provide a comprehensive assessment. ${targetJobTitle ? `Consider it for a ${targetJobTitle} position.` : ''} 

Resume content:
${resumeText}

Please respond with JSON in this exact format:
{
  "atsScore": number (0-100),
  "keywordOptimization": number (0-100),
  "suggestions": ["suggestion1", "suggestion2", ...],
  "analysisData": {
    "strengths": ["strength1", "strength2", ...],
    "weaknesses": ["weakness1", "weakness2", ...],
    "missingKeywords": ["keyword1", "keyword2", ...],
    "formatIssues": ["issue1", "issue2", ...],
    "contentQuality": number (0-100),
    "structureScore": number (0-100)
  }
}

Provide actionable insights for ATS optimization, keyword usage, and overall resume quality improvement.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer and career counselor. Provide detailed, actionable feedback on resumes to help job seekers improve their chances of getting hired."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      atsScore: Math.max(0, Math.min(100, result.atsScore || 0)),
      keywordOptimization: Math.max(0, Math.min(100, result.keywordOptimization || 0)),
      suggestions: result.suggestions || [],
      analysisData: {
        strengths: result.analysisData?.strengths || [],
        weaknesses: result.analysisData?.weaknesses || [],
        missingKeywords: result.analysisData?.missingKeywords || [],
        formatIssues: result.analysisData?.formatIssues || [],
        contentQuality: Math.max(0, Math.min(100, result.analysisData?.contentQuality || 0)),
        structureScore: Math.max(0, Math.min(100, result.analysisData?.structureScore || 0))
      }
    };
  } catch (error) {
    console.error("Resume analysis failed:", error);
    throw new Error("Failed to analyze resume. Please try again later.");
  }
}

export async function calculateJobMatch(resumeText: string, jobDescription: string, jobTitle: string): Promise<JobMatchResult> {
  try {
    const prompt = `Calculate how well this resume matches the job description and provide insights.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Resume:
${resumeText}

Please respond with JSON in this exact format:
{
  "matchScore": number (0-100),
  "reasoning": "detailed explanation of the match score",
  "skillsMatch": ["skill1", "skill2", ...],
  "skillsGap": ["missing_skill1", "missing_skill2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Provide actionable insights for improving the match score.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI recruiter and career counselor. Analyze job-candidate fit and provide detailed matching insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      matchScore: Math.max(0, Math.min(100, result.matchScore || 0)),
      reasoning: result.reasoning || "Unable to determine match score",
      skillsMatch: result.skillsMatch || [],
      skillsGap: result.skillsGap || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Job match calculation failed:", error);
    throw new Error("Failed to calculate job match. Please try again later.");
  }
}

export async function generateCoverLetter(resumeText: string, jobDescription: string, jobTitle: string, companyName: string): Promise<string> {
  try {
    const prompt = `Generate a professional cover letter based on the candidate's resume and the job description.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Candidate's Resume:
${resumeText}

Write a compelling, personalized cover letter that highlights relevant experience and skills. Keep it professional, engaging, and around 250-300 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional career counselor who writes compelling cover letters that help candidates stand out to employers."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return response.choices[0].message.content || "Unable to generate cover letter at this time.";
  } catch (error) {
    console.error("Cover letter generation failed:", error);
    throw new Error("Failed to generate cover letter. Please try again later.");
  }
}

export interface LaTeXResumeData {
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

const LATEX_TEMPLATE = `\\documentclass{article}
\\usepackage{graphicx} % Required for inserting images

% Document class and font size
\\documentclass[a4paper,9pt]{extarticle}

% Packages
\\usepackage[utf8]{inputenc} % For input encoding
\\usepackage{geometry} % For page margins
\\geometry{a4paper, margin=0.75in} % Set paper size and margins
\\usepackage{titlesec} % For section title formatting
\\usepackage{enumitem} % For itemized list formatting
\\usepackage{hyperref} % For hyperlinks

% Formatting
\\setlist{noitemsep} % Removes item separation
\\titleformat{\\section}{\\large\\bfseries}{\\thesection}{1em}{}[\\titlerule] % Section title format
\\titlespacing*{\\section}{0pt}{\\baselineskip}{\\baselineskip} % Section title spacing

% Begin document
\\begin{document}

% Disable page numbers
\\pagestyle{empty}

% Header
\\begin{center}
\\textbf{\\Large {{NAME}}}\\\\[2pt] % Name
{{EMAIL}} | {{PHONE}} | \\href{{{LINKEDIN}}}{linkedin.com/{{LINKEDIN_HANDLE}}}
\\end{center}

{{EDUCATION_SECTION}}

{{EXPERIENCE_SECTION}}

{{LEADERSHIP_SECTION}}

{{CERTIFICATIONS_SECTION}}

{{SKILLS_SECTION}}

\\end{document}`;

export function generateLatexResume(data: LaTeXResumeData): string {
  let latex = LATEX_TEMPLATE;
  
  // Replace basic information
  latex = latex.replace('{{NAME}}', data.name.toUpperCase());
  latex = latex.replace('{{EMAIL}}', data.email);
  latex = latex.replace('{{PHONE}}', data.phone);
  latex = latex.replace('{{LINKEDIN}}', data.linkedin);
  latex = latex.replace('{{LINKEDIN_HANDLE}}', data.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, ''));
  
  // Generate Education Section
  let educationSection = '% Education Section\\n\\section*{EDUCATION}\\n';
  data.education.forEach(edu => {
    educationSection += `\\noindent\\n`;
    educationSection += `\\textbf{${edu.institution}}, ${edu.location} \\hfill ${edu.startDate} | ${edu.endDate}\\\\\\n`;
    educationSection += `${edu.degree}\\n`;
    if (edu.details && edu.details.length > 0) {
      educationSection += `\\begin{itemize}\\n`;
      edu.details.forEach(detail => {
        educationSection += `    \\item ${detail}\\n`;
      });
      educationSection += `\\end{itemize}\\n`;
    }
  });
  
  // Generate Experience Section
  let experienceSection = '% Experience Section\\n\\section*{EXPERIENCE}\\n\\n';
  data.experience.forEach(exp => {
    experienceSection += `\\noindent\\n`;
    experienceSection += `\\textbf{${exp.company}} \\hfill ${exp.location}\\\\\\n`;
    experienceSection += `\\textit{${exp.position}} \\hfill ${exp.startDate} | ${exp.endDate}\\n`;
    experienceSection += `\\begin{itemize}\\n`;
    exp.achievements.forEach(achievement => {
      experienceSection += `    \\item ${achievement}\\n`;
    });
    experienceSection += `\\end{itemize}\\n\\n`;
  });
  
  // Generate Leadership Section
  let leadershipSection = '';
  if (data.leadership && data.leadership.length > 0) {
    leadershipSection = '\\section*{POSITIONS OF LEADERSHIP}\\n';
    data.leadership.forEach(lead => {
      leadershipSection += `\\textbf{${lead.organization}}\\n`;
      leadershipSection += `\\hfill ${lead.startDate} | ${lead.endDate}\\n`;
      leadershipSection += `\\begin{itemize}\\n`;
      lead.achievements.forEach(achievement => {
        leadershipSection += `    \\item ${achievement}\\n`;
      });
      leadershipSection += `\\end{itemize}\\n`;
    });
  }
  
  // Generate Certifications Section
  let certificationsSection = '';
  if (data.certifications && data.certifications.length > 0) {
    certificationsSection = '\\section*{CERTIFICATIONS}\\n';
    certificationsSection += `\\begin{itemize}\\n`;
    data.certifications.forEach(cert => {
      certificationsSection += `    \\item ${cert}\\n`;
    });
    certificationsSection += `\\end{itemize}\\n`;
  }
  
  // Generate Skills Section
  let skillsSection = '';
  if (data.skills && data.skills.length > 0) {
    skillsSection = '\\section*{SKILLS}\\n';
    skillsSection += `\\begin{itemize}\\n`;
    skillsSection += `    \\item \\textbf{Technical Skills:} ${data.skills.join(', ')}\\n`;
    skillsSection += `\\end{itemize}\\n`;
  }
  
  // Replace sections in template
  latex = latex.replace('{{EDUCATION_SECTION}}', educationSection);
  latex = latex.replace('{{EXPERIENCE_SECTION}}', experienceSection);
  latex = latex.replace('{{LEADERSHIP_SECTION}}', leadershipSection);
  latex = latex.replace('{{CERTIFICATIONS_SECTION}}', certificationsSection);
  latex = latex.replace('{{SKILLS_SECTION}}', skillsSection);
  
  return latex;
}

export async function enhanceResumeWithAI(resumeData: LaTeXResumeData, targetJobTitle?: string): Promise<LaTeXResumeData> {
  try {
    const prompt = `Enhance and optimize the following resume data for better ATS compatibility and impact. ${targetJobTitle ? `Target job title: ${targetJobTitle}` : ''}

Current resume data:
${JSON.stringify(resumeData, null, 2)}

Please respond with enhanced resume data in the same JSON format. Improve:
1. Action verbs and impact statements
2. Quantifiable achievements where possible
3. Keywords relevant to the target role
4. Professional language and formatting
5. ATS optimization

Maintain the same structure but enhance the content quality.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and career counselor. Enhance resume content to maximize impact and ATS compatibility while maintaining authenticity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const enhancedData = JSON.parse(response.choices[0].message.content || "{}");
    return enhancedData as LaTeXResumeData;
  } catch (error) {
    console.error("Resume enhancement failed:", error);
    throw new Error("Failed to enhance resume. Please try again later.");
  }
}

export async function generateLatexCoverLetter(resumeData: LaTeXResumeData, jobDescription: string, jobTitle: string, companyName: string): Promise<string> {
  try {
    const prompt = `Generate a professional cover letter in LaTeX format based on the candidate's resume data and job description.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Candidate's Resume Data:
${JSON.stringify(resumeData, null, 2)}

Generate a complete LaTeX document for a cover letter that:
1. Uses professional formatting
2. Highlights relevant experience and skills
3. Shows enthusiasm for the specific role and company
4. Is approximately 250-300 words in the body
5. Includes proper contact information

Return only the LaTeX code, formatted for compilation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional career counselor who creates compelling cover letters in LaTeX format. Always return valid LaTeX code that can be compiled."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return response.choices[0].message.content || "Unable to generate cover letter at this time.";
  } catch (error) {
    console.error("LaTeX cover letter generation failed:", error);
    throw new Error("Failed to generate LaTeX cover letter. Please try again later.");
  }
}
