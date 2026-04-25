import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am Kisan Sahayak. 🌾 I can help you find Mandi Rates, Govt Schemes, Labour, Marketplace listings, and more. What are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // Keep within bounds
      const newX = Math.max(20, Math.min(e.clientX - dragOffset.x, window.innerWidth - 70));
      const newY = Math.max(20, Math.min(e.clientY - dragOffset.y, window.innerHeight - 70));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await axios.post(`${API_BASE}/ai/chat`, {
        message: userMsg,
        history: history
      });

      setMessages(prev => [...prev, { role: 'model', text: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Sorry, I am having trouble connecting right now. Please try again.';
      setMessages(prev => [...prev, { role: 'model', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTIONS = [
    '📊 Mandi Rates',
    '🚜 Tractor Subsidy', 
    '💰 PM-Kisan', 
    '👥 Hire Labour',
    '🛡️ Crop Insurance', 
    '🛒 Marketplace'
  ];

  return (
    <div style={{ 
      position: 'fixed', 
      left: position.x, 
      top: position.y, 
      zIndex: 1000, 
      fontFamily: '"Outfit", sans-serif',
      userSelect: isDragging ? 'none' : 'auto'
    }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{ 
          position: 'absolute', bottom: 80, right: 0, width: 380, height: 550, 
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
          borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', 
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'chatFadeIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes chatFadeIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .msg-bubble { transition: all 0.2s ease; }
            .msg-bubble:hover { transform: translateY(-2px); }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background: #e5e7eb; borderRadius: 10px; }
          `}</style>

          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2d6a2d 0%, #1a4d1a 100%)', 
            color: 'white', padding: '20px 24px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 40, height: 40, background: 'rgba(255,255,255,0.2)', 
                borderRadius: 12, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', fontSize: 22, border: '1px solid rgba(255,255,255,0.3)'
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.5px' }}>Kisan Sahayak</div>
                <div style={{ fontSize: 11, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%' }}></span>
                  Always Online AI
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div key={i} className="msg-bubble" style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                background: m.role === 'user' ? '#2d6a2d' : 'white',
                color: m.role === 'user' ? 'white' : '#1e293b',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                boxShadow: m.role === 'user' ? '0 4px 12px rgba(45,106,45,0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                border: m.role === 'user' ? 'none' : '1px solid #f1f5f9'
              }}>
                {m.text}
              </div>
            ))}
            
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }}></span>
                <span style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }}></span>
                <span style={{ width: 4, height: 4, background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }}></span>
                <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
              </div>
            )}
            
            {!loading && messages.length === 1 && (
              <div style={{ marginTop: 10, animation: 'fadeIn 0.5s ease-out 0.3s both' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>🔥 Popular Queries</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setInput(s.split(' ').slice(1).join(' ')); }}
                      style={{ 
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, 
                        padding: '8px 14px', fontSize: 12, cursor: 'pointer', color: '#334155', 
                        transition: 'all 0.2s', fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d6a2d'; e.currentTarget.style.color = '#2d6a2d'; e.currentTarget.style.background = '#f0fdf4'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'white'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ padding: 20, background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your question here..."
                style={{ 
                  width: '100%', border: '2px solid #f1f5f9', borderRadius: 14, 
                  padding: '12px 16px', fontSize: 14, outline: 'none', transition: 'all 0.2s',
                  background: '#f8fafc'
                }}
                onFocus={e => e.target.style.borderColor = '#2d6a2d'}
                onBlur={e => e.target.style.borderColor = '#f1f5f9'}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={loading}
              style={{ 
                background: '#2d6a2d', color: 'white', border: 'none', width: 44, height: 44,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(45,106,45,0.2)',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ fontSize: 18 }}>➤</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <div 
        onMouseDown={handleMouseDown}
        onClick={(e) => { if (!isDragging) setIsOpen(!isOpen); }}
        style={{ 
          width: 64, height: 64, borderRadius: 20, 
          background: 'linear-gradient(135deg, #2d6a2d 0%, #1a4d1a 100%)', 
          color: 'white', border: 'none', 
          boxShadow: '0 8px 25px rgba(45, 106, 45, 0.3)', 
          cursor: isDragging ? 'grabbing' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isDragging ? 'scale(1.1)' : isOpen ? 'rotate(90deg)' : 'scale(1)'
        }}
        onMouseEnter={e => !isDragging && (e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)')}
        onMouseLeave={e => !isDragging && !isOpen && (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isOpen ? '✕' : '🤖'}
      </div>
    </div>
  );
}
