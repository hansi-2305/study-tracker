// import { useState } from 'react'
// import { useNavigate, useLocation, useOutletContext } from 'react-router-dom'
// import { createNote } from '../utils/api'
// import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
// import NoteEditor from '../components/NoteEditor'

// export default function NewNote() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { refreshStreak } = useOutletContext()
//   const preSection = location.state?.section || SECTIONS[0]

//   const [section, setSection] = useState(preSection)
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [tags, setTags] = useState('')
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState('')

//   const handleSave = async () => {
//     if (!title.trim()) { setError('Title is required'); return }
//     if (!content.trim()) { setError('Content is required'); return }
//     setSaving(true)
//     setError('')
//     try {
//       const note = await createNote({
//         section,
//         title: title.trim(),
//         content: content.trim(),
//         tags: tags.split(',').map(t => t.trim()).filter(Boolean)
//       })
//       await refreshStreak()
//       navigate(`/note/${note.id}`)
//     } catch {
//       setError('Failed to save. Is the backend running?')
//       setSaving(false)
//     }
//   }

//   return (
//     <NoteEditor
//       mode="new"
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


import { useState } from 'react'
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import { createNote } from '../utils/api'
import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
import NoteEditor from '../components/NoteEditor'

export default function NewNote() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshStreak } = useOutletContext()
  const preSection = location.state?.section || SECTIONS[0]

  const [section, setSection] = useState(preSection)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    if (!content.trim()) { setError('Content is required'); return }
    setSaving(true)
    setError('')
    try {
      const note = await createNote({
        section,
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      })
      await refreshStreak()
      // Support both _id (MongoDB) and id (JSON)
      const id = note._id || note.id
      navigate(`/note/${id}`)
    } catch {
      setError('Failed to save. Is the backend running?')
      setSaving(false)
    }
  }

  return (
    <NoteEditor
      mode="new"
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
