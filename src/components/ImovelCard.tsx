import Link from 'next/link';
import type { Imovel } from '@/lib/api';

function formatPreco(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  const fotoPrincipal = imovel.fotos?.[0]?.url;
  const preco = formatPreco(imovel.preco);

  return (
    <Link
      href={`/imovel/${imovel.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal}
            alt={imovel.titulo}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Sem foto
          </div>
        )}
        <div className="absolute left-2 top-2 rounded bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
          {imovel.finalidade === 'aluguel' ? 'Locação' : imovel.finalidade}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">{imovel.tipo}</p>
        <h2 className="mt-1 font-semibold text-slate-800 line-clamp-2">{imovel.titulo}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {imovel.bairro}, {imovel.cidade}
        </p>
        {imovel.quartos != null && (
          <p className="mt-1 text-sm text-slate-500">
            {imovel.quartos} quartos
            {imovel.area != null && ` · ${imovel.area} m²`}
          </p>
        )}
        <p className="mt-2 text-lg font-bold text-primary-600">{preco}</p>
      </div>
    </Link>
  );
}
