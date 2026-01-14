
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "./store";
import { PublicBlogList } from "./pages/PublicBlogList";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AddPost } from './pages/AddPost';
import { supabase } from "./supabaseClient";
import { setUser } from "./store/authSlice";
import "./App.css";
import "./css/PublicPage.css";

import editIcon from "./assets/ic-edit.svg";
import logoutIcon from "./assets/ic-logout.svg";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(setUser(null));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    // 2. Instead of reloading, we just change this number
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <Router>
      <AddPost 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onPostCreated={handlePostCreated} // Simple way to refresh the list
      />

      <header>
        <Link to="/" className="logo">
          Blogs
        </Link>
        <nav>
          {!user ? (
            <>
              <Link to="/login" className="btn sign-in">
                <button >Sign in</button>
              </Link>
              <Link to="/register" className="btn get-started">
                <button >Get started</button>
              </Link>
            </>
          ) : (
            <>
              <span className="user-name">{user.email}</span>
              <button className="btn new-post" onClick={() => setIsModalOpen(true)}>
                <img src={editIcon} alt="SignIn" />
                New Post
              </button>
              <button className="btn logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="Logout" />
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h1 className="title main">Stories & Ideas</h1>
                <p>
                  A collection of thoughts, insights, and creative explorations
                  from our community of writers.
                </p>
                {/* 3. Pass the trigger to the list, it's pass through PublicBlogList.tsx */}
                <PublicBlogList refreshTrigger={refreshTrigger} />
              </main>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
