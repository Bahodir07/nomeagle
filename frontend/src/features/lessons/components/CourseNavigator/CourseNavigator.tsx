import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CourseNavigator.module.css";

/* ---------- Utility ---------- */
const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Inline SVG Icons ---------- */

const MenuIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const ChevronUpIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ---------- DOM ID convention ---------- */

/**
 * Module sections in the page must use this ID pattern so the navigator
 * can find and observe them.
 *
 * Usage in the parent page:
 *   <section id={moduleElementId(0)}> ... </section>
 */
export const MODULE_ID_PREFIX = "course-module-";
export const moduleElementId = (index: number): string =>
  `${MODULE_ID_PREFIX}${index}`;

/* ---------- Props ---------- */

export interface CourseNavigatorModule {
  id: string;
  title: string;
}

export interface CourseNavigatorProps {
  modules: CourseNavigatorModule[];
  className?: string;
}

/* ---------- Component ---------- */

export const CourseNavigator: React.FC<CourseNavigatorProps> = ({
  modules,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = modules.length;

  /* ---- IntersectionObserver to track which module is in view ---- */

  useEffect(() => {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < total; i++) {
      const el = document.getElementById(moduleElementId(i));
      if (el) elements.push(el);
    }

    if (elements.length === 0) return;

    const visibleSet = new Map<HTMLElement, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visibleSet.set(el, entry.intersectionRatio);
          } else {
            visibleSet.delete(el);
          }
        }

        if (visibleSet.size === 0) return;

        let bestEl: HTMLElement | null = null;
        let bestRatio = -1;
        visibleSet.forEach((ratio, el) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el;
          }
        });

        if (bestEl) {
          const idx = elements.indexOf(bestEl);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [total]);

  /* ---- Scroll helpers ---- */

  const scrollToModule = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      const el = document.getElementById(moduleElementId(clamped));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [total]
  );

  const handleUp = useCallback(() => {
    if (activeIndex > 0) scrollToModule(activeIndex - 1);
  }, [activeIndex, scrollToModule]);

  const handleDown = useCallback(() => {
    if (activeIndex < total - 1) scrollToModule(activeIndex + 1);
  }, [activeIndex, total, scrollToModule]);

  /* ---- TOC handlers ---- */

  const handleTocToggle = useCallback(() => {
    setTocOpen((prev) => !prev);
  }, []);

  const handleTocSelect = useCallback(
    (index: number) => {
      scrollToModule(index);
      setTocOpen(false);
    },
    [scrollToModule]
  );

  const handleBackdropClick = useCallback(() => {
    setTocOpen(false);
  }, []);

  /* ---- Badge position on track ---- */

  const badgeTopPct =
    total <= 1 ? 50 : (activeIndex / (total - 1)) * 100;

  /* ---- Keyboard nav for TOC ---- */

  const handleTocKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTocSelect(index);
      }
    },
    [handleTocSelect]
  );

  if (total === 0) return null;

  return (
    <>
      {/* Backdrop to close TOC */}
      {tocOpen && (
        <div
          className={styles.tocBackdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <nav
        className={cx(styles.rail, className)}
        aria-label="Course section navigator"
      >
        {/* ---- TOC button ---- */}
        <div style={{ position: "relative" }}>
          <button
            className={styles.btn}
            onClick={handleTocToggle}
            aria-expanded={tocOpen}
            aria-label="Table of contents"
            title="Table of contents"
          >
            <MenuIcon />
          </button>

          {/* ---- TOC popup ---- */}
          {tocOpen && (
            <div className={styles.tocPanel} role="menu">
              <p className={styles.tocTitle}>Sections</p>
              <ul className={styles.tocList}>
                {modules.map((mod, i) => (
                  <li key={mod.id}>
                    <button
                      className={cx(
                        styles.tocItem,
                        i === activeIndex && styles.tocItemActive
                      )}
                      role="menuitem"
                      onClick={() => handleTocSelect(i)}
                      onKeyDown={(e) => handleTocKeyDown(e, i)}
                    >
                      <span className={styles.tocItemIndex}>{i + 1}</span>
                      <span className={styles.tocItemLabel}>{mod.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ---- Up button ---- */}
        <button
          className={cx(styles.btn, activeIndex === 0 && styles.btnDisabled)}
          onClick={handleUp}
          aria-label="Previous section"
          title="Previous section"
          disabled={activeIndex === 0}
        >
          <ChevronUpIcon />
        </button>

        {/* ---- Track with badge ---- */}
        <div className={styles.trackWrap} ref={trackRef}>
          <div className={styles.track} />
          <span
            className={styles.badge}
            style={{ top: `${badgeTopPct}%` }}
            aria-live="polite"
            aria-label={`Section ${activeIndex + 1} of ${total}`}
          >
            {activeIndex + 1}
          </span>
        </div>

        {/* ---- Down button ---- */}
        <button
          className={cx(
            styles.btn,
            activeIndex === total - 1 && styles.btnDisabled
          )}
          onClick={handleDown}
          aria-label="Next section"
          title="Next section"
          disabled={activeIndex === total - 1}
        >
          <ChevronDownIcon />
        </button>
      </nav>
    </>
  );
};
