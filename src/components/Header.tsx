'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 flex-wrap items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Imobiliária
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-primary-600">
            Imóveis
          </Link>
          {isAuthenticated && (
            <Link href="/painel" className="hover:text-primary-600">
              Painel
            </Link>
          )}
          <Link href="#cadastre" className="hover:text-primary-600">
            Cadastre seu imóvel
          </Link>
          <Link href="#quem-somos" className="hover:text-primary-600">
            Quem somos
          </Link>
          <Link href="#contato" className="hover:text-primary-600">
            Contato
          </Link>
          <a
            href="#agende"
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Agende sua visita
          </a>
        </nav>
      </div>
    </header>
  );
}
