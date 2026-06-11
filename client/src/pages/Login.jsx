import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #3730a3 100%)',
      }}
    >
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }}></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)', transform: 'translate(30%, 30%)' }}></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }}></div>

      {/* Card */}
      <div
        className="relative w-full max-w-md mx-4"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}
          >
            <FaMicrophone className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Consultation Manager</h1>
          <p className="text-indigo-300 text-sm mt-1">Manage consultations effortlessly.</p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-1.5">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@crm.com"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  borderRadius: '12px',
                  width: '100%',
                  padding: '0.75rem 0.875rem 0.75rem 2.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(167,139,250,0.6)'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-200 mb-1.5">Password</label>
            <div className="relative">
              <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  borderRadius: '12px',
                  width: '100%',
                  padding: '0.75rem 0.875rem 0.75rem 2.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(167,139,250,0.6)'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all"
            style={{
              background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(79,70,229,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
            }}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Signing in...</>
            ) : (
              <>Sign in <MdArrowForward className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Hint */}
        <div
          className="mt-6 p-3 rounded-xl text-xs text-center"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-indigo-300">Demo credentials: </span>
          <span className="text-white font-mono">admin@crm.com</span>
          <span className="text-indigo-300"> / </span>
          <span className="text-white font-mono">admin123</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
