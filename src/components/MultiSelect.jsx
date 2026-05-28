import { useState, useRef, useEffect } from 'react';

export default function MultiSelect({ selectedIndices, options, onChange, maxSelections = 5, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (idx) => {
    if (selectedIndices.includes(idx)) {
      onChange(selectedIndices.filter(i => i !== idx));
    } else {
      if (selectedIndices.length < maxSelections) {
        onChange([...selectedIndices, idx]);
      }
    }
  };

  const getTierColor = (tier) => {
    if (tier === '🟢') return '#4caf50';
    if (tier === '🟡') return '#ffeb3b';
    if (tier === '🔴') return '#f44336';
    return '#2196f3';
  };

  return (
    <div className={`custom-select-container multi-select ${className}`} ref={containerRef}>
      <button 
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="trigger-content multi-content">
          {selectedIndices.length === 0 ? (
            <span className="trigger-text placeholder">Select up to {maxSelections} models...</span>
          ) : (
            <span className="trigger-text">
              {selectedIndices.length} model{selectedIndices.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </span>
        <span className={`chevron ${isOpen ? 'up' : 'down'}`}></span>
      </button>

      {isOpen && (
        <div className="custom-select-options">
          {options.map((opt, i) => {
            const isSelected = selectedIndices.includes(i);
            const isDisabled = !isSelected && selectedIndices.length >= maxSelections;
            return (
              <div 
                key={opt.id || i}
                className={`custom-select-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleToggle(i)}
                style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                <div className="multi-checkbox">
                  {isSelected && <span className="checkmark">✔</span>}
                </div>
                {opt.tier && <span className="tier-dot" style={{ '--dot-color': getTierColor(opt.tier) }}></span>}
                <div className="option-info">
                  <span className="option-name">{opt.name}</span>
                  {opt.cost !== undefined && <span className="option-cost">({opt.cost} pollen)</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}
