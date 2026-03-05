'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listarMeusImoveis, excluirImovel, atualizarImovel, type Imovel } from '@/lib/api';

function formatPreco(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

export default function PainelPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarMeusImoveis()
      .then((res) => setImoveis(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDesativar(id: string) {
    if (!confirm('Desativar este anúncio? Ele deixará de aparecer no site.')) return;
    setDeletingId(id);
    try {
      await excluirImovel(id, false);
      setImoveis((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'inativo' } : i)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao desativar');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReativar(id: string) {
    setDeletingId(id);
    try {
      await atualizarImovel(id, { status: 'ativo' });
      setImoveis((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'ativo' } : i)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao reativar');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-24 rounded bg-slate-100" />
          <div className="h-24 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}. Verifique se está logado e se a API está rodando.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Meus anúncios</h1>
        <Link
          href="/painel/novo"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Novo anúncio
        </Link>
      </div>

      {imoveis.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>Você ainda não tem anúncios.</p>
          <Link href="/painel/novo" className="mt-2 inline-block text-primary-600 hover:underline">
            Criar primeiro anúncio
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Imóvel</th>
                <th className="px-4 py-3 font-medium text-slate-700">Tipo / Finalidade</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 font-medium text-slate-700">Preço</th>
                <th className="px-4 py-3 font-medium text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {imoveis.map((imovel) => (
                <tr key={imovel.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/imovel/${imovel.slug}`} className="font-medium text-primary-600 hover:underline">
                      {imovel.titulo}
                    </Link>
                    <div className="text-xs text-slate-500">
                      {imovel.bairro}, {imovel.cidade}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {imovel.tipo} · {imovel.finalidade === 'aluguel' ? 'Locação' : imovel.finalidade}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        imovel.status === 'ativo'
                          ? 'bg-green-100 text-green-800'
                          : imovel.status === 'rascunho'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {imovel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {formatPreco(imovel.preco)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/painel/imovel/${imovel.id}/editar`}
                        className="rounded-lg border border-primary-600 bg-white px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50"
                      >
                        Editar
                      </Link>
                      {imovel.status === 'ativo' && (
                        <button
                          type="button"
                          onClick={() => handleDesativar(imovel.id)}
                          disabled={deletingId === imovel.id}
                          className="rounded-lg border border-red-600 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === imovel.id ? 'Desativando...' : 'Desativar'}
                        </button>
                      )}
                      {imovel.status === 'inativo' && (
                        <button
                          type="button"
                          onClick={() => handleReativar(imovel.id)}
                          disabled={deletingId === imovel.id}
                          className="rounded-lg border border-green-600 bg-white px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                        >
                          {deletingId === imovel.id ? 'Reativando...' : 'Reativar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
