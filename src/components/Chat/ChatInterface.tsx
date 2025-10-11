'use client';

import { useState, useRef, useEffect } from 'react';
import { colors } from '@/config/theme';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you analyze your customer data, commercial operations, and sales expansion opportunities. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      const data = await response.json();

      let responseContent = data.response || 'Sorry, I couldn\'t process your request.';
      
      // If we have SQL query and results, add them to the response
      if (data.sqlQuery) {
        responseContent += `\n\n**SQL Query:**\n\`\`\`sql\n${data.sqlQuery}\n\`\`\``;
      }
      
      if (data.queryResults && data.queryResults.length > 0) {
        responseContent += `\n\n**Results:** ${data.queryResults.length} row(s) returned`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-8 py-6 border-b bg-white" style={{ borderColor: colors.neutral[200] }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              AI Chat Assistant
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
              Ask questions about your data and get intelligent insights
            </p>
          </div>
          <div className="px-5 py-2 rounded-lg font-semibold text-white" style={{ backgroundColor: colors.primary.DEFAULT }}>
            AI CHAT
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6" style={{ backgroundColor: colors.background.primary }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
                style={message.role === 'assistant' ? { borderColor: colors.neutral[200] } : {}}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: colors.text.secondary }}>
                      AI Assistant
                    </span>
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed markdown-content ${
                    message.role === 'user' ? 'text-white' : ''
                  }`}
                  style={message.role === 'assistant' ? { color: colors.text.primary } : {}}
                >
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customize heading styles
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-sm font-bold mt-2 mb-1" {...props} />,
                        
                        // Customize list styles
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                        
                        // Customize paragraph
                        p: ({ node, ...props }) => <p className="my-2" {...props} />,
                        
                        // Customize strong/bold text
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        
                        // Customize code blocks
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <pre className="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto">
                              <code className={`text-xs ${className}`} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                        
                        // Customize links
                        a: ({ node, ...props }) => (
                          <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                        ),
                        
                        // Customize blockquotes
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />
                        ),
                        
                        // Customize tables
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-2">
                            <table className="min-w-full divide-y divide-gray-200 border" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-3 py-2 bg-gray-50 text-left text-xs font-semibold" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 border-t text-xs" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : ''
                  }`}
                  style={message.role === 'assistant' ? { color: colors.text.tertiary } : {}}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white border shadow-sm" style={{ borderColor: colors.neutral[200] }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: colors.text.secondary }}>
                    AI Assistant
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-8 py-6 border-t bg-white" style={{ borderColor: colors.neutral[200] }}>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your data..."
              className="w-full px-6 py-4 pr-14 rounded-2xl border-2 resize-none focus:outline-none focus:border-blue-500 transition-colors"
              style={{
                borderColor: colors.neutral[200],
                color: colors.text.primary,
                minHeight: '60px',
                maxHeight: '200px',
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: colors.text.tertiary }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}

