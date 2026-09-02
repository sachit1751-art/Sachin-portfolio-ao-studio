
// Vercel Serverless Function for GitHub contributions
// This ensures the API works even if the custom server.ts isn't used (e.g. on Vercel)

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

// In-memory cache (volatile on serverless, but better than nothing for concurrent hits)
let cache: ContributionData | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

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
        count = level > 0 ? level * 2 : 0;
      }

      contributions.push({ date, count, level });
    }
  }

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

export default async function handler(req: any, res: any) {
  // Extract username from query
  const { username } = req.query;
  const targetUsername = (username as string) || "sachit1751-art";

  try {
    const data = await fetchGitHubContributions(targetUsername);
    
    // Set caching headers for Vercel edge
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ 
      error: "Failed to fetch contribution data", 
      message: error.message || "Unknown error" 
    });
  }
}
