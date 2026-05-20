import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: '#1f2235',
    color: '#e2e8f0',
    border: '1px solid #3d4166',
  },
  danger: {
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#a78bfa',
    border: '1px solid #7c3aed',
  },
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: '10px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '12px' },
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      style={{
        ...styles[variant],
        ...sizes[size],
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        fontWeight: 600,
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        outline: 'none',
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;

