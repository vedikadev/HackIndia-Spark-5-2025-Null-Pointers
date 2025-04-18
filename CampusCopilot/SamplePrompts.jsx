export const SAMPLE_PROMPTS = [
    "Where's the best coffee?",
    "Upcoming exam dates",
    "Library opening hours",
    "How to get parking permit"
  ];
  
  export function SamplePrompts({ onSelect }) {
    return (
      <div className="sample-prompts">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="prompt-chip"
          >
            {prompt}
          </button>
        ))}
      </div>
    );
  }