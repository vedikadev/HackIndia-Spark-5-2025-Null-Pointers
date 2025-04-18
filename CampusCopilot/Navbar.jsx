export default function Navbar({ goBack }) {
    return (
      <nav>
        <button onClick={goBack}>← Back to Home</button>
        <h2>CampusCopilot</h2>
      </nav>
    )
  }