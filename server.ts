import express from "express";
// ​‌sachit-portfolio-2026-original-author‌​
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Read machine-readable llms.txt context
let LLMS_TXT_CONTENT = "";
try {
  const llmsPath = path.join(process.cwd(), "public", "llms.txt");
  if (fs.existsSync(llmsPath)) {
    LLMS_TXT_CONTENT = fs.readFileSync(llmsPath, "utf-8");
  }
} catch (e) {
  console.warn("Could not read public/llms.txt:", e);
}

const SYSTEM_INSTRUCTION = `You are an intelligent, fast, and helpful AI assistant for Sachit's portfolio website. Your goal is to answer questions about Sachit, his background, skills, philosophy, and software projects in a direct, friendly, and professional tone.

You operate with full context provided by the site's machine-readable \`/llms.txt\` document below:

---
${LLMS_TXT_CONTENT}
---

Communication Style & Instructions:
- Be concise, punchy, and direct.
- Give fast, accurate, and structured answers grounded strictly in Sachit's actual portfolio data.
- Avoid flowery filler phrases or long intros.
- Use clean formatting (bullet points or bolding) when listing multiple items.
- If asked about something not covered in his professional/academic profile, politely mention that you focus on Sachit's software, skills, and portfolio work.`;

// Initialize Gemini client lazily
// ﻿author-fingerprint:sachit-2026﻿
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  username: string;
  totalContributions: number;
  year: number;
  contributions: ContributionDay[];
  fetchedAt: number;
}

let cache: ContributionData | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cached in memory

async function fetchGitHubContributions(username: string): Promise<ContributionData> {
  const now = Date.now();
  if (cache && (now - cache.fetchedAt < CACHE_DURATION) && cache.username === username) {
    return cache;
  }

  const url = `https://github.com/users/${username}/contributions`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from GitHub: ${response.statusText} (${response.status})`);
  }

  const html = await response.text();

  // Parse total contributions
  const totalMatch = html.match(/(\d+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  const totalContributions = totalMatch ? parseInt(totalMatch[1], 10) : 0;

  // Extract all <td> elements with class "ContributionCalendar-day"
  const tdMatches = html.match(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g) || [];
  
  // Extract all tool-tips to get the counts
  const tooltipMatches = html.match(/<tool-tip[^>]*>[^<]*<\/tool-tip>/g) || [];
  const tooltipMap = new Map<string, string>();
  
  for (const tooltipStr of tooltipMatches) {
    const forMatch = tooltipStr.match(/for="([^"]+)"/);
    const textMatch = tooltipStr.match(/>([^<]+)<\/tool-tip>/);
    if (forMatch && textMatch) {
      tooltipMap.set(forMatch[1], textMatch[1].trim());
    }
  }

  const contributions: ContributionDay[] = [];

  for (const tdStr of tdMatches) {
    const dateMatch = tdStr.match(/data-date="(\d{4}-\d{2}-\d{2})"/);
    const idMatch = tdStr.match(/id="([^"]+)"/);
    const levelMatch = tdStr.match(/data-level="(\d)"/);

    if (dateMatch) {
      const date = dateMatch[1];
      const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
      const id = idMatch ? idMatch[1] : '';
      
      let count = 0;
      if (tooltipMap.has(id)) {
        const tooltipText = tooltipMap.get(id) || '';
        if (tooltipText.toLowerCase().startsWith('no contributions')) {
          count = 0;
        } else {
          const countMatch = tooltipText.match(/^(\d+)/);
          if (countMatch) {
            count = parseInt(countMatch[1], 10);
          }
        }
      } else {
        // Fallback estimate based on level
        count = level > 0 ? level * 2 : 0;
      }

      contributions.push({ date, count, level });
    }
  }

  // Sort contributions chronologically
  contributions.sort((a, b) => a.date.localeCompare(b.date));

  const result: ContributionData = {
    username,
    totalContributions,
    year: new Date().getFullYear(),
    contributions,
    fetchedAt: now
  };

  cache = result;
  return result;
}

// Grounded fallback response generator from llms.txt when external API is under temporary high demand
function generatePortfolioGroundedFallback(contents: any[]): string {
  const lastUserMsg = [...contents].reverse().find(c => c.role === 'user')?.parts?.[0]?.text?.toLowerCase() || '';
  
  if (lastUserMsg.includes('sky rom') || lastUserMsg.includes('android')) {
    return "### SKY ROMs\n**SKY ROMs** is Sachit's Android Custom ROM Discovery & Management Platform. Built with React, TypeScript, Vite, Supabase, and Tailwind CSS, it offers ROM discovery, device compatibility checks, comparisons, and download management. [Live Demo: sky-roms.vercel.app](https://sky-roms.vercel.app)";
  }
  if (lastUserMsg.includes('chatbot') || lastUserMsg.includes('ai chat') || lastUserMsg.includes('assistant')) {
    return "### AI Chatbot & Assistant\nAn open-source, full-stack multi-model conversational platform built with Next.js, Vercel AI SDK, and serverless Postgres. Features multi-model routing (Claude, OpenAI, xAI, DeepSeek), persistent chat histories, and streaming UI. [Live Demo: chatbot-seven-dun-evb9u88zkv.vercel.app](https://chatbot-seven-dun-evb9u88zkv.vercel.app)";
  }
  if (lastUserMsg.includes('claude') || lastUserMsg.includes('summariz') || lastUserMsg.includes('document')) {
    return "### Claude Document Summarizer\nA high-speed document summarization engine built in Python using Anthropic's Claude API with prompt caching for minimal latency and cost efficiency. It handles deep text extraction and markdown reporting.";
  }
  if (lastUserMsg.includes('skill') || lastUserMsg.includes('stack') || lastUserMsg.includes('technolog')) {
    return "### Technical Skills & Stack\n- **Languages & Frameworks**: TypeScript, JavaScript, React, Next.js, Python, Tailwind CSS, Vite\n- **AI & Integrations**: Google GenAI SDK, Anthropic Claude API, Model Context Protocol (MCP), Vercel AI SDK\n- **Backend & Cloud**: Supabase, PostgreSQL, REST APIs, Node.js/Express, Git\n- **Core Philosophy**: Learn by building and creating real, working software.";
  }
  if (lastUserMsg.includes('education') || lastUserMsg.includes('study') || lastUserMsg.includes('pcmb') || lastUserMsg.includes('class 12')) {
    return "Sachit is currently a Senior High School Student (Class 12) pursuing a **PCMB** curriculum (Physics, Chemistry, Mathematics, Biology) in India, combining rigorous STEM fundamentals with hands-on software development and AI engineering.";
  }
  if (lastUserMsg.includes('nexus') || lastUserMsg.includes('sentience') || lastUserMsg.includes('project')) {
    return "Sachit has engineered several notable projects:\n1. **SKY ROMs** — Android Custom ROM Discovery Platform\n2. **AI Chatbot & Assistant** — Multi-model conversational AI platform\n3. **Claude Document Summarizer** — Fast document breakdown with prompt caching\n4. **Nexus Core / Sentience OS** — Experimental modular software architectures\n5. **MCP Integration Tools** — Local model context protocol tools\n\nFeel free to ask about any specific project!";
  }

  return "Sachit is a software developer and prompt engineer focused on full-stack web applications, AI integrations, and developer tooling. He builds with TypeScript, Next.js, Python, and modern LLM APIs. Explore his featured projects (like SKY ROMs and the AI Chatbot) or ask for specific details on his tech stack!";
}

const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
];

function getModelConfig(modelName: string, contextualInstruction: string) {
  const isGemini3 = modelName.startsWith("gemini-3");
  const config: any = {
    systemInstruction: contextualInstruction,
  };
  if (isGemini3) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
  }
  return config;
}

async function generateContentStreamWithFallback(
  validContents: any[],
  contextualInstruction: string,
  onChunk: (text: string) => void
) {
  let hasEmittedChunk = false;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const ai = getAi();
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: validContents,
        config: getModelConfig(modelName, contextualInstruction),
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          hasEmittedChunk = true;
          onChunk(chunk.text);
        }
      }

      if (hasEmittedChunk) {
        return; // Successfully streamed
      }
    } catch (err: any) {
      console.warn(`Streaming attempt failed with model ${modelName}:`, err?.message || err);
      // If chunks were already partially sent to the client, do not restart with another model
      // to avoid double-text or duplicated stream output
      if (hasEmittedChunk) {
        return;
      }
      // Otherwise try next candidate model
    }
  }

  // If all models failed before emitting any chunks, yield grounded portfolio fallback
  const fallback = generatePortfolioGroundedFallback(validContents);
  onChunk(fallback);
}

async function generateContentWithFallback(
  validContents: any[],
  contextualInstruction: string
): Promise<string> {
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: modelName,
        contents: validContents,
        config: getModelConfig(modelName, contextualInstruction),
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`GenerateContent attempt failed with model ${modelName}:`, err?.message || err);
    }
  }

  return generatePortfolioGroundedFallback(validContents);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parsing middleware
  app.use(express.json());

  // Gemini Chat Route (supports both streaming and single-shot with multi-model resilience)
  app.post("/api/chat", async (req, res) => {
    const { messages, activeSection, conversationContext, stream = true } = req.body;
    
    // Format contents for Gemini SDK
    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }]
    }));

    // Ensure contents are valid (must start with user)
    const validContents = contents.length > 0 && contents[0].role !== 'user' ? contents.slice(1) : contents;

    // Add contextual info about what the user is currently viewing & local app state
    let contextualInstruction = SYSTEM_INSTRUCTION;

    if (conversationContext) {
      const { theme, paperState, activeRoute, projectSummaries } = conversationContext;
      contextualInstruction += `\n\n[DYNAMIC APP CONTEXT]:
- Selected Theme: ${theme || 'kraft'}
- Paper Intro State: ${paperState || 'opened'}
- Current Section/Route: ${activeRoute || activeSection || 'home'}
- Featured Project Summaries: ${JSON.stringify(projectSummaries || [])}`;
    } else if (activeSection) {
      const sectionLabel = activeSection.replace(/-/g, ' ');
      contextualInstruction += `\n\n[USER CONTEXT]: The user is currently viewing the "${sectionLabel}" section. If they ask about "this" or "what I'm looking at", refer to the content in this section.`;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return grounded fallback if API key is not yet set
      const fallbackText = generatePortfolioGroundedFallback(validContents);
      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }
      return res.json({ text: fallbackText });
    }

    try {
      if (stream) {
        // Set headers for Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');

        await generateContentStreamWithFallback(validContents, contextualInstruction, (chunkText) => {
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        });

        res.write(`data: [DONE]\n\n`);
        return res.end();
      }

      // Non-streaming fallback
      const text = await generateContentWithFallback(validContents, contextualInstruction);
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const fallback = generatePortfolioGroundedFallback(validContents);
      
      if (stream) {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
        }
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
          res.write(`data: [DONE]\n\n`);
          res.end();
        }
        return;
      }

      if (!res.headersSent) {
        res.json({ text: fallback });
      }
    }
  });

  // API Route for GitHub contributions
  app.get("/api/github-contributions", async (req, res) => {
    const username = (req.query.username as string) || "sachit1751-art";
    try {
      const data = await fetchGitHubContributions(username);
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching contributions:", error);
      res.status(500).json({ 
        error: "Failed to fetch contribution data", 
        message: error.message || "Unknown error" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Machine-readable llms.txt standard endpoints
  const serveLlmsTxt = (req: express.Request, res: express.Response) => {
    const llmsPath = path.join(process.cwd(), "public", "llms.txt");
    if (fs.existsSync(llmsPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.sendFile(llmsPath);
    }
    res.status(404).send("llms.txt file not found");
  };
  app.get("/llms.txt", serveLlmsTxt);
  app.get("/.well-known/llms.txt", serveLlmsTxt);

  // Dynamic sitemap route to guarantee host alignment with Google Search Console
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get('x-forwarded-host') || req.get('host') || 'sachin-portfolio.vercel.app';
    const protocol = req.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/resume</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(sitemapXml);
  });

  app.get("/robots.txt", (req, res) => {
    const host = req.get('x-forwarded-host') || req.get('host') || 'sachin-portfolio.vercel.app';
    const protocol = req.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(robotsTxt);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v5, we must use "*all" for catch-all wildcard routing
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
