import React, { useState, useRef } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timeout.current);
    setVisible(true);
  };

  const hide = () => {
    timeout.current = setTimeout(() => setVisible(false), 100);
  };

  return (
    <span
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          className={[styles.tip, styles[position]]
            .filter(Boolean)
            .join(' ')}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
};
