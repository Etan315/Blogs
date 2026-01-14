import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username, // Saving username to metadata
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      dispatch(setUser(data.user));
      navigate('/'); 
    }
    setLoading(false);
  };

  return (
    <section className="auth-container">
      <div className='title'>
        <h2>Join Blogs</h2>
        <p>Create an account to start sharing your stories with the world.</p>
      </div>

      <form onSubmit={handleSignUp}>
        <div >
          <h3 className='h-form'>Create Account</h3>
          <p className='p-form'>Fill in your details to get started</p>
        </div>
        <label>Username</label>
        <input type="text" placeholder="Your name" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="*****" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </section>
  );
};