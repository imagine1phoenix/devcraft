import React, { useState } from 'react';
import { UploadCloud, Send, MessageSquare, Image as ImageIcon } from 'lucide-react';
import './AiAssistant.css';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello! I'm your AI Analysis mentor. Upload a chart or ask me about NVIDIA's latest earnings." }
  ]);
  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if(!input.trim() || isLoading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      // Basic heuristic to find a ticker in the input (e.g. NVDA, AAPL) or default to 'NVDA'
      const match = userText.match(/\b[A-Z]{1,5}\b/);
      const ticker = match ? match[0] : 'NVDA';

      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          ticker: ticker,
          stock_data: '', // In the future, fetch real data to pass here
          headlines: []   // In the future, fetch real headlines to pass here
        })
      });
      
      const data = await res.json();
      
      // Handle the case where FastAPI returns a string directly or an object
      const aiText = typeof data === 'string' ? data : (data.analysis || data.result || JSON.stringify(data));
      
      setMessages(prev => [...prev, { id: Date.now()+1, role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        role: 'ai', 
        text: "Sorry, I couldn't connect to the AI backend. Is the FastAPI server running on port 8000?" 
      }]);
    } finally {
      setIsLoading(false);
    }
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
