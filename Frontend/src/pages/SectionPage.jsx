// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { getNotes, deleteNote } from '../utils/api'
// import { SECTION_CONFIG } from '../utils/sections'
// import { format } from 'date-fns'
// import styles from './SectionPage.module.css'

// export default function SectionPage() {
//   const { sectionName } = useParams()
//   const section = decodeURIComponent(sectionName)
//   const cfg = SECTION_CONFIG[section]
//   const navigate = useNavigate()

//   const [data, setData] = useState(null)
//   const [page, setPage] = useState(1)
//   const [search, setSearch] = useState('')
//   const [searchInput, setSearchInput] = useState('')
//   const [deleting, setDeleting] = useState(null)
//   const LIMIT = 5

//   const load = (p = 1, s = search) => {
//     getNotes(section, p, LIMIT, s).then(setData).catch(() => {})
//   }

//   useEffect(() => {
//     setPage(1)
//     setSearch('')
//     setSearchInput('')
//     setData(null)
//   }, [section])

//   useEffect(() => {
//     load(page, search)
//   }, [page, search, section])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setSearch(searchInput)
//     setPage(1)
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this note?')) return
//     setDeleting(id)
//     await deleteNote(id)
//     load(page)
//     setDeleting(null)
//   }

//   if (!cfg) return <div>Section not found</div>

//   return (
//     <div className={`${styles.page} fade-in`}>
//       <div className={styles.header} style={{ '--c': cfg.color }}>
//         <div className={styles.headerLeft}>
//           <span className={styles.emoji}>{cfg.emoji}</span>
//           <div>
//             <div className={styles.tag} style={{ color: cfg.color, borderColor: cfg.border, background: cfg.bg }}>
//               {cfg.label}
//             </div>
//             <h1 className={styles.title}>{section}</h1>
//             <p className={styles.desc}>{cfg.desc}</p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary"
//           onClick={() => navigate('/new', { state: { section } })}
//         >
//           + Add Note
//         </button>
//       </div>

//       <div className={styles.accent} style={{ background: cfg.color }} />

//       <form className={styles.searchBar} onSubmit={handleSearch}>
//         <span className={styles.searchIcon}>⌕</span>
//         <input
//           value={searchInput}
//           onChange={e => setSearchInput(e.target.value)}
//           placeholder={`Search ${section} notes...`}
//           className={styles.searchInput}
//         />
//         {searchInput && (
//           <button type="button" className={styles.clearBtn}
//             onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>
//             ✕
//           </button>
//         )}
//       </form>

//       {data && (
//         <div className={styles.meta}>
//           <span className={styles.metaCount}>
//             {data.total === 0 ? 'No notes yet' : `${data.total} note${data.total !== 1 ? 's' : ''}`}
//           </span>
//           {search && <span className={styles.metaSearch}>for "{search}"</span>}
//         </div>
//       )}

//       <div className={styles.notes}>
//         {!data && <div className={styles.loading}>Loading...</div>}
//         {data && data.notes.length === 0 && (
//           <div className={styles.empty}>
//             <div className={styles.emptyEmoji}>{cfg.emoji}</div>
//             <div className={styles.emptyText}>No notes here yet.</div>
//             <div className={styles.emptyHint}>Start writing your first {section} note!</div>
//             <button className="btn btn-primary" onClick={() => navigate('/new', { state: { section } })}>
//               + Write First Note
//             </button>
//           </div>
//         )}
//         {data && data.notes.map((note, i) => (
//           <NoteCard
//             key={note.id}
//             note={note}
//             cfg={cfg}
//             index={i}
//             onView={() => navigate(`/note/${note.id}`)}
//             onEdit={() => navigate(`/edit/${note.id}`)}
//             onDelete={() => handleDelete(note.id)}
//             deleting={deleting === note.id}
//           />
//         ))}
//       </div>

//       {data && data.total_pages > 1 && (
//         <div className={styles.pagination}>
//           <button
//             className="btn btn-ghost"
//             disabled={page <= 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             ← Prev
//           </button>
//           <div className={styles.pageNums}>
//             {Array.from({ length: data.total_pages }, (_, i) => i + 1).map(p => (
//               <button
//                 key={p}
//                 className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
//                 style={p === page ? { borderColor: cfg.color, color: cfg.color } : {}}
//                 onClick={() => setPage(p)}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//           <button
//             className="btn btn-ghost"
//             disabled={page >= data.total_pages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// function NoteCard({ note, cfg, index, onView, onEdit, onDelete, deleting }) {
//   const date = note.created_at ? format(new Date(note.created_at), 'MMM d, yyyy · h:mm a') : ''
//   const preview = note.content.replace(/[#*`>\-_]/g, '').slice(0, 140)

//   return (
//     <div
//       className={styles.noteCard}
//       style={{ '--c': cfg.color, '--cb': cfg.bg, '--cbr': cfg.border, animationDelay: `${index * 0.06}s` }}
//       onClick={onView}
//     >
//       <div className={styles.noteHeader}>
//         <div className={styles.noteDate}>{date}</div>
//         {note.tags?.length > 0 && (
//           <div className={styles.noteTags}>
//             {note.tags.map(t => (
//               <span key={t} className={styles.noteTag}>{t}</span>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className={styles.noteTitle}>{note.title}</div>
//       <div className={styles.notePreview}>{preview}{note.content.length > 140 ? '…' : ''}</div>
//       <div className={styles.noteActions} onClick={e => e.stopPropagation()}>
//         <button className={styles.actionBtn} onClick={onView}>Read →</button>
//         <button className={styles.actionBtn} onClick={onEdit}>Edit</button>
//         <button className={`${styles.actionBtn} ${styles.actionDelete}`} onClick={onDelete} disabled={deleting}>
//           {deleting ? '...' : 'Delete'}
//         </button>
//       </div>
//       <div className={styles.noteGlow} />
//     </div>
//   )
// }







import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNotes, deleteNote } from '../utils/api'
import { SECTION_CONFIG } from '../utils/sections'
import { format } from 'date-fns'
import styles from './SectionPage.module.css'

export default function SectionPage() {
  const { sectionName } = useParams()
  const section = decodeURIComponent(sectionName)
  const cfg = SECTION_CONFIG[section]
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [deleting, setDeleting] = useState(null)
  const LIMIT = 5

  const load = (p = 1, s = search) => {
    getNotes(section, p, LIMIT, s).then(setData).catch(() => {})
  }

  useEffect(() => {
    setPage(1); setSearch(''); setSearchInput(''); setData(null)
  }, [section])

  useEffect(() => { load(page, search) }, [page, search, section])

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    setDeleting(id)
    await deleteNote(id)
    load(page)
    setDeleting(null)
  }

  if (!cfg) return <div>Section not found</div>

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header} style={{ '--c': cfg.color }}>
        <div className={styles.headerLeft}>
          <span className={styles.emoji}>{cfg.emoji}</span>
          <div>
            <div className={styles.tag} style={{ color: cfg.color, borderColor: cfg.border, background: cfg.bg }}>
              {cfg.label}
            </div>
            <h1 className={styles.title}>{section}</h1>
            <p className={styles.desc}>{cfg.desc}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new', { state: { section } })}>
          + Add Note
        </button>
      </div>

      <div className={styles.accent} style={{ background: cfg.color }} />

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={`Search ${section} notes...`}
          className={styles.searchInput}
        />
        {searchInput && (
          <button type="button" className={styles.clearBtn}
            onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}>✕</button>
        )}
      </form>

      {data && (
        <div className={styles.meta}>
          <span className={styles.metaCount}>
            {data.total === 0 ? 'No notes yet' : `${data.total} note${data.total !== 1 ? 's' : ''}`}
          </span>
          {search && <span className={styles.metaSearch}>for "{search}"</span>}
        </div>
      )}

      <div className={styles.notes}>
        {!data && <div className={styles.loading}>Loading...</div>}
        {data && data.notes.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>{cfg.emoji}</div>
            <div className={styles.emptyText}>No notes here yet.</div>
            <div className={styles.emptyHint}>Start writing your first {section} note!</div>
            <button className="btn btn-primary" onClick={() => navigate('/new', { state: { section } })}>
              + Write First Note
            </button>
          </div>
        )}
        {data && data.notes.map((note, i) => {
          const id = note._id || note.id
          return (
            <NoteCard
              key={id}
              note={note}
              cfg={cfg}
              index={i}
              onView={() => navigate(`/note/${id}`)}
              onEdit={() => navigate(`/edit/${id}`)}
              onDelete={() => handleDelete(id)}
              deleting={deleting === id}
            />
          )
        })}
      </div>

      {data && data.total_pages > 1 && (
        <div className={styles.pagination}>
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div className={styles.pageNums}>
            {Array.from({ length: data.total_pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                style={p === page ? { borderColor: cfg.color, color: cfg.color } : {}}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
          </div>
          <button className="btn btn-ghost" disabled={page >= data.total_pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

function NoteCard({ note, cfg, index, onView, onEdit, onDelete, deleting }) {
  const date = note.created_at ? format(new Date(note.created_at), 'MMM d, yyyy · h:mm a') : ''
  const preview = note.content.replace(/[#*`>\-_]/g, '').replace(/!\[.*?\]\(.*?\)/g, '[image]').slice(0, 140)

  return (
    <div
      className={styles.noteCard}
      style={{ '--c': cfg.color, '--cb': cfg.bg, '--cbr': cfg.border, animationDelay: `${index * 0.06}s` }}
      onClick={onView}
    >
      <div className={styles.noteHeader}>
        <div className={styles.noteDate}>{date}</div>
        {note.tags?.length > 0 && (
          <div className={styles.noteTags}>
            {note.tags.map(t => <span key={t} className={styles.noteTag}>{t}</span>)}
          </div>
        )}
      </div>
      <div className={styles.noteTitle}>{note.title}</div>
      <div className={styles.notePreview}>{preview}{note.content.length > 140 ? '…' : ''}</div>
      <div className={styles.noteActions} onClick={e => e.stopPropagation()}>
        <button className={styles.actionBtn} onClick={onView}>Read →</button>
        <button className={styles.actionBtn} onClick={onEdit}>Edit</button>
        <button className={`${styles.actionBtn} ${styles.actionDelete}`} onClick={onDelete} disabled={deleting}>
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
      <div className={styles.noteGlow} />
    </div>
  )
}
