import { useState, useEffect, useRef } from 'react';
import { getAIResponse } from '../services/api';
import './ChatStyles.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { 
      text: "⚡ Welcome to CampusCopilot!\n\nI can help with:\n• Food locations 🍔\n• Deadlines 📅\n• Campus services 🏛️", 
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('available'); // 'available', 'cooldown'
  const [queuedMessage, setQueuedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle API cooldown and queued messages
  useEffect(() => {
    if (apiStatus === 'cooldown') {
      const timer = setTimeout(() => {
        setApiStatus('available');
        if (queuedMessage) {
          handleSend(queuedMessage);
          setQueuedMessage(null);
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [apiStatus, queuedMessage]);

  const getFallbackResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('food') || q.includes('eat') || q.includes('cafe')) {
      return "🍔 Campus Dining Options:\n- Main Hall: 7AM-9PM\n- North Cafe: 8AM-8PM\n- Late Night Grill: 9PM-2AM";
    }
    if (q.includes('deadline') || q.includes('due') || q.includes('exam')) {
      return "📅 Upcoming Deadlines:\n• CS101 Final Project - May 15\n• MATH202 Midterm - May 18";
    }
    if (q.includes('library') || q.includes('study')) {
      return "📚 Library Hours:\n• Mon-Fri: 8AM-10PM\n• Weekends: 10AM-8PM";
    }
    return "🔍 I can help with:\n• Campus locations\n• Event schedules\n• Student services";
  };

  const handleSend = async (messageContent = input) => {
    if (!messageContent.trim() || isLoading) return;

    // Add user message immediately
    const userMessage = { 
      text: messageContent, 
      isBot: false,
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(messageContent);
      setMessages(prev => [...prev, { 
        text: aiResponse, 
        isBot: true,
        timestamp: new Date()
      }]);
      setApiStatus('available');
    } catch (error) {
      console.error("API Error:", error);
      setApiStatus('cooldown');
      
      const fallbackResponse = getFallbackResponse(messageContent);
      setMessages(prev => [...prev, { 
        text: `${fallbackResponse}`, 
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (apiStatus === 'cooldown') {
      setQueuedMessage(input);
      setInput('');
      setMessages(prev => [...prev, { 
        text: `(Message queued: "${input}")`, 
        isBot: false,
        timestamp: new Date(),
        isQueued: true 
      }]);
    } else {
      handleSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>CampusCopilot</h2>
        <p>Your AI campus assistant</p>
        {apiStatus === 'cooldown' && (
          <div className="cooldown-banner">
            ⚠️ System recovering... {queuedMessage && "Message queued"}
          </div>
        )}
      </div>

      <div className="messages-area">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isBot ? 'bot-message' : 'user-message'} ${msg.isQueued ? 'queued' : ''}`}
          >
            <div className="message-content">
              {msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="message-timestamp">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about campus services..."
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <span className="loading-dots">...</span>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}