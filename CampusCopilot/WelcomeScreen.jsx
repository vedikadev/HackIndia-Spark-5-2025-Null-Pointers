export default function WelcomeScreen({ setCurrentView }) {
    return (
      <div className="welcome">
        <h1>Welcome to CampusCopilot! 🎓</h1>
        <div className="features">
          <button onClick={() => setCurrentView('chat')}>
            🗣️ AI Campus Assistant
          </button>
          <button onClick={() => setCurrentView('food')}>
            🍔 Find Campus Food
          </button>
          <button onClick={() => setCurrentView('deadlines')}>
            ⏰ Deadline Tracker
          </button>
        </div>
      </div>
    )
  }