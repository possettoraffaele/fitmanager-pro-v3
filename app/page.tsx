'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Controlla se l'utente è autenticato
    const isAuth = localStorage.getItem('fitmanager_auth');
    if (isAuth === 'true') {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
}
