import { useEffect } from 'react';

export default function Lightbox({ src, prompt, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn lightbox-close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ✕
        </button>
        <img src={src} alt={prompt} />
        <p className="lightbox-prompt">{prompt}</p>
      </div>
    </div>
  );
}
