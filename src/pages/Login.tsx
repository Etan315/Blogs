import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      console.log("login data: ", data.user);
      dispatch(setUser(data.user));
      navigate("/"); // Redirect to home
    }
    setLoading(false);
  };

  return (
    <section className="auth-container">
      <div className="title">
        <h2>Welcome back</h2>
        <p>Sign in to continue writing and sharing your stories.</p>
      </div>
      <form onSubmit={handleLogin}>
        <div>
          <h3 className="h-form">Sign In</h3>
          <p className="p-form">
            Enter your credentials to access your account
          </p>
        </div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </section>
  );
};
