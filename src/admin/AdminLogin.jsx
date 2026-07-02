import { useState } from 'react';
import { Lock } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { verifyAdminPassword, startAdminSession } from '../lib/auth.js';

export default function AdminLogin({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setChecking(true);
    setError('');
    const ok = await verifyAdminPassword(password);
    setChecking(false);
    if (ok) {
      startAdminSession();
      onUnlock();
    } else {
      setError('Incorrect password.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-5">
      <Card className="w-full max-w-sm p-8 animate-scale-in">
        <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
          <Lock className="w-5 h-5" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-ink mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted mb-6">Enter the local password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-line bg-card focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              placeholder="Password"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={checking}>
            {checking ? 'Checking…' : 'Unlock'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
