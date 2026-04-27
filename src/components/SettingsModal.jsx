import { useState, useEffect } from 'react';
import { LLM_MODELS } from '../presets';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [local, setLocal] = useState({ ...settings });

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const selectedLlm = LLM_MODELS[local.llmModelIdx] || LLM_MODELS[0];
  const needsOpenRouter = selectedLlm.provider === 'openrouter';

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
          {/* LLM Model Selection */}
          <div className="form-group">
            <label htmlFor="llm-model">Prompt AI Model</label>
            <select
              id="llm-model"
              className="styled-select"
              value={local.llmModelIdx}
              onChange={(e) =>
                setLocal((s) => ({ ...s, llmModelIdx: Number(e.target.value) }))
              }
            >
              {LLM_MODELS.map((m, i) => (
                <option key={m.id} value={i}>
                  {m.paidOnly ? '💎' : '🟢'} {m.name}{m.paidOnly ? ' · Paid' : ''}
                </option>
              ))}
            </select>
            <small>
              {selectedLlm.provider === 'pollinations'
                ? selectedLlm.paidOnly
                  ? 'Requires purchased pollen'
                  : 'Free — uses Pollinations AI, no extra key needed'
                : 'Requires OpenRouter API key'}
            </small>
          </div>

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

          {/* OpenRouter API Key — only shown when needed */}
          {needsOpenRouter && (
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
                <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                  Get your key
                </a>
              </small>
            </div>
          )}
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
