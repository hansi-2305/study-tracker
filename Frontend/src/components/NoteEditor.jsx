// import { useState } from 'react'
// import ReactMarkdown from 'react-markdown'
// import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
// import styles from './NoteEditor.module.css'

// export default function NoteEditor({
//   mode, section, setSection, title, setTitle,
//   content, setContent, tags, setTags,
//   saving, error, onSave, onCancel
// }) {
//   const [tab, setTab] = useState('write')
//   const cfg = SECTION_CONFIG[section]

//   return (
//     <div className={`${styles.editor} fade-in`}>
//       <div className={styles.topBar}>
//         <div className={styles.topLeft}>
//           <span className={styles.modeTag}>{mode === 'new' ? '// new note' : '// editing note'}</span>
//           <h2 className={styles.heading}>{mode === 'new' ? 'Create Note' : 'Edit Note'}</h2>
//         </div>
//         <div className={styles.topActions}>
//           <button className="btn btn-ghost" onClick={onCancel} disabled={saving}>
//             Cancel
//           </button>
//           <button
//             className="btn btn-primary"
//             onClick={onSave}
//             disabled={saving}
//             style={{ background: cfg?.color }}
//           >
//             {saving ? 'Saving...' : mode === 'new' ? 'Publish Note' : 'Save Changes'}
//           </button>
//         </div>
//       </div>

//       {error && <div className={styles.error}>{error}</div>}

//       <div className={styles.fields}>
//         <div className={styles.fieldRow}>
//           <div className={styles.field}>
//             <label className={styles.label}>Section</label>
//             <select value={section} onChange={e => setSection(e.target.value)} className={styles.select}>
//               {SECTIONS.map(s => (
//                 <option key={s} value={s}>{SECTION_CONFIG[s].emoji} {s}</option>
//               ))}
//             </select>
//           </div>
//           <div className={styles.field} style={{ flex: 2 }}>
//             <label className={styles.label}>Tags <span className={styles.optional}>(comma-separated)</span></label>
//             <input
//               value={tags}
//               onChange={e => setTags(e.target.value)}
//               placeholder="e.g. sorting, trees, graphs"
//             />
//           </div>
//         </div>

//         <div className={styles.field}>
//           <label className={styles.label}>Title</label>
//           <input
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             placeholder={`e.g. Binary Search Tree Traversal`}
//             className={styles.titleInput}
//           />
//         </div>
//       </div>

//       <div className={styles.contentArea}>
//         <div className={styles.tabBar}>
//           <button
//             className={`${styles.tab} ${tab === 'write' ? styles.tabActive : ''}`}
//             onClick={() => setTab('write')}
//           >
//             ✏️ Write
//           </button>
//           <button
//             className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`}
//             onClick={() => setTab('preview')}
//           >
//             👁️ Preview
//           </button>
//           <div className={styles.tabHint}>Markdown supported</div>
//         </div>

//         {tab === 'write' ? (
//           <textarea
//             className={styles.textarea}
//             value={content}
//             onChange={e => setContent(e.target.value)}
//             placeholder={`# Your Note Title\n\nStart writing your notes here...\n\n## Key Concepts\n- Point 1\n- Point 2\n\n## Code\n\`\`\`python\ndef example():\n    pass\n\`\`\``}
//           />
//         ) : (
//           <div className={`${styles.preview} note-content`}>
//             {content ? (
//               <ReactMarkdown>{content}</ReactMarkdown>
//             ) : (
//               <span className={styles.previewEmpty}>Nothing to preview yet. Start writing!</span>
//             )}
//           </div>
//         )}
//       </div>

//       <div className={styles.footer}>
//         <div className={styles.shortcuts}>
//           <span>**bold**</span>
//           <span>*italic*</span>
//           <span>`code`</span>
//           <span>```block```</span>
//           <span># heading</span>
//           <span>- list</span>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { SECTIONS, SECTION_CONFIG } from '../utils/sections'
import styles from './NoteEditor.module.css'

export default function NoteEditor({
  mode, section, setSection, title, setTitle,
  content, setContent, tags, setTags,
  saving, error, onSave, onCancel
}) {
  const [tab, setTab]           = useState('write')
  const [uploading, setUploading] = useState(false)
  const fileInputRef            = useRef(null)
  const textareaRef             = useRef(null)
  const cfg = SECTION_CONFIG[section]

  const insertImageToContent = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} is too large. Max size is 5MB.`)
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64   = ev.target.result
      const mdImage  = `\n![${file.name}](${base64})\n`
      const textarea = textareaRef.current
      if (textarea) {
        const start      = textarea.selectionStart
        const end        = textarea.selectionEnd
        const newContent = content.slice(0, start) + mdImage + content.slice(end)
        setContent(newContent)
        setTimeout(() => {
          textarea.selectionStart = start + mdImage.length
          textarea.selectionEnd   = start + mdImage.length
          textarea.focus()
        }, 0)
      } else {
        setContent(prev => prev + mdImage)
      }
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach(insertImageToContent)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    Array.from(e.dataTransfer.files)
      .filter(f => f.type.startsWith('image/'))
      .forEach(insertImageToContent)
  }

  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData?.items || [])
    const imageItem = items.find(item => item.type.startsWith('image/'))
    if (imageItem) {
      e.preventDefault()
      insertImageToContent(imageItem.getAsFile())
    }
  }

  return (
    <div className={`${styles.editor} fade-in`}>
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.modeTag}>{mode === 'new' ? '// new note' : '// editing note'}</span>
          <h2 className={styles.heading}>{mode === 'new' ? 'Create Note' : 'Edit Note'}</h2>
        </div>
        <div className={styles.topActions}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onSave}
            disabled={saving}
            style={{ background: cfg?.color }}
          >
            {saving ? 'Saving...' : mode === 'new' ? 'Publish Note' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.fields}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Section</label>
            <select value={section} onChange={e => setSection(e.target.value)} className={styles.select}>
              {SECTIONS.map(s => (
                <option key={s} value={s}>{SECTION_CONFIG[s].emoji} {s}</option>
              ))}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 2 }}>
            <label className={styles.label}>Tags <span className={styles.optional}>(comma-separated)</span></label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. sorting, trees, graphs"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Binary Search Tree Traversal"
            className={styles.titleInput}
          />
        </div>
      </div>

      <div className={styles.contentArea}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${tab === 'write' ? styles.tabActive : ''}`}
            onClick={() => setTab('write')}
          >
            ✏️ Write
          </button>
          <button
            className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`}
            onClick={() => setTab('preview')}
          >
            👁️ Preview
          </button>

          {/* Image Upload Button */}
          <button
            className={styles.imgBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Upload image (max 5MB)"
          >
            {uploading ? '⏳ Uploading...' : '🖼️ Add Image'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className={styles.tabHint}>Markdown · Images · Drag & Drop · Paste</div>
        </div>

        {tab === 'write' ? (
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onPaste={handlePaste}
            placeholder={`# Your Note Title\n\nStart writing here...\n\n📌 Add images by:\n  • Clicking "🖼️ Add Image" above\n  • Dragging & dropping an image here\n  • Copy-pasting an image (Ctrl+V)\n\n## Key Concepts\n- Point 1\n- Point 2\n\n## Code\n\`\`\`python\ndef example():\n    pass\n\`\`\``}
          />
        ) : (
          <div className={`${styles.preview} note-content`}>
            {content ? (
              <ReactMarkdown
                components={{
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt}
                      style={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        margin: '12px 0',
                        border: '1px solid var(--border)'
                      }}
                    />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <span className={styles.previewEmpty}>Nothing to preview yet. Start writing!</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.shortcuts}>
          <span>**bold**</span>
          <span>*italic*</span>
          <span>`code`</span>
          <span>```block```</span>
          <span># heading</span>
          <span>- list</span>
          <span>![alt](url)</span>
        </div>
        <div className={styles.imageHint}>
          🖼️ Images: click button · drag & drop · paste (Ctrl+V)
        </div>
      </div>
    </div>
  )
}
