import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Define the AI Schema (Maps strictly to your Mongoose Model)
const mongooseAiSchema = {
  description: "Job posting data structure",
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "Job title. Infer if missing (e.g., 'React Developer').",
      nullable: false,
    },
    company: {
      type: SchemaType.STRING,
      description: "Company name. Null if not found.",
      nullable: true,
    },
    description: {
      type: SchemaType.STRING,
      description: "A professional summary of the job.",
      nullable: false,
    },
    skills: {
      type: SchemaType.ARRAY,
      description: "Technical skills (e.g., Java, Python, React).",
      items: { type: SchemaType.STRING },
    },
    tools: {
      type: SchemaType.ARRAY,
      description: "Tools/Software (e.g., Jira, AWS, Figma, Docker).",
      items: { type: SchemaType.STRING },
    },
    jobType: {
      type: SchemaType.STRING,
      description: "EXACTLY ONE OF: 'Internship', 'Full-Time', 'Part-Time', 'Contract', 'Remote'.",
      nullable: false,
    },
    batchAllowed: {
      type: SchemaType.ARRAY,
      description: "Graduation years mentioned (e.g. ['2025', '2026']).",
      items: { type: SchemaType.STRING },
    },
    minCgpa: {
      type: SchemaType.NUMBER,
      description: "Minimum CGPA if mentioned (e.g. 7.5).",
      nullable: true,
    },
    salary: {
      type: SchemaType.STRING,
      description: "Salary info (e.g. '12 LPA', '30k/month').",
      nullable: true,
    },
    applyUrl: {
      type: SchemaType.STRING,
      description: "External link to apply if present.",
      nullable: true,
    },
    branch: {
      type: SchemaType.STRING,
      description: "Preferred branch (e.g., CSE, ECE).",
      nullable: true,
    },
    domain: {
      type: SchemaType.STRING,
      description: "Broad domain (e.g., Web Dev, AI, Data Science).",
      nullable: true,
    }
  },
  required: ["title", "description", "skills", "jobType"],
};

// 2. Initialize Model with Config
const model = genAI.getGenerativeModel({
 model: "gemini-2.5-flash", 
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: mongooseAiSchema,
  },
});

// 3. The Parsing Function
export const parseJobText = async (rawText) => {
  const prompt = `
    You are a data entry assistant. Analyze the text below and extract structured job data.
    
    Rules:
    - If 'jobType' is unclear, default to "Internship".
    - Separate specific coding languages into 'skills' and software/platforms into 'tools'.
    - Normalize 'batchAllowed' to just the year (e.g., "2025").
    
    Raw Input: "${rawText}"
  `;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
};