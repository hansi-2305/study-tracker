import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../utils/api'
import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
import styles from './Home.module.css'

export default function Home() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div className={`${styles.home} fade-in`}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <span className={styles.greetingTag}>// welcome back</span>
          <h1 className={styles.title}>Your Knowledge Base</h1>
          <p className={styles.subtitle}>
            Track your learning journey across {SECTIONS.length} domains.
            {stats && <span> <strong>{stats.total_notes}</strong> notes written so far.</span>}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>
          + New Note
        </button>
      </div>

      {stats && (
        <div className={styles.streakBanner}>
          <div className={styles.streakItem}>
            <span className={styles.streakEmoji}>🔥</span>
            <div>
              <div className={styles.streakVal}>{stats.streak.current}</div>
              <div className={styles.streakKey}>current streak</div>
            </div>
          </div>
          <div className={styles.streakDivider} />
          <div className={styles.streakItem}>
            <span className={styles.streakEmoji}>⚡</span>
            <div>
              <div className={styles.streakVal}>{stats.streak.longest}</div>
              <div className={styles.streakKey}>longest streak</div>
            </div>
          </div>
          <div className={styles.streakDivider} />
          <div className={styles.streakItem}>
            <span className={styles.streakEmoji}>📝</span>
            <div>
              <div className={styles.streakVal}>{stats.total_notes}</div>
              <div className={styles.streakKey}>total notes</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionLabel}>
        <span>// sections</span>
      </div>

      <div className={styles.grid}>
        {SECTIONS.map((s, i) => {
          const cfg = SECTION_CONFIG[s]
          const count = stats?.sections?.[s]?.count ?? '—'
          return (
            <div
              key={s}
              className={styles.card}
              style={{
                '--card-color': cfg.color,
                '--card-bg': cfg.bg,
                '--card-border': cfg.border,
                animationDelay: `${i * 0.07}s`
              }}
              onClick={() => navigate(`/section/${encodeURIComponent(s)}`)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardEmoji}>{cfg.emoji}</span>
                <span className={styles.cardTag}>{cfg.label}</span>
              </div>
              <div className={styles.cardName}>{s}</div>
              <div className={styles.cardDesc}>{cfg.desc}</div>
              <div className={styles.cardFooter}>
                <span className={styles.cardCount}>{count}</span>
                <span className={styles.cardCountLabel}>note{count !== 1 ? 's' : ''}</span>
                <span className={styles.cardArrow}>→</span>
              </div>
              <div className={styles.cardGlow} />
            </div>
          )
        })}
      </div>

      <div className={styles.tip}>
        <span className={styles.tipIcon}>💡</span>
        <span>Write notes daily to maintain your streak. Use markdown for rich formatting.</span>
      </div>
    </div>
  )
}
