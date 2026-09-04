import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, User, Bot, Loader2, MessageSquare, Trash2, RotateCcw, FileText, ExternalLink, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollReveal } from '../UI/ScrollReveal';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useConversationContext } from '../../hooks/useConversationContext';
import { PaperTheme, PaperState } from '../../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAboutMeProps {
  theme?: PaperTheme;
  paperState?: PaperState;
  mode?: 'full' | 'compact-floating';
  activeTab?: string;
}

const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  content: "Hi! I'm Sachit's AI assistant powered by machine-readable `/llms.txt` context. Ask me anything about his projects (like SKY ROMs, AI Chatbot & Assistant, Claude Document Summarizer, Nexus Core, or Sentience OS), tech stack, philosophy, or background!" 
};

const SUGGESTIONS: Record<string, string[]> = {
  hero: ["Tell me about Sachit", "What is his core philosophy?"],
  about: ["What is Class 12 PCMB?", "Where is he based?"],
  philosophy: ["Explain 'Learn by Building'", "How does he view AI?"],
  projects: ["Tell me about SKY ROMs", "What is the AI Chatbot project?", "What is Claude Document Summarizer?"],
  skills: ["What programming languages does he know?", "What AI tools does he use?"],
  experience: ["What projects has he built?", "What are his core focus areas?"],
  education: ["What is he currently studying?", "What subjects are in PCMB?"],
  contact: ["How can I contact Sachit?", "Is he open to remote work?"],
};

const STRUCTURE_SUGGESTIONS: Record<string, string[]> = {
  architecture: ["Explain the 3-layer architecture", "How does paper unfold work?", "Explain the event pipelines"],
  'file-structure': ["Explain the component directory", "Where is WebGL initialized?", "How are sound hooks organized?"],
  'tech-stack': ["Why Vite & React 18?", "What is used for 3D graphics?", "Tell me about Tailwind setup"],
  animation: ["Explain the GSAP & Three.js loop", "How is 60fps locked?", "Explain SVG path compositor"],
  performance: ["How is WebGL GPU throttled?", "Explain CSS contain: content", "What is pixel ratio capping?"],
  decisions: ["Why the tactile paper theme?", "Explain Typography choices", "Why no generic UI clichés?"],
  'mood-game': ["What is the MOOD game easter egg?", "How is it triggered?", "Explain the game loop"],
  procedural: ["How does paper crumple generation work?", "Explain vertex noise", "How are normals computed?"],
  settings: ["How does sound synthesis work?", "What themes are supported?", "How are preferences stored?"],
};

export const ChatAboutMe = memo<ChatAboutMeProps>(({ 
  theme = 'kraft', 
  paperState = 'opened',
  mode = 'full',
  activeTab = 'architecture'
}) => {
  const activeSection = useActiveSection();
  const effectiveRoute = mode === 'compact-floating' ? `structure-room:${activeTab}` : undefined;
  const { contextPayload } = useConversationContext({ 
    theme, 
    paperState,
    activeRoute: effectiveRoute
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('portfolio-chat-history');
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (instant = false) => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem('portfolio-chat-history', JSON.stringify(messages));
    if (isInitialMount.current) {
      isInitialMount.current = false;
      scrollToBottom(true);
    } else {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage = content.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          activeSection: activeSection,
          conversationContext: contextPayload,
          stream: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to fetch response';
        throw new Error(errorMessage);
      }

      if (response.headers.get('Content-Type')?.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let buffer = '';

        // Add model placeholder message to stream into
        setMessages([...newMessages, { role: 'model', content: '' }]);
        setIsLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                accumulatedText = parsed.error;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'model', content: accumulatedText };
                  return updated;
                });
              } else if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'model', content: accumulatedText };
                  return updated;
                });
              }
            } catch {
              // Ignore single token parsing errors
            }
          }
        }

        // If no text was accumulated, provide a helpful default
        if (!accumulatedText.trim()) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { 
              role: 'model', 
              content: "I'm ready to answer any questions about Sachit's projects (like SKY ROMs and the AI Chatbot), technical skills, or background. What would you like to know?" 
            };
            return updated;
          });
        }
      } else {
        const data = await response.json();
        setMessages([...newMessages, { role: 'model', content: data.text }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        role: 'model', 
        content: `**Error:** ${error.message || "I'm having trouble connecting right now."} Please make sure the Gemini API key is configured correctly.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const content = input;
    setInput('');
    await sendMessage(content);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('portfolio-chat-history');
    }
  };

  // Compact Floating Mode for Structure Room to avoid blocking architecture flow charts
  if (mode === 'compact-floating') {
    if (isMinimized) {
      return (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-auto">
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border font-mono text-xs uppercase tracking-wider cursor-pointer"
            style={{
              backgroundColor: 'var(--c-surface)',
              borderColor: 'var(--c-border)',
              color: 'var(--c-heading)',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)'
            }}
            title="Open Architecture Assistant"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <Bot size={15} className="text-amber-500" />
            <span className="font-bold">Architecture AI</span>
            <MessageSquare size={12} className="opacity-50 ml-1" />
          </motion.button>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] max-h-[75vh] rounded-2xl overflow-hidden flex flex-col pointer-events-auto shadow-2xl border"
        style={{
          backgroundColor: 'var(--c-card)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Floating Header Bar */}
        <div 
          className="px-3.5 py-2.5 border-b flex items-center justify-between gap-2 flex-shrink-0"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--c-heading)' }}>
              Architecture AI
            </span>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold transition-opacity hover:opacity-100 opacity-70"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-heading)'
              }}
              title="View machine-readable llms.txt context"
            >
              <FileText size={9} className="text-amber-500" />
              <span>llms.txt</span>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={clearChat}
              className="p-1 rounded transition-colors opacity-50 hover:opacity-100 hover:text-red-500 cursor-pointer"
              title="Clear Conversation"
            >
              <RotateCcw size={13} />
            </button>
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded transition-colors opacity-60 hover:opacity-100 cursor-pointer"
              style={{ color: 'var(--c-heading)' }}
              title="Minimize to avoid blocking architecture flow charts"
            >
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-3.5 custom-scrollbar"
          style={{ 
            backgroundImage: 'radial-gradient(var(--c-dot) 0.5px, transparent 0.5px)', 
            backgroundSize: '24px 24px',
            scrollBehavior: 'smooth'
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[92%] gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                    style={{ 
                      backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-heading)'
                    }}
                  >
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div 
                    className={`p-2.5 sm:p-3 rounded-xl shadow-sm text-xs sm:text-[13px] ${
                      m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                    style={{ 
                      backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-bg)',
                      color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-body)',
                      border: '1px solid var(--c-border)',
                      lineHeight: '1.6'
                    }}
                  >
                    <div className="markdown-body prose prose-xs max-w-none prose-neutral dark:prose-invert text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start pb-2">
              <div className="flex gap-2 items-center text-xs opacity-60 font-mono">
                <Bot size={14} className="animate-spin text-amber-500" />
                <span>Analyzing blueprint...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-px" />
        </div>

        {/* Suggested Questions */}
        <div className="px-2.5 py-1.5 bg-[var(--c-bg)] border-t border-b overflow-x-auto custom-scrollbar-hide flex-shrink-0" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex gap-1.5 min-w-max">
            {(STRUCTURE_SUGGESTIONS[activeTab || 'architecture'] || STRUCTURE_SUGGESTIONS.architecture).map((suggestion, idx) => (
              <button
                key={`sr-${activeTab}-${idx}`}
                onClick={() => sendMessage(suggestion)}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-muted)'
                }}
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-2.5 border-t relative z-10 flex-shrink-0"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this diagram..."
              className="w-full py-2 px-3 pr-10 rounded-lg border outline-none text-xs"
              style={{ 
                backgroundColor: 'var(--c-bg)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-body)'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 p-1.5 rounded-md transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
              style={{ 
                backgroundColor: 'var(--c-btn-bg)',
                color: 'var(--c-btn-text)'
              }}
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <ScrollReveal>
      <section id="chat" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-10 text-center">
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-3" style={{ color: 'var(--c-muted)' }}>
            [ 09 / INTERACTIVE ASSISTANT ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight mb-5" style={{ color: 'var(--c-heading)' }}>
            Chat About Me
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg font-handwriting leading-relaxed" style={{ color: 'var(--c-body)' }}>
            Curious about my workflow, tech stack, or specific projects? Ask my AI assistant for instant answers.
          </p>
        </div>

        <div 
          className="max-w-3xl mx-auto rounded-[var(--radius-xl)] overflow-hidden flex flex-col h-[550px] relative"
          style={{ 
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 border-b flex items-center justify-between gap-2" style={{ borderColor: 'var(--c-border)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Assistant Online</span>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-heading)'
                }}
                title="View machine-readable llms.txt context"
              >
                <FileText size={11} className="text-amber-500" />
                <span>/llms.txt</span>
                <ExternalLink size={9} className="opacity-50" />
              </a>
            </div>
            <button 
              onClick={clearChat}
              className="p-1.5 rounded-lg transition-colors opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
              title="Clear Conversation"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar"
            style={{ 
              backgroundImage: 'radial-gradient(var(--c-dot) 0.5px, transparent 0.5px)', 
              backgroundSize: '32px 32px',
              scrollBehavior: 'smooth'
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    damping: 20,
                    stiffness: 150,
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                    layout: { duration: 0.3 }
                  }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[90%] sm:max-w-[80%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm"
                      style={{ 
                        backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-input-bg)',
                        border: '1px solid var(--c-border)',
                        color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-heading)'
                      }}
                    >
                      {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div 
                      className={`p-4 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] text-sm sm:text-base ${
                        m.role === 'user' 
                          ? 'rounded-tr-none font-body' 
                          : 'rounded-tl-none font-body'
                      }`}
                      style={{ 
                        backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-bg)',
                        color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-body)',
                        border: '1px solid var(--c-border)',
                        lineHeight: '1.7'
                      }}
                    >
                      <div className="markdown-body prose prose-sm max-w-none prose-neutral dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  stiffness: 150
                }}
                className="flex justify-start pb-4"
              >
                <div className="flex gap-4">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                  >
                    <Bot size={16} className="animate-spin" />
                  </div>
                  <div 
                    className="p-4 rounded-2xl rounded-tl-none flex items-center gap-4"
                    style={{ backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-border)' }}
                  >
                    <div className="flex gap-1.5">
                      <motion.span 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: 'var(--c-dot)' }}
                      />
                      <motion.span 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: 'var(--c-dot)' }}
                      />
                      <motion.span 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: 'var(--c-dot)' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 font-bold">Assistant is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-px" />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-3 bg-[var(--c-bg)] border-t border-b overflow-x-auto custom-scrollbar-hide" style={{ borderColor: 'var(--c-border)' }}>
            <div className="flex gap-2 min-w-max">
              <AnimatePresence mode="wait">
                {(SUGGESTIONS[activeSection] || SUGGESTIONS.hero).map((suggestion, idx) => (
                  <motion.button
                    key={`${activeSection}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => sendMessage(suggestion)}
                    className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{ 
                      backgroundColor: 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-muted)'
                    }}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 border-t relative z-10"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
          >
            <div className="relative flex items-center gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message assistant..."
                className="w-full py-4 px-6 pr-14 rounded-full border outline-none transition-all font-body text-sm sm:text-base shadow-inner"
                style={{ 
                  backgroundColor: 'var(--c-bg)',
                  borderColor: 'var(--c-border)',
                  color: 'var(--c-body)',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2.5 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                style={{ 
                  backgroundColor: 'var(--c-btn-bg)',
                  color: 'var(--c-btn-text)',
                  boxShadow: '0 4px 12px -2px rgba(0,0,0,0.15)'
                }}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <div className="mt-3 text-center">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-30 flex items-center justify-center gap-2">
                <MessageSquare size={10} /> GEMINI 3.8 FLASH • REAL-TIME STREAMING
              </span>
            </div>
          </form>
        </div>
      </section>
    </ScrollReveal>
  );
});

ChatAboutMe.displayName = 'ChatAboutMe';

