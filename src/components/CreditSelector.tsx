import React from 'react';

interface CreditSelectorProps {
  value: number;
  onChange: (credits: number) => void;
  disabled?: boolean;
  max?: number;
}

const CreditSelector: React.FC<CreditSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  max = 3,
}) => {
  const options = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {options.map((n) => {
        const isSelected = value === n;
        return (
          <button
            key={n}
            onClick={() => !disabled && onChange(n)}
            disabled={disabled}
            title={`${n} crédit${n > 1 ? 's' : ''}`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: isSelected ? '2px solid #7c3aed' : '1px solid #3d4166',
              background: isSelected
                ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                : '#1f2235',
              color: isSelected ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '14px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
};

export default CreditSelector;

