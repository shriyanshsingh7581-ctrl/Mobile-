import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, MessageSquareText, Sparkles, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AIChatbotModal: React.FC = () => {
  const {
    products,
    storeSettings,
    chatbotOpen,
    setChatbotOpen,
    supportChats,
    activeChatUserId,
    chatLoading,
    sendSupportChatMessage,
  } = useStore();

  const location = useLocation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isHome = location.pathname === '/' || location.pathname === '';
  const isPdp = location.pathname.startsWith('/product/');
  const activeProduct = useMemo(() => {
    if (!isPdp) return null;
    const pid = location.pathname.replace('/product/', '').split('/')[0];
    return products.find((p) => p.id === pid) || null;
  }, [isPdp, location.pathname, products]);

  const activeSession = useMemo(
    () => supportChats.find((s) => s.userId === activeChatUserId) || null,
    [supportChats, activeChatUserId]
  );

  const messages = activeSession?.messages || [];

  const quickReplies = useMemo(() => {
    if (activeProduct) {
      return [
        'Any offers on this?',
        'Camera, battery & specs?',
        'Warranty & exchange bonus?',
        'EMI & delivery timeline?',
      ];
    }
    return [
      'Best 5G phones under ₹30,000?',
      'Any active discount offers?',
      'iPhone & Samsung latest deals?',
      'How to order on WhatsApp?',
    ];
  }, [activeProduct]);

  useEffect(() => {
    if (chatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatbotOpen, messages.length, chatLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? inputText).trim();
    if (!query || chatLoading) return;
    if (!textToSend) setInputText('');
    await sendSupportChatMessage({ text: query, product: activeProduct });
  };

  return (
    <>
      {/* Floating Circular Luxury Crest / AI Concierge Launcher (Hidden on Home Screen for clean storefront; shown on PDP & inner catalog pages) */}
      {!chatbotOpen && !isHome && (
        <button
          type="button"
          onClick={() => setChatbotOpen(true)}
          aria-label="Open AI Shopping Assistant"
          className={`fixed right-3.5 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#F7D060] via-[#B5893D] to-[#7D5A1C] p-[2px] shadow-[0_8px_24px_rgba(26,26,26,0.28)] hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
            isPdp ? 'bottom-32 md:bottom-20' : 'bottom-20 md:bottom-6'
          }`}
        >
          <div className="relative w-full h-full rounded-full bg-[#2A1810] flex items-center justify-center overflow-hidden">
            <img
              src={storeSettings.logoUrl || '/charlie-logo.png'}
              alt={storeSettings.storeName || 'Charlie AI'}
              className="w-9 h-9 object-contain"
            />
            <span className="absolute -bottom-0.5 right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#22C55E] border-2 border-white" />
            </span>
          </div>
          <span className="sr-only">Chat with Charlie AI</span>
        </button>
      )}

      {/* Full-Screen / Modal Chatbot Interface (Exact Video 00:12 - 00:18, 00:24 - 00:25) */}
      {chatbotOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-150"
          onClick={() => setChatbotOpen(false)}
        >
          <div
            className="w-full h-[92vh] sm:h-[640px] sm:max-w-[420px] bg-white sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-[#EAE5DC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Dark Charcoal / Espresso + Logo + Online Indicator + X Close */}
            <div className="bg-[#3B3B3B] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white p-1.5 flex items-center justify-center shrink-0 border border-[#B5893D]">
                  <img
                    src={storeSettings.logoUrl || '/charlie-logo.png'}
                    alt={storeSettings.businessName || 'Charlie Luxury'}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-white leading-tight">
                    {storeSettings.businessName || 'Charlie Luxury'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-[11px] font-medium text-white/85">Online</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChatbotOpen(false)}
                aria-label="Close AI Chatbot"
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Product Context Pill Banner if on PDP */}
            {activeProduct && (
              <div className="bg-[#FAF7F2] border-b border-[#EAE5DC] px-4 py-2 flex items-center gap-2 text-[11px] text-[#666666] shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#B5893D] shrink-0" />
                <span className="truncate">
                  Assisting you with{' '}
                  <strong className="text-[#1A1A1A]">{activeProduct.name}</strong>
                </span>
              </div>
            )}

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white">
              {/* Default Greeting Bubble (Matches Video 00:12) */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-[#F1F2F4] text-[#1A1A1A] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed shadow-2xs">
                  Hey👋 You can ask me anything about{' '}
                  {activeProduct ? activeProduct.name : storeSettings.businessName || 'Charlie Mobile'}{' '}
                  in any language😊😊
                </div>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isAdminMsg = msg.sender === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {isAdminMsg && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5893D] mb-1 px-1">
                        Store Concierge
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap select-text ${
                        isUser
                          ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                          : isAdminMsg
                          ? 'bg-[#FAF7F2] border border-[#B5893D]/40 text-[#1A1A1A] rounded-tl-sm'
                          : 'bg-[#F1F2F4] text-[#1A1A1A] rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#F1F2F4] text-[#666666] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5893D] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5893D] animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5893D] animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Right-Aligned Quick Reply Suggestion Chips (Exact Video 00:12 - 00:18) */}
            <div className="px-4 pt-2 pb-2.5 bg-white flex flex-col items-end gap-2 shrink-0">
              {quickReplies.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={chatLoading}
                  onClick={() => handleSend(chip)}
                  className="px-3.5 py-2 rounded-xl border border-[#D4CFC7] hover:border-[#B5893D] bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] text-xs font-medium shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar (Exact Video 00:12 - 00:25) */}
            <div className="px-4 pt-1 pb-3 bg-white border-t border-[#F0ECE1] shrink-0 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="h-11 rounded-xl border border-[#D4CFC7] focus-within:border-[#1A1A1A] bg-white px-3.5 flex items-center gap-2 transition-colors"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="You can talk to me in any language"
                  className="flex-1 h-full text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#8C8C8C] focus:outline-none bg-transparent select-text"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || chatLoading}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1A1A] hover:text-[#B5893D] disabled:text-[#CCCCCC] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C8C8C]">
                <MessageSquareText className="w-3 h-3 text-[#B5893D]" />
                <span>Charlie AI Concierge · Instant Multilingual Support</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
