export default function Header({ onOpenSettings, pollen, onRefreshBalance }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left">
          <a href="/" className="logo">
            <img src="/logo.png" alt="Batch Imagine" className="logo-icon-img" />
            <span className="logo-text">
              Batch<span className="accent">Imagine</span>
            </span>
          </a>
        </div>

        <div className="header-right">
          <div className="pollen-balance">
            {pollen && typeof pollen === 'object' ? (
              <div 
                className="pollen-dual-wrap" 
                onClick={onRefreshBalance} 
                style={{ cursor: 'pointer' }}
                title="Click to refresh balance"
              >
                <div className="pollen-segment pollen-segment-credit">
                  <span className="pollen-icon">🌸</span>
                  <span className="pollen-amount">{(Number(pollen.credit ?? 0)).toFixed(3)}</span>
                </div>
                <div className="pollen-divider" />
                <div className="pollen-segment pollen-segment-grant">
                  <span className="pollen-icon">🌱</span>
                  <span className="pollen-amount">{(Number(pollen.grant ?? pollen.balance ?? 0)).toFixed(3)}</span>
                </div>
              </div>
            ) : (
              <div className="pollen-value-wrap">
                <div className="pollen-label">Status</div>
                <span className="pollen-unit">Anonymous (Free)</span>
              </div>
            )}
          </div>

          <button
            className="icon-btn"
            title="Settings"
            aria-label="Open settings"
            onClick={onOpenSettings}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
