import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a helpful AI assistant for Sachit's portfolio website. Your goal is to answer questions about Sachit, his background, skills, and projects in a friendly and professional manner. 

About Sachit:
- Role: Student software developer.
- Education: Currently in Class 12 (PCMB).
- Based: Remote (Remote building mode).
- Focus: Building practical software, exploring AI, web development, automation, and open-source.
- Philosophy: Learning by building, turning ideas into projects, and improving software efficiency with AI.

Skills:
- Programming: Python, JavaScript, TypeScript.
- Web: React, Supabase, PostgreSQL, Tailwind CSS, Next.js.
- AI: Gemini API, Claude API, MCP (Model Context Protocol), Prompt Engineering, Prompt Caching, TensorFlow Lite.
- Tools: Vite, Node.js, REST APIs, Git.

Key Projects:
1. SKY ROMs: Android Custom ROM Discovery & Management Platform (React, TS, Supabase).
2. Claude Document Summarizer: AI tool for summarization (Python, Claude API).
3. Schedule Planner: Automation engine for tasks and alerts (Python, Node.js).
4. Sentience OS: Custom Android distribution with local LLMs (AOSP, Kotlin, TensorFlow Lite).
5. Nexus Core: ERP system for distributed teams (Next.js, Go, PostgreSQL).
6. Ghost Protocol: E2EE messaging protocol (Rust, React Native, Security).
7. Tic-Tac-Toe: Browser game with Minimax AI.

Communication Style:
- Professional yet approachable.
- Concise but informative.
- If you don't know something specific about Sachit that isn't mentioned here, politely state that you only have information about his professional and academic background as presented in this portfolio.`;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: SYSTEM_INSTRUCTION,
}, { apiVersion: "v1beta" });

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

  // Gemini Chat Route
  app.post("/api/chat", async (req, res) => {
    const { messages, activeSection } = req.body;
    
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

      // Use a fresh model instance for this request to apply the dynamic system instruction
      const chatModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: contextualInstruction,
      }, { apiVersion: "v1beta" });

      // Format history for Gemini SDK
      // The SDK expects history as an array of { role: 'user' | 'model', parts: [{ text: string }] }
      const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      // Ensure history is valid (must start with user if present)
      const validHistory = history.length > 0 && history[0].role !== 'user' ? history.slice(1) : history;

      const chat = chatModel.startChat({
        history: validHistory,
      });

      const lastMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      const text = response.text();

      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
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
