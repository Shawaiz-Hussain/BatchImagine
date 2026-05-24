import { useEffect } from 'react';

/**
 * CostConfirmModal — Shows an estimated cost breakdown before generation
 * and compares it against the user's current pollen balance.
 *
 * Props:
 *   onConfirm  — proceed with generation
 *   onCancel   — go back to edit settings
 *   pollen     — balance object { balance, accountBalance: { paid, tier, total } }
 *   costItems  — array of { label, cost, count?, detail? }
 *   totalCost  — pre-calculated total
 *   warnings   — array of warning strings
 */
export default function CostConfirmModal({ onConfirm, onCancel, pollen, costItems, totalCost, warnings }) {
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  // Calculate balance
  const totalBalance = Number(pollen?.balance ?? 0);
  const hasSplit = pollen?.paid !== null && pollen?.paid !== undefined && pollen?.tier !== null && pollen?.tier !== undefined;
  const paidBalance = hasSplit ? Number(pollen.paid)  : totalBalance;
  const tierBalance = hasSplit ? Number(pollen.tier)  : 0;

  const paidCost = costItems.reduce((sum, item) => sum + (item.paidOnly ? item.cost * (item.count || 1) : 0), 0);
  const tierCost = costItems.reduce((sum, item) => sum + (!item.paidOnly ? item.cost * (item.count || 1) : 0), 0);

  const hasBalance = pollen && typeof pollen === 'object';
  const isInsufficient = hasBalance && (
    totalBalance < totalCost || (hasSplit && paidBalance < paidCost)
  );

  return (
    <div className="modal-overlay cost-modal-overlay" onClick={onCancel}>
      <div className="modal cost-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cost-modal-header">
          <div className="cost-modal-icon">💰</div>
          <h2>Cost Estimate</h2>
          <button className="icon-btn cost-modal-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Cost Breakdown */}
        <div className="cost-modal-body">
          <div className="cost-breakdown">
            <div className="cost-breakdown-title">Breakdown</div>
            {costItems.map((item, i) => (
              <div className="cost-row" key={i}>
                <div className="cost-row-left">
                  <span className="cost-row-label">{item.label}</span>
                  {item.detail && <span className="cost-row-detail">{item.detail}</span>}
                </div>
                <div className="cost-row-right">
                  {item.count && item.count > 1 && (
                    <span className="cost-row-count">×{item.count}</span>
                  )}
                  <span className="cost-row-value">{(item.cost * (item.count || 1)).toFixed(4)}</span>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="cost-divider" />

            {/* Total */}
            <div className="cost-row cost-row-total">
              <span className="cost-row-label">Estimated Total</span>
              <span className="cost-row-value cost-total-value">{totalCost.toFixed(4)} pollen</span>
            </div>
          </div>

          {/* Balance Comparison */}
          {hasBalance && (
            <div className={`cost-balance-card ${isInsufficient ? 'insufficient' : 'sufficient'}`}>
              <div className="cost-balance-header">Your Balance</div>
              {hasSplit ? (
                <div className="cost-balance-split" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '6px' }}>
                  <div className="balance-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                    <span className="balance-label" style={{ color: 'rgba(255,255,255,0.85)' }}>💎 Paid Pollen (purchased):</span>
                    <span className="balance-value" style={{ fontFamily: 'var(--font-mono)', color: paidBalance < paidCost ? '#ffcdd2' : 'inherit' }}>
                      {paidBalance.toFixed(4)} pollen
                    </span>
                  </div>
                  <div className="balance-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                    <span className="balance-label" style={{ color: 'rgba(255,255,255,0.85)' }}>🟢 Tier Pollen (grant):</span>
                    <span className="balance-value" style={{ fontFamily: 'var(--font-mono)' }}>
                      {tierBalance.toFixed(4)} pollen
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
                  <div className="balance-row total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 900 }}>
                    <span className="balance-label">Total Balance:</span>
                    <span className="balance-value" style={{ fontFamily: 'var(--font-mono)' }}>
                      {totalBalance.toFixed(4)} pollen
                    </span>
                  </div>
                </div>
              ) : (
                <div className="cost-balance-single">
                  <span className="cost-balance-amount">{totalBalance.toFixed(4)}</span>
                  <span className="cost-balance-unit">pollen</span>
                </div>
              )}
              <div className="cost-balance-comparison" style={{ marginTop: '12px' }}>
                <span>After generation:</span>
                <span className={`cost-remaining ${isInsufficient ? 'negative' : ''}`}>
                  {(totalBalance - totalCost).toFixed(4)} pollen
                </span>
              </div>
            </div>
          )}

          {!hasBalance && (
            <div className="cost-balance-card cost-balance-unknown">
              <div className="cost-balance-header">⚠️ Balance Unknown</div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>
                Add your API key in Settings to see your balance and prevent overspending.
              </p>
            </div>
          )}

          {/* Warnings */}
          {warnings && warnings.length > 0 && (
            <div className="cost-warnings">
              {warnings.map((w, i) => (
                <div className="cost-warning-item" key={i}>
                  <span>⚠️</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {isInsufficient && (
            <div className="cost-warnings">
              <div className="cost-warning-item cost-warning-critical">
                <span>🚫</span>
                <span>
                  {hasSplit && paidBalance < paidCost 
                    ? 'Insufficient paid pollen! This generation requires premium paid pollen. Please top up your balance or switch to free tier models.'
                    : 'Insufficient balance! You may run out of pollen mid-generation. Consider reducing count or switching to cheaper models.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cost-modal-footer">
          <button className="btn-ghost cost-btn-back" onClick={onCancel}>
            ← Go Back
          </button>
          <button
            className={`btn-primary cost-btn-confirm ${isInsufficient ? 'cost-btn-warn' : ''}`}
            onClick={onConfirm}
          >
            {isInsufficient ? 'Generate Anyway' : 'Confirm & Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}
