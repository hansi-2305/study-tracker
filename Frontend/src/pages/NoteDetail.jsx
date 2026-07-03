// // import { useEffect, useState } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { getNote, deleteNote } from '../utils/api'
// // import { SECTION_CONFIG } from '../utils/sections'
// // import { format } from 'date-fns'
// // import ReactMarkdown from 'react-markdown'
// // import styles from './NoteDetail.module.css'

// // export default function NoteDetail() {
// //   const { noteId } = useParams()
// //   const navigate = useNavigate()
// //   const [note, setNote] = useState(null)
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     getNote(noteId).then(n => { setNote(n); setLoading(false) }).catch(() => setLoading(false))
// //   }, [noteId])

// //   const handleDelete = async () => {
// //     if (!confirm('Delete this note permanently?')) return
// //     await deleteNote(noteId)
// //     navigate(-1)
// //   }

// //   if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading...</div>
// //   if (!note) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Note not found.</div>

// //   const cfg = SECTION_CONFIG[note.section]

// //   return (
// //     <div className={`${styles.page} fade-in`}>
// //       <div className={styles.topBar}>
// //         <button className="btn btn-ghost" onClick={() => navigate(-1)}>
// //           ← Back
// //         </button>
// //         <div className={styles.topActions}>
// //           <button className="btn btn-ghost" onClick={() => navigate(`/edit/${noteId}`)}>
// //             Edit
// //           </button>
// //           <button className="btn btn-danger" onClick={handleDelete}>
// //             Delete
// //           </button>
// //         </div>
// //       </div>

// //       <div className={styles.meta}>
// //         <span
// //           className={styles.sectionBadge}
// //           style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}
// //         >
// //           {cfg?.emoji} {note.section}
// //         </span>
// //         <span className={styles.date}>
// //           {format(new Date(note.created_at), 'EEEE, MMMM d, yyyy · h:mm a')}
// //         </span>
// //         {note.updated_at !== note.created_at && (
// //           <span className={styles.edited}>
// //             (edited {format(new Date(note.updated_at), 'MMM d')})
// //           </span>
// //         )}
// //       </div>

// //       <h1 className={styles.title}>{note.title}</h1>

// //       {note.tags?.length > 0 && (
// //         <div className={styles.tags}>
// //           {note.tags.map(t => (
// //             <span
// //               key={t}
// //               className={styles.tag}
// //               style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}
// //             >
// //               #{t}
// //             </span>
// //           ))}
// //         </div>
// //       )}

// //       <div className={styles.divider} style={{ background: cfg?.color }} />

// //       <div className="note-content">
// //         <ReactMarkdown>{note.content}</ReactMarkdown>
// //       </div>
// //     </div>
// //   )
// // }



// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { getNote, deleteNote } from '../utils/api'
// import { SECTION_CONFIG } from '../utils/sections'
// import { format } from 'date-fns'
// import ReactMarkdown from 'react-markdown'
// import styles from './NoteDetail.module.css'

// export default function NoteDetail() {
//   const { noteId } = useParams()
//   const navigate = useNavigate()
//   const [note, setNote] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     getNote(noteId).then(n => { setNote(n); setLoading(false) }).catch(() => setLoading(false))
//   }, [noteId])

//   const handleDelete = async () => {
//     if (!confirm('Delete this note permanently?')) return
//     const id = note._id || note.id
//     await deleteNote(id)
//     navigate(-1)
//   }

//   if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading...</div>
//   if (!note) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Note not found.</div>

//   const cfg = SECTION_CONFIG[note.section]
//   const noteId2 = note._id || note.id

//   return (
//     <div className={`${styles.page} fade-in`}>
//       <div className={styles.topBar}>
//         <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
//         <div className={styles.topActions}>
//           <button className="btn btn-ghost" onClick={() => navigate(`/edit/${noteId2}`)}>Edit</button>
//           <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
//         </div>
//       </div>

//       <div className={styles.meta}>
//         <span className={styles.sectionBadge}
//           style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
//           {cfg?.emoji} {note.section}
//         </span>
//         <span className={styles.date}>
//           {format(new Date(note.created_at), 'EEEE, MMMM d, yyyy · h:mm a')}
//         </span>
//         {note.updated_at !== note.created_at && (
//           <span className={styles.edited}>(edited {format(new Date(note.updated_at), 'MMM d')})</span>
//         )}
//       </div>

//       <h1 className={styles.title}>{note.title}</h1>

//       {note.tags?.length > 0 && (
//         <div className={styles.tags}>
//           {note.tags.map(t => (
//             <span key={t} className={styles.tag}
//               style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
//               #{t}
//             </span>
//           ))}
//         </div>
//       )}

//       <div className={styles.divider} style={{ background: cfg?.color }} />

//       <div className="note-content">
//         <ReactMarkdown
//           components={{
//             img: ({ src, alt }) => (
//               <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', margin: '12px 0' }} />
//             )
//           }}
//         >
//           {note.content}
//         </ReactMarkdown>
//       </div>
//     </div>
//   )
// }





import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNote, deleteNote } from '../utils/api'
import { SECTION_CONFIG } from '../utils/sections'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import styles from './NoteDetail.module.css'
import rehypeRaw from 'rehype-raw'


export default function NoteDetail() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNote(noteId).then(n => { setNote(n); setLoading(false) }).catch(() => setLoading(false))
  }, [noteId])

  const handleDelete = async () => {
    if (!confirm('Delete this note permanently?')) return
    const id = note._id || note.id
    await deleteNote(id)
    navigate(-1)
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading...</div>
  if (!note) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Note not found.</div>

  const cfg = SECTION_CONFIG[note.section]
  const noteId2 = note._id || note.id

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.topBar}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.topActions}>
          <button className="btn btn-ghost" onClick={() => navigate(`/edit/${noteId2}`)}>Edit</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.sectionBadge}
          style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
          {cfg?.emoji} {note.section}
        </span>
        <span className={styles.date}>
          {format(new Date(note.created_at), 'EEEE, MMMM d, yyyy · h:mm a')}
        </span>
        {note.updated_at !== note.created_at && (
          <span className={styles.edited}>(edited {format(new Date(note.updated_at), 'MMM d')})</span>
        )}
      </div>

      <h1 className={styles.title}>{note.title}</h1>

      {note.tags?.length > 0 && (
        <div className={styles.tags}>
          {note.tags.map(t => (
            <span key={t} className={styles.tag}
              style={{ color: cfg?.color, background: cfg?.bg, borderColor: cfg?.border }}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className={styles.divider} style={{ background: cfg?.color }} />

      <div className="note-content">
        <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
              img: ({ src, alt }) => (
                src={src}
                alt={alt || 'image'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  margin: '12px 0',
                  display: 'block',
                  border: '1px solid var(--border)'
                }}
              />
            )
          }}
        >
          {note.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
