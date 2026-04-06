import React, { useState } from 'react';
import { UploadCloud, Send, MessageSquare, Image as ImageIcon } from 'lucide-react';
import './AiAssistant.css';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello! I'm your AI Analysis mentor. Upload a chart or ask me about NVIDIA's latest earnings." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, role: 'ai', text: "Based on the input, NVDA shows strong upside potential due to its recent breakout in AI data center revenue. It may face short-term resistance near $140." }]);
    }, 1000);
  };

  return (
    <div className="ai-assistant glass-panel">
      <div className="ai-header">
        <MessageSquare size={18} className="text-gradient" />
        <span className="ai-title">AI Assistant</span>
      </div>
      
      <div className="upload-zone">
        <UploadCloud size={24} className="upload-icon" />
        <p>Drop a chart image for technical analysis</p>
        <span className="upload-subtitle">Supports PNG, JPG</span>
      </div>

      <div className="chat-area">
        {messages.map(m => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            {m.role === 'ai' && <div className="ai-indicator" />}
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input-wrapper">
        <button className="chat-btn attach-btn"><ImageIcon size={18}/></button>
        <input 
          type="text" 
          placeholder="Ask about NVDA metrics..." 
          className="chat-input"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>e.key === 'Enter' && handleSend()}
        />
        <button className="chat-btn send-btn" onClick={handleSend}><Send size={18}/></button>
      </div>
    </div>
  );
}
