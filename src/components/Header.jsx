export default function Header({ settings, onOpenSettings, pollen, onRefreshBalance, currentView = 'generator', onViewChange, isDarkMode, toggleDarkMode }) {
  // Derive balance values
  const totalBalance = pollen ? Number(pollen.balance ?? 0) : null;
  const tierName = pollen?.tierName;

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
          {settings?.pollinationsKey ? (
            <div 
              className="pollen-balance-container" 
              onClick={onRefreshBalance} 
              style={{ 
                cursor: 'pointer',
                border: 'var(--border-width) solid var(--border)',
                backgroundColor: 'var(--surface)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                userSelect: 'none'
              }} 
              title="Click to refresh balance"
            >
              {pollen ? (
                <>
                  <span style={{ 
                    fontSize: '1rem', 
                    color: totalBalance < 0 ? 'var(--text-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {totalBalance.toFixed(3)}
                  </span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>pollen</span>
                </>
              ) : (
                <span className="pollen-unit" style={{ fontSize: '0.9rem' }}>Not Connected</span>
              )}
            </div>
          ) : null}

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
