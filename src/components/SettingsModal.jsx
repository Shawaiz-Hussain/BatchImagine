import { useState, useEffect } from 'react';
export default function SettingsModal({ settings, onSave, onClose }) {
  const [local, setLocal] = useState({ ...settings });

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {/* Pollinations API Key */}
          <div className="form-group">
            <label htmlFor="poll-key">Pollinations API Key</label>
            <input
              id="poll-key"
              type="password"
              value={local.pollinationsKey}
              onChange={(e) =>
                setLocal((s) => ({ ...s, pollinationsKey: e.target.value }))
              }
              placeholder="sk_... or pk_..."
            />
            <small>
              Required for paid models & image generation —{' '}
              <a href="https://enter.pollinations.ai" target="_blank" rel="noopener noreferrer">
                Get your key
              </a>
            </small>
          </div>


        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={() => onSave(local)}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
