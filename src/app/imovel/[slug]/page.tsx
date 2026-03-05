import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buscarImovelPorSlug } from '@/lib/api';

function formatPreco(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

export default async function ImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const imovel = await buscarImovelPorSlug(slug);
  if (!imovel) notFound();

  const fotos = imovel.fotos ?? [];
  const fotoDestaque = fotos.find((f) => f.destaque) ?? fotos[0];

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-primary-600 hover:underline">
        ← Voltar para listagem
      </Link>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
              {imovel.finalidade}
            </span>
            <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {imovel.tipo}
            </span>
            <h1 className="text-2xl font-bold text-slate-800">{imovel.titulo}</h1>
            <p className="text-slate-600">
              {imovel.bairro}, {imovel.cidade} - {imovel.estado}
            </p>
            <p className="text-xl font-bold text-primary-600">{formatPreco(imovel.preco)}</p>
          </div>
          <div className="aspect-video bg-slate-100">
            {fotoDestaque ? (
              <img
                src={fotoDestaque.url}
                alt={imovel.titulo}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">Sem foto</div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 p-4">
          <h2 className="mb-2 font-semibold text-slate-800">Características</h2>
          <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 md:grid-cols-4">
            {imovel.area != null && <li>{imovel.area} m²</li>}
            {imovel.quartos != null && <li>{imovel.quartos} quartos</li>}
            {imovel.banheiros != null && <li>{imovel.banheiros} banheiros</li>}
            {imovel.vagas != null && <li>{imovel.vagas} vagas</li>}
          </ul>
        </div>

        {imovel.endereco && (
          <div className="border-t border-slate-200 p-4">
            <h2 className="mb-2 font-semibold text-slate-800">Endereço</h2>
            <p className="text-slate-600">
              {imovel.endereco}
              {imovel.numero && `, ${imovel.numero}`}
              {imovel.complemento && ` - ${imovel.complemento}`}
              <br />
              {imovel.bairro}, {imovel.cidade} - {imovel.estado}
              {imovel.cep && ` · CEP ${imovel.cep}`}
            </p>
          </div>
        )}

        <div className="border-t border-slate-200 p-4">
          <h2 className="mb-2 font-semibold text-slate-800">Descrição</h2>
          <p className="whitespace-pre-wrap text-slate-600">{imovel.descricao || 'Sem descrição.'}</p>
        </div>

        {fotos.length > 1 && (
          <div className="border-t border-slate-200 p-4">
            <h2 className="mb-2 font-semibold text-slate-800">Fotos</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {fotos.map((foto) => (
                <img
                  key={foto.id}
                  src={foto.url}
                  alt=""
                  className="h-24 w-32 flex-shrink-0 rounded object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
