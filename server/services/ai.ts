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
