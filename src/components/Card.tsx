import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, style, className, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: '#1a1d27',
        border: '1px solid #2d3148',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s ease',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;

