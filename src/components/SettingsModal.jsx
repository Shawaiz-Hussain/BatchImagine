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
          <div className="form-group">
            <label htmlFor="or-key">OpenRouter API Key</label>
            <input
              id="or-key"
              type="password"
              value={local.openrouterKey}
              onChange={(e) =>
                setLocal((s) => ({ ...s, openrouterKey: e.target.value }))
              }
              placeholder="sk-or-v1-..."
            />
            <small>
              Free tier —{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                Get your key
              </a>
            </small>
          </div>
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
              Get at{' '}
              <a href="https://enter.pollinations.ai" target="_blank" rel="noopener noreferrer">
                enter.pollinations.ai
              </a>
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="llm-model">LLM Model (OpenRouter)</label>
            <input
              id="llm-model"
              type="text"
              value={local.llmModel}
              onChange={(e) =>
                setLocal((s) => ({ ...s, llmModel: e.target.value }))
              }
              placeholder="meta-llama/llama-4-maverick:free"
            />
            <small>
              Any free model — append <code>:free</code> to model name
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
