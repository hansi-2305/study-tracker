// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
// import Home from './pages/Home'
// import SectionPage from './pages/SectionPage'
// import NoteDetail from './pages/NoteDetail'
// import NewNote from './pages/NewNote'
// import EditNote from './pages/EditNote'
// import './App.css'

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="section/:sectionName" element={<SectionPage />} />
//           <Route path="note/:noteId" element={<NoteDetail />} />
//           <Route path="new" element={<NewNote />} />
//           <Route path="edit/:noteId" element={<EditNote />} />
//         </Route>
//       </Routes>
//     </Router>
//   )
// }





import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import NoteDetail from './pages/NoteDetail'
import NewNote from './pages/NewNote'
import EditNote from './pages/EditNote'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="section/:sectionName" element={<SectionPage />} />
          <Route path="note/:noteId"         element={<NoteDetail />} />
          <Route path="new"                  element={<NewNote />} />
          <Route path="edit/:noteId"         element={<EditNote />} />
        </Route>
      </Routes>
    </Router>
  )
}
