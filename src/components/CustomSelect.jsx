import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ label, value, options, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options[value] || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (idx) => {
    onChange(idx);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      <button 
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="trigger-content">
          {selectedOption.tier && <span className="tier-dot" style={{ '--dot-color': selectedOption.tier === '🟢' ? '#4caf50' : selectedOption.tier === '🟡' ? '#ffeb3b' : selectedOption.tier === '🔴' ? '#f44336' : '#2196f3' }}></span>}
          <span className="trigger-text">{selectedOption.name}</span>
        </span>
        <span className={`chevron ${isOpen ? 'up' : 'down'}`}></span>
      </button>

      {isOpen && (
        <div className="custom-select-options">
          {options.map((opt, i) => (
            <div 
              key={opt.id || i}
              className={`custom-select-option ${value === i ? 'selected' : ''}`}
              onClick={() => handleSelect(i)}
            >
              {opt.tier && <span className="tier-dot" style={{ '--dot-color': opt.tier === '🟢' ? '#4caf50' : opt.tier === '🟡' ? '#ffeb3b' : opt.tier === '🔴' ? '#f44336' : '#2196f3' }}></span>}
              <div className="option-info">
                <span className="option-name">{opt.name}</span>
                {opt.cost !== undefined && <span className="option-cost">({opt.cost} pollen)</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
