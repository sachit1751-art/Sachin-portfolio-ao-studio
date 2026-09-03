import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an intelligent, fast, and helpful AI assistant for Sachit's portfolio website. Your goal is to answer questions about Sachit, his background, skills, philosophy, and software projects in a direct, friendly, and professional tone.

About Sachit:
- Role: Student Software Developer & Tech Builder.
- Education: Class 12 (PCMB - Physics, Chemistry, Mathematics, Biology).
- Location/Mode: Remote building mode.
- Core Focus: Building practical software, AI integrations, web applications, automation engines, and open-source tech.
- Philosophy: "Learn by Building" (learning technologies by building real projects rather than just studying theory), "Keep It Simple" (clear, clean solutions over unnecessary complexity), "Experiment & Iterate", "Design Matters", "Continuous Learning".
- Current Status: Currently in the planning & product exploration phase for a new software application.

Technical Skills:
- Languages: Python, JavaScript, TypeScript, Go, Rust, Kotlin, HTML5, CSS3.
- Web & Interactive: React, Next.js, Vite, Tailwind CSS, Three.js, WebGL, GSAP, Framer Motion, Responsive & Accessible UI/UX.
- Backend & Storage: Node.js, Express, Go, Supabase (PostgreSQL, Storage), Redis, REST-style APIs.
- AI / ML & Automation: Gemini API, Claude API, MCP (Model Context Protocol), Prompt Engineering, Prompt Caching, TensorFlow Lite, Minimax AI algorithm.
- Tools & Practices: Git, GitHub, Render, Netlify, Security Headers, CSRF checks.

Comprehensive Project Portfolio:
1. SKY ROMs (2025): Android Custom ROM Discovery & Management Platform. Features device compatibility checks, ROM comparisons, download management, and user reviews. Built with React, TypeScript, Vite, Supabase, Tailwind CSS. Demo at https://sky-roms.vercel.app.
2. Claude Document Summarizer (2025): AI tool that summarizes uploaded documents using Anthropic Claude API, intelligent prompt engineering, and prompt caching for high speed and efficiency (Python, Claude API).
3. Schedule Planner (2025): Automated task schedule planner and notification engine for sending timely alerts and recurring event updates (Python, Node.js, REST APIs).
4. Tic-Tac-Toe Mini Game (2025): Polished browser game with Minimax AI algorithm featuring Easy & Hard modes, turn locking, and win/draw evaluation (JS, HTML, CSS).
5. MCP Integration Tool (2025): Tool for working with Model Context Protocol architectures, built following Anthropic Developer curriculum (Python, Claude API, MCP).
6. Nexus Core (2024): Enterprise resource planning (ERP) system for distributed teams, featuring real-time CRDT collaborative state management and automated resource allocation (Next.js, Go, PostgreSQL, Redis, Socket.io).
7. Sentience OS: Custom Android distribution integrating local LLMs via TensorFlow Lite (AOSP, Kotlin, TFLite).
8. Ghost Protocol: End-to-end encrypted messaging protocol (Rust, React Native).

Communication Style:
- Be concise, punchy, and direct.
- Give fast, accurate, and structured answers.
- Avoid flowery filler phrases or long intros.
- Use clean formatting (bullet points or bolding) when listing multiple items.
- If asked about something not covered in his professional/academic profile, politely mention that you focus on Sachit's software, skills, and portfolio work.`;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parsing middleware
  app.use(express.json());

  // Gemini Chat Route (supports both streaming and single-shot)
  app.post("/api/chat", async (req, res) => {
    const { messages, activeSection, stream = true } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      // Add contextual info about what the user is currently viewing
      let contextualInstruction = SYSTEM_INSTRUCTION;
      if (activeSection) {
        const sectionLabel = activeSection.replace(/-/g, ' ');
        contextualInstruction += `\n\n[USER CONTEXT]: The user is currently viewing the "${sectionLabel}" section. If they ask about "this" or "what I'm looking at", refer to the content in this section.`;
      }

      // Format contents for Gemini SDK
      const contents = (messages || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || '' }]
      }));

      // Ensure contents are valid (must start with user)
      const validContents = contents.length > 0 && contents[0].role !== 'user' ? contents.slice(1) : contents;

      if (stream) {
        // Set headers for Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');

        try {
          const responseStream = await ai.models.generateContentStream({
            model: "gemini-3.8-flash",
            contents: validContents,
            config: {
              systemInstruction: contextualInstruction,
              maxOutputTokens: 250,
            }
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            }
          }
          res.write(`data: [DONE]\n\n`);
          return res.end();
        } catch (streamError: any) {
          console.error("Gemini Stream Error:", streamError);
          res.write(`data: ${JSON.stringify({ error: streamError.message || "Streaming error occurred" })}\n\n`);
          return res.end();
        }
      }

      // Non-streaming fallback
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: validContents,
        config: {
          systemInstruction: contextualInstruction,
          maxOutputTokens: 250,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      if (error.message?.includes('503') || error.message?.includes('high demand')) {
        return res.status(503).json({ 
          error: "Service unavailable", 
          message: "The AI model is currently experiencing high demand. Please try again in a moment." 
        });
      }

      res.status(500).json({ error: "Failed to generate response", message: error.message });
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
