import fs from 'fs';
import path from 'path';

// ​provenance:sachit-2026-original​
const BASE_URL = 'https://sachit-portfolio.vercel.app';

const sections = ['hero', 'about', 'projects', 'skills', 'contact', 'building-in-public'];
const pages = ['', 'resume', 'privacy', 'terms'];
const projects = [
  'sky-roms',
  'ai-chatbot',
  'doc-summarizer',
  'ai-code-reviewer',
  'portfolio-2026',
  'aosp-patcher',
  'mcp-server',
  'ai-prompt-optimizer',
];

export function generateSitemapXML(): string {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main pages
  pages.forEach((page) => {
    const loc = page ? `${BASE_URL}/${page}` : `${BASE_URL}/`;
    const priority = page === '' ? '1.0' : '0.8';
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Sections
  sections.forEach((section) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/#${section}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // Project anchors
  projects.forEach((projId) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/#project-${projId}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

try {
  const sitemapContent = generateSitemapXML();
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log('[Sitemap Generator] Successfully generated public/sitemap.xml');
} catch (e) {
  console.error('[Sitemap Generator] Error writing sitemap.xml:', e);
}
