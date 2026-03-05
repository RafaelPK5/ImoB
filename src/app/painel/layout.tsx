'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredToken } from '@/lib/auth-api';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/painel/login';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    const token = getStoredToken();
    if (!isLoginPage && !token) {
      router.replace('/painel/login');
    } else if (isLoginPage && token) {
      router.replace('/painel');
    }
  }, [mounted, authLoading, isLoginPage, router]);

  const handleLogout = () => {
    logout();
    router.replace('/painel/login');
  };

  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-slate-500">Carregando...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="mx-auto max-w-md py-8">{children}</div>;
  }

  return (
    <div className="flex gap-6">
      <aside className="w-56 flex-shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <nav className="flex flex-col gap-1">
          <Link
            href="/painel"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/painel' ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Meus anúncios
          </Link>
          <Link
            href="/painel/novo"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/painel/novo' ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            Novo anúncio
          </Link>
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Ver site
          </Link>
          <hr className="my-2 border-slate-200" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Sair
          </button>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
