import { useState } from 'react';
import { getCarAdvice } from '@/src/services/aiService';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const advice = await getCarAdvice(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: advice || 'Error getting advice.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles size={120} className="text-[#F27D26]" />
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
        <div className="w-10 h-10 rounded-full bg-[#F27D26] flex items-center justify-center text-black">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg uppercase tracking-tight">AutoPro AI Advisor</h3>
          <p className="text-[10px] text-[#F27D26] font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Online & Ready
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 mb-4 border border-white/10 italic font-display text-4xl">
              ?
            </div>
            <h4 className="text-white/60 font-medium mb-1">How can I help you today?</h4>
            <p className="text-white/20 text-xs">Describe any weird noises, vibrations, or warning lights you're experiencing.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                msg.role === 'user' ? "bg-white/10" : "bg-[#F27D26]/10 text-[#F27D26]"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-white/10 text-white rounded-tr-none" 
                  : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-[#F27D26] rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/[0.02] border-t border-white/10">
        <form 
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search symptoms (e.g. squeaky brakes...)"
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-[#F27D26] outline-none transition-all placeholder:text-white/20 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-[#F27D26] text-black rounded-xl hover:bg-[#F27D26]/90 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
