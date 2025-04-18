import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 align="center">🔮 CampusCopilot</h1>
        <p className="app-subtitle" align="center">Your AI Campus Assistant</p>
      </header>
      <main>
        <ChatInterface />
      </main>
    </div>
  );
}