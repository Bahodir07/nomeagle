import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import siteLogo from '../../assets/images/nomeagle_site_logo.png';
import siteText from '../../assets/images/nomeagle_site_text.png';

const FEATURES = [
  {
    icon: '🎭',
    title: 'Interactive Scenarios',
    description:
      'Step into vivid cultural scenes — make choices, explore consequences, and learn through immersive storytelling.',
  },
  {
    icon: '🔥',
    title: 'Daily Streaks',
    description:
      'Build momentum with daily habits. Earn XP, level up your flags, and keep your flame alive across every culture.',
  },
  {
    icon: '🏆',
    title: 'Leaderboard',
    description:
      'Compete globally and locally. Rise through the ranks as you master cultures and outscore friends.',
  },
  {
    icon: '🗺️',
    title: 'World Map',
    description:
      'Unlock countries on an interactive world map. Each country is a new adventure waiting to be explored.',
  },
  {
    icon: '⚡',
    title: 'Quizzes & Flashcards',
    description:
      'Reinforce what you learn with quick quizzes and spaced-repetition flashcards designed for long-term retention.',
  },
  {
    icon: '🎯',
    title: 'XP & Levels',
    description:
      'Every lesson earns experience points. Level up, earn stars, and watch your cultural expertise grow.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Pick a Country',
    description: 'Choose from dozens of countries on an interactive world map and start your cultural journey.',
    emoji: '🌍',
  },
  {
    number: '02',
    title: 'Learn Through Lessons',
    description: 'Complete article, video, and scenario-based lessons that bring each culture to life.',
    emoji: '📚',
  },
  {
    number: '03',
    title: 'Track Your Progress',
    description: 'Earn XP, maintain streaks, and climb the leaderboard as you master new cultures.',
    emoji: '📈',
  },
];

const STATS = [
  { value: '50+', label: 'Countries' },
  { value: '200+', label: 'Lessons' },
  { value: '10K+', label: 'Learners' },
  { value: '4.9★', label: 'Rating' },
];

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src={siteLogo} alt="" className={styles.logoSymbol} aria-hidden />
          <img src={siteText} alt="NomEagle" className={styles.logoTextImg} />
        </Link>

        <nav className={styles.headerNav}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How it works</a>
          <Link to="/login" className={styles.btnOutline}>Log in</Link>
          <Link to="/register" className={styles.btnPrimary}>Get started free</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Now in Open Beta — Join free today
          </div>

          <h1 className={styles.heroTitle}>
            Explore the world through{' '}
            <span className={styles.heroTitleAccent}>Culture & Language</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Nomeagle is a gamified learning platform that takes you on an immersive journey
            across 50+ countries — through stories, scenarios, and cultural challenges.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/register" className={styles.btnHeroPrimary}>
              Start for free
              <span>→</span>
            </Link>
            <a href="#how-it-works" className={styles.btnHeroSecondary}>
              See how it works
            </a>
          </div>

          <div className={styles.heroSocial}>
            <div className={styles.heroAvatars}>
              {['🧑', '👩', '👦', '🧑‍🦱', '👩‍🦰'].map((a, i) => (
                <span key={i} className={styles.heroAvatar}>{a}</span>
              ))}
            </div>
            <span className={styles.heroSocialText}>
              Join <strong>10,000+</strong> curious learners worldwide
            </span>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.heroCardFlag}>🇯🇵</span>
              <div>
                <div className={styles.heroCardTitle}>Japan — Culture & Traditions</div>
                <div className={styles.heroCardSub}>Module 3 · 12 lessons</div>
              </div>
              <span className={styles.heroCardBadge}>In Progress</span>
            </div>
            <div className={styles.heroCardProgress}>
              <div className={styles.heroCardProgressBar}>
                <div className={styles.heroCardProgressFill} style={{ width: '68%' }} />
              </div>
              <span>68% complete</span>
            </div>
            <div className={styles.heroCardLessons}>
              {[
                { icon: '✅', text: 'Tea Ceremony & Etiquette' },
                { icon: '✅', text: 'Writing Systems: Kanji, Hiragana' },
                { icon: '▶️', text: 'Festivals & Seasonal Traditions' },
                { icon: '🔒', text: 'Business Culture & Customs' },
              ].map((l) => (
                <div key={l.text} className={styles.heroCardLesson}>
                  <span>{l.icon}</span>
                  <span>{l.text}</span>
                </div>
              ))}
            </div>
            <div className={styles.heroCardStats}>
              <span>⚡ 340 XP</span>
              <span>🔥 7 day streak</span>
              <span>⭐ 3 stars</span>
            </div>
          </div>

          <div className={styles.heroCardSmall}>
            <span className={styles.heroCardSmallEmoji}>🌏</span>
            <div>
              <div className={styles.heroCardSmallTitle}>World Map Unlocked</div>
              <div className={styles.heroCardSmallSub}>14 countries explored</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Everything you need</span>
          <h2 className={styles.sectionTitle}>A smarter way to learn about the world</h2>
          <p className={styles.sectionSubtitle}>
            From nomadic steppes to ancient bazaars — we bring cultural education to life
            with modern gamification tools.
          </p>

          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDescription}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Simple & fun</span>
          <h2 className={styles.sectionTitle}>How Nomeagle works</h2>
          <p className={styles.sectionSubtitle}>
            Start exploring in minutes. No prior knowledge required — just curiosity.
          </p>

          <div className={styles.stepsGrid}>
            {STEPS.map((s) => (
              <div key={s.number} className={styles.stepCard}>
                <div className={styles.stepNumber}>{s.number}</div>
                <div className={styles.stepEmoji}>{s.emoji}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDescription}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <div className={styles.ctaBannerEmoji}>🚀</div>
          <h2 className={styles.ctaBannerTitle}>Ready to explore the world?</h2>
          <p className={styles.ctaBannerSub}>
            Join thousands of learners discovering new cultures every day. It's free to start.
          </p>
          <Link to="/register" className={styles.btnCtaBanner}>
            Create your free account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <Link to="/" className={styles.logo}>
          <img src={siteLogo} alt="" className={styles.logoSymbolSmall} aria-hidden />
          <img src={siteText} alt="NomEagle" className={styles.logoTextImgSmall} />
        </Link>
        <span className={styles.footerCopy}>© {new Date().getFullYear()} Nomeagle — Learn the world, one culture at a time.</span>
        <div className={styles.footerLinks}>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </div>
      </footer>
    </div>
  );
}
