import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Menu.module.css';

/* ==========================================================================
   Menu
   Accessible dropdown menu with hover-based opening.
   - Opens on hover
   - Escape closes menu
   - Click outside closes menu
   - Arrow key navigation
   - role="menu" and role="menuitem"
   ========================================================================== */

/* ---------- Types ---------- */

export interface MenuItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label (supports \n for line breaks) */
  label: string;
  /** Optional icon (React node) */
  icon?: React.ReactNode;
  /** Danger/destructive action styling */
  danger?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export interface MenuProps {
  /** Trigger element (should be a button or interactive element) */
  trigger: React.ReactElement;
  /** Menu items */
  items: MenuItem[];
  /** Callback when an item is selected */
  onSelect: (id: string) => void;
  /** Menu position relative to trigger */
  position?: 'right' | 'bottom-left' | 'bottom-right';
  /** Optional className for the wrapper */
  className?: string;
}

/* ---------- Helpers ---------- */

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/* ---------- Component ---------- */

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  onSelect,
  position = 'bottom-right',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  /* ---- Calculate menu position based on trigger ---- */
  const updateMenuPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    
    if (position === 'right') {
      // Position to the right of the trigger
      setMenuPosition({
        top: rect.top + window.scrollY,
        left: rect.right + 4 + window.scrollX,
      });
    } else if (position === 'bottom-left') {
      // Position below, left-aligned
      setMenuPosition({
        top: rect.bottom + 4 + window.scrollY,
        left: rect.left + window.scrollX,
      });
    } else {
      // Position below, right-aligned
      setMenuPosition({
        top: rect.bottom + 4 + window.scrollY,
        left: rect.right + window.scrollX,
      });
    }
  }, [position]);

  /* ---- Update position when opening ---- */
  useEffect(() => {
    if (open) {
      updateMenuPosition();
    }
  }, [open, updateMenuPosition]);

  /* ---- Clear timeout on unmount ---- */
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  /* ---- Close on Escape ---- */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  /* ---- Handle item selection ---- */
  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onSelect]
  );

  /* ---- Handle keyboard navigation within menu ---- */
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabledIndices = items
        .map((item, i) => (!item.disabled ? i : -1))
        .filter((i) => i !== -1);

      if (enabledIndices.length === 0) return;

      const currentIndex = itemRefs.current.findIndex(
        (ref) => ref === document.activeElement
      );
      const currentEnabledIndex = enabledIndices.indexOf(currentIndex);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex =
            currentEnabledIndex === -1
              ? enabledIndices[0]
              : enabledIndices[(currentEnabledIndex + 1) % enabledIndices.length];
          itemRefs.current[nextIndex]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex =
            currentEnabledIndex === -1
              ? enabledIndices[enabledIndices.length - 1]
              : enabledIndices[
                  (currentEnabledIndex - 1 + enabledIndices.length) %
                    enabledIndices.length
                ];
          itemRefs.current[prevIndex]?.focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          itemRefs.current[enabledIndices[0]]?.focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          itemRefs.current[enabledIndices[enabledIndices.length - 1]]?.focus();
          break;
        }
        case 'Tab': {
          setOpen(false);
          break;
        }
      }
    },
    [items]
  );

  /* ---- Hover handlers ---- */
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Small delay before closing to allow moving to menu
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 150);
  }, []);

  /* ---- Handle trigger keydown ---- */
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!open) {
          e.preventDefault();
          setOpen(true);
        }
      }
    },
    [open]
  );

  /* ---- Clone trigger with necessary props ---- */
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<any>, {
        ref: triggerRef,
        onKeyDown: handleTriggerKeyDown,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : trigger;

  /* ---- Menu style for portal (fixed positioning) ---- */
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: menuPosition.top,
    left: position === 'bottom-right' ? 'auto' : menuPosition.left,
    right: position === 'bottom-right' ? window.innerWidth - menuPosition.left : 'auto',
  };

  /* ---- Render menu in portal ---- */
  const menuElement = open ? createPortal(
    <div
      ref={menuRef}
      className={styles.menu}
      style={menuStyle}
      role="menu"
      aria-orientation="vertical"
      onKeyDown={handleMenuKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          role="menuitem"
          disabled={item.disabled}
          className={cx(
            styles.item,
            item.danger && styles.danger,
            item.disabled && styles.disabled
          )}
          onClick={() => handleSelect(item.id)}
          tabIndex={-1}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <span className={styles.label}>
            {item.label.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={wrapperRef}
      className={cx(styles.wrapper, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {triggerElement}
      {menuElement}
    </div>
  );
};
