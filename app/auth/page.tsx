'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('fitmanager_auth', 'true');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Password non corretta');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e titolo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">FitManager Pro</h1>
          <p className="text-slate-500 mt-2">Accedi al tuo gestionale</p>
        </div>

        {/* Card login */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errore */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Campo password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11 pr-11"
                  placeholder="Inserisci la password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Pulsante submit */}
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-white/30 border-t-white"></div>
                  Accesso in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          FitManager Pro v4.0 • Powered by AI
        </p>
      </div>
    </div>
  );
}
