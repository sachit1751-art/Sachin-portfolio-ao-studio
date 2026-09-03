import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, User, Bot, Loader2, MessageSquare, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollReveal } from '../UI/ScrollReveal';
import { useActiveSection } from '../../hooks/useActiveSection';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  content: "Hi! I'm Sachit's AI assistant. Ask me anything about his projects (like SKY ROMs or Sentience OS), skills, or background!" 
};

export const ChatAboutMe = memo(() => {
  const activeSection = useActiveSection();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('portfolio-chat-history');
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    localStorage.setItem('portfolio-chat-history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          activeSection: activeSection
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to fetch';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'model', content: data.text }]);
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

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('portfolio-chat-history');
    }
  };

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
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--c-border)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Assistant Online</span>
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
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1], // Custom "out" curve for smooth lift
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
                <MessageSquare size={10} /> GENAI-3.5-FLASH • EXPERIMENTAL
              </span>
            </div>
          </form>
        </div>
      </section>
    </ScrollReveal>
  );
});

ChatAboutMe.displayName = 'ChatAboutMe';

