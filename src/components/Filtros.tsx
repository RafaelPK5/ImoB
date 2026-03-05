'use client';

type FiltrosType = {
  tipo?: string;
  finalidade?: string;
  cidade?: string;
  ordem?: string;
  condominio?: string;
};

export function Filtros({
  filtros,
  onChange,
}: {
  filtros: FiltrosType;
  onChange: (f: FiltrosType) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Tipo de negócio</span>
        <select
          value={filtros.finalidade ?? ''}
          onChange={(e) => onChange({ ...filtros, finalidade: e.target.value || undefined })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="venda">Somente venda</option>
          <option value="aluguel">Somente locação</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Tipo de imóvel</span>
        <select
          value={filtros.tipo ?? ''}
          onChange={(e) => onChange({ ...filtros, tipo: e.target.value || undefined })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="casa">Casas</option>
          <option value="apartamento">Apartamentos</option>
          <option value="terreno">Terrenos</option>
          <option value="chacara">Chácaras</option>
          <option value="comercial">Comercial</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Condomínio</span>
        <select
          value={filtros.condominio ?? ''}
          onChange={(e) => onChange({ ...filtros, condominio: e.target.value || undefined })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="aruã">Complexo Aruã</option>
          <option value="brisas">Condomínio Brisas</option>
          <option value="ecopark">Condomínio Ecopark</option>
          <option value="outros">Outros condomínios</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Cidade</span>
        <input
          type="text"
          placeholder="Ex: Mogi das Cruzes"
          value={filtros.cidade ?? ''}
          onChange={(e) => onChange({ ...filtros, cidade: e.target.value || undefined })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Ordenar</span>
        <select
          value={filtros.ordem ?? ''}
          onChange={(e) => onChange({ ...filtros, ordem: e.target.value || undefined })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="createdAt">Mais recentes</option>
          <option value="preco">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
        </select>
      </label>
    </div>
  );
}
