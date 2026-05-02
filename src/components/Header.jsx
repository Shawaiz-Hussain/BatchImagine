export default function Header({ onOpenSettings, pollen, onRefreshBalance, currentView = 'generator', onViewChange, isDarkMode, toggleDarkMode }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left">
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); onViewChange?.('generator'); }}>
            <img src="/logo.png" alt="Batch Imagine" className="logo-icon-img" />
            <span className="logo-text">
              Batch<span className="accent">Imagine</span>
            </span>
          </a>
        </div>

        <nav className="header-nav">
          <button 
            className={`nav-btn ${currentView === 'generator' ? 'active' : ''}`}
            onClick={() => onViewChange?.('generator')}
          >
            Batch Generator
          </button>
          <button 
            className={`nav-btn ${currentView === 'tester' ? 'active' : ''}`}
            onClick={() => onViewChange?.('tester')}
          >
            Model Tester
          </button>
        </nav>

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
                <span className="pollen-unit" style={{ fontWeight: 800, color: 'var(--text-muted)' }}>Not Connected</span>
              </div>
            )}
          </div>

          <button
            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
            title="Toggle Dark Mode"
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            <div className="theme-toggle-thumb">
              {isDarkMode ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </div>
          </button>

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
