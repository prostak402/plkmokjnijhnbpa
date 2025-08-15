'use client';

import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple login that sets a cookie. Replace with real auth.
    document.cookie = `admin-token=${username}; path=/`;
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h1>Admin Login</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
