'use client';

import { useEffect, useState } from 'react';
import { listarImoveis, type ListagemResponse } from '@/lib/api';
import { ImovelCard } from '@/components/ImovelCard';
import { Filtros } from '@/components/Filtros';
import { Hero } from '@/components/Hero';
import { PorQueEscolher } from '@/components/PorQueEscolher';

export default function HomePage() {
  const [result, setResult] = useState<ListagemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState<{
    tipo?: string;
    finalidade?: string;
    cidade?: string;
    ordem?: string;
    condominio?: string;
  }>({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarImoveis({ page, limit: 12, ...filtros })
      .then(setResult)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [page, filtros.tipo, filtros.finalidade, filtros.cidade, filtros.ordem, filtros.condominio]);

  const pagination = result?.pagination;

  return (
    <div className="space-y-10">
      <Hero />

      <section>
        <h2 className="sr-only">Filtros e listagem</h2>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800">Imóveis disponíveis</h3>
          <p className="text-slate-600">Encontre o imóvel ideal para você</p>
        </div>

        <Filtros filtros={filtros} onChange={setFiltros} />

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}. Verifique se a API está rodando em {process.env.NEXT_PUBLIC_API_URL}.
          </div>
        )}

        {!loading && !error && result && (
          <>
            {result.data.length === 0 ? (
              <p className="rounded-lg bg-slate-100 p-6 text-center text-slate-600">
                Nenhum imóvel encontrado. Cadastre imóveis com status &quot;ativo&quot; no painel admin
                ou ajuste os filtros.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {result.data.map((imovel) => (
                  <ImovelCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-slate-600">
                  Página {pagination.page} de {pagination.totalPages} ({pagination.total} imóveis)
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <PorQueEscolher />
    </div>
  );
}
