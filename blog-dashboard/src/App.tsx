import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { CreatePost } from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import { EditPost } from './pages/EditPost';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import BlogFeed from './pages/BlogFeed';
import SinglePost from './pages/SinglePost';
import { HelmetProvider } from 'react-helmet-async';
import CreateCategory from './pages/CreateCategory';

function App() {
  console.log("Frontend Pipeline Test: VERIFIED");
  return (
    <HelmetProvider>
      <Router>
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogFeed />} />
            <Route path="/post/:slug" element={<SinglePost />} />
          </Route>

          {/* ADMIN ROUTES (No public navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path='/categories/create' element={<CreateCategory />} />

          {/* Redirect empty path to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </HelmetProvider>

  )
}

export default App
