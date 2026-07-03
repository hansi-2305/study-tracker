// import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { getStreak } from '../utils/api'
// import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
// import styles from './Layout.module.css'

// export default function Layout() {
//   const [streak, setStreak] = useState({ current: 0, longest: 0 })
//   const [now, setNow] = useState(new Date())
//   const navigate = useNavigate()

//   useEffect(() => {
//     getStreak().then(setStreak).catch(() => {})
//     const t = setInterval(() => setNow(new Date()), 60000)
//     return () => clearInterval(t)
//   }, [])

//   const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
//   const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

//   return (
//     <div className={styles.layout}>
//       <aside className={styles.sidebar}>
//         <div className={styles.logo} onClick={() => navigate('/')}>
//           <span className={styles.logoIcon}>◈</span>
//           <div>
//             <div className={styles.logoTitle}>StudyOS</div>
//             <div className={styles.logoSub}>knowledge base</div>
//           </div>
//         </div>

//         <div className={styles.dateBlock}>
//           <div className={styles.dayName}>{dayName}</div>
//           <div className={styles.dateStr}>{dateStr}</div>
//         </div>

//         <div className={styles.streakBlock}>
//           <div className={styles.streakFire}>
//             <span className={styles.fireEmoji}>🔥</span>
//             <div>
//               <div className={styles.streakNumber}>{streak.current}</div>
//               <div className={styles.streakLabel}>day streak</div>
//             </div>
//           </div>
//           <div className={styles.streakBest}>
//             <span className={styles.bestLabel}>best</span>
//             <span className={styles.bestNum}>{streak.longest}</span>
//           </div>
//         </div>

//         <nav className={styles.nav}>
//           <div className={styles.navLabel}>sections</div>
//           {SECTIONS.map(s => {
//             const cfg = SECTION_CONFIG[s]
//             return (
//               <NavLink
//                 key={s}
//                 to={`/section/${encodeURIComponent(s)}`}
//                 className={({ isActive }) =>
//                   `${styles.navItem} ${isActive ? styles.navActive : ''}`
//                 }
//                 style={({ isActive }) => isActive ? { '--section-color': cfg.color } : {}}
//               >
//                 <span className={styles.navDot} style={{ background: cfg.color }} />
//                 <span className={styles.navEmoji}>{cfg.emoji}</span>
//                 <div className={styles.navText}>
//                   <span className={styles.navName}>{s}</span>
//                   <span className={styles.navDesc}>{cfg.desc}</span>
//                 </div>
//               </NavLink>
//             )
//           })}
//         </nav>

//         <button
//           className={styles.newBtn}
//           onClick={() => navigate('/new')}
//         >
//           <span>+</span> New Note
//         </button>
//       </aside>

//       <main className={styles.main}>
//         <Outlet context={{ refreshStreak: () => getStreak().then(setStreak) }} />
//       </main>
//     </div>
//   )
// }






import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStreak } from '../utils/api'
import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
import styles from './Layout.module.css'

export default function Layout() {
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [now, setNow]       = useState(new Date())
  const navigate            = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    // Redirect to login if no token
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    getStreak().then(setStreak).catch(() => {})
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <span className={styles.logoIcon}>◈</span>
          <div>
            <div className={styles.logoTitle}>StudyOS</div>
            <div className={styles.logoSub}>knowledge base</div>
          </div>
        </div>

        {/* User info */}
        <div className={styles.userBlock}>
          <div className={styles.userAvatar}>{user.username?.[0]?.toUpperCase() || '?'}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.username || 'User'}</div>
            <div className={styles.userEmail}>{user.email || ''}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
        </div>

        <div className={styles.dateBlock}>
          <div className={styles.dayName}>{dayName}</div>
          <div className={styles.dateStr}>{dateStr}</div>
        </div>

        <div className={styles.streakBlock}>
          <div className={styles.streakFire}>
            <span className={styles.fireEmoji}>🔥</span>
            <div>
              <div className={styles.streakNumber}>{streak.current}</div>
              <div className={styles.streakLabel}>day streak</div>
            </div>
          </div>
          <div className={styles.streakBest}>
            <span className={styles.bestLabel}>best</span>
            <span className={styles.bestNum}>{streak.longest}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>sections</div>
          {SECTIONS.map(s => {
            const cfg = SECTION_CONFIG[s]
            return (
              <NavLink
                key={s}
                to={`/section/${encodeURIComponent(s)}`}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
                style={({ isActive }) => isActive ? { '--section-color': cfg.color } : {}}
              >
                <span className={styles.navDot} style={{ background: cfg.color }} />
                <span className={styles.navEmoji}>{cfg.emoji}</span>
                <div className={styles.navText}>
                  <span className={styles.navName}>{s}</span>
                  <span className={styles.navDesc}>{cfg.desc}</span>
                </div>
              </NavLink>
            )
          })}
        </nav>

        <button className={styles.newBtn} onClick={() => navigate('/new')}>
          <span>+</span> New Note
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet context={{ refreshStreak: () => getStreak().then(setStreak) }} />
      </main>
    </div>
  )
}
