// import { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { getNote, updateNote } from '../utils/api'
// import { SECTIONS } from '../utils/sections'
// import NoteEditor from '../components/NoteEditor'

// export default function EditNote() {
//   const { noteId } = useParams()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(true)

//   const [section, setSection] = useState(SECTIONS[0])
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [tags, setTags] = useState('')
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     getNote(noteId).then(n => {
//       setSection(n.section)
//       setTitle(n.title)
//       setContent(n.content)
//       setTags((n.tags || []).join(', '))
//       setLoading(false)
//     }).catch(() => setLoading(false))
//   }, [noteId])

//   const handleSave = async () => {
//     if (!title.trim()) { setError('Title is required'); return }
//     if (!content.trim()) { setError('Content is required'); return }
//     setSaving(true)
//     setError('')
//     try {
//       await updateNote(noteId, {
//         title: title.trim(),
//         content: content.trim(),
//         tags: tags.split(',').map(t => t.trim()).filter(Boolean)
//       })
//       navigate(`/note/${noteId}`)
//     } catch {
//       setError('Failed to save.')
//       setSaving(false)
//     }
//   }

//   if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading...</div>

//   return (
//     <NoteEditor
//       mode="edit"
//       section={section}
//       setSection={setSection}
//       title={title}
//       setTitle={setTitle}
//       content={content}
//       setContent={setContent}
//       tags={tags}
//       setTags={setTags}
//       saving={saving}
//       error={error}
//       onSave={handleSave}
//       onCancel={() => navigate(-1)}
//     />
//   )
// }



import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getNote, updateNote } from '../utils/api'
import { SECTIONS } from '../utils/sections'
import NoteEditor from '../components/NoteEditor'

export default function EditNote() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [section, setSection] = useState(SECTIONS[0])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getNote(noteId).then(n => {
      setSection(n.section)
      setTitle(n.title)
      setContent(n.content)
      setTags((n.tags || []).join(', '))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [noteId])

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!content.trim()) { setError('Content is required'); return }
    setSaving(true)
    setError('')
    try {
      await updateNote(noteId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      })
      navigate(`/note/${noteId}`)
    } catch {
      setError('Failed to save.')
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Loading...</div>

  return (
    <NoteEditor
      mode="edit"
      section={section} setSection={setSection}
      title={title} setTitle={setTitle}
      content={content} setContent={setContent}
      tags={tags} setTags={setTags}
      saving={saving} error={error}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
    />
  )
}
