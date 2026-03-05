'use client';

import { useRouter } from 'next/navigation';
import { FormImovel } from '@/components/FormImovel';
import { criarImovel } from '@/lib/api';

export default function NovoAnuncioPage() {
  const router = useRouter();

  async function handleSubmit(payload: Parameters<typeof criarImovel>[0]) {
    await criarImovel(payload);
    router.push('/painel');
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Novo anúncio</h1>
      <p className="mt-1 text-slate-600">Preencha os dados do imóvel. Campos com * são obrigatórios.</p>
      <div className="mt-6">
        <FormImovel onSubmit={handleSubmit} submitLabel="Criar anúncio" />
      </div>
    </div>
  );
}
