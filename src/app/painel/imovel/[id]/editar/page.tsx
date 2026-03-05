'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FormImovel } from '@/components/FormImovel';
import { listarMeusImoveis, atualizarImovel, type Imovel } from '@/lib/api';
import type { ImovelPayload } from '@/lib/api';

export default function EditarAnuncioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarMeusImoveis()
      .then((res) => {
        const found = res.data.find((i) => i.id === id);
        setImovel(found ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload: ImovelPayload) {
    await atualizarImovel(id, payload);
    router.push('/painel');
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-32 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error || !imovel) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error || 'Anúncio não encontrado ou você não tem permissão para editá-lo.'}
        <Link href="/painel" className="ml-2 underline">Voltar ao painel</Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Editar anúncio</h1>
      <p className="mt-1 text-slate-600">{imovel.titulo}</p>
      <div className="mt-6">
        <FormImovel
          initialData={imovel}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
