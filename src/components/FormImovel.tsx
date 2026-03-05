'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Imovel } from '@/lib/api';
import type { ImovelPayload } from '@/lib/api';

const TIPOS = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'comercial', label: 'Comercial' },
];

const FINALIDADES = [
  { value: 'venda', label: 'Venda' },
  { value: 'aluguel', label: 'Locação' },
];

const ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

type Props = {
  initialData?: Partial<Imovel> | null;
  onSubmit: (payload: ImovelPayload) => Promise<void>;
  submitLabel: string;
};

function toNum(v: unknown): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export function FormImovel({ initialData, onSubmit, submitLabel }: Props) {
  const [titulo, setTitulo] = useState(initialData?.titulo ?? '');
  const [tipo, setTipo] = useState(initialData?.tipo ?? 'casa');
  const [finalidade, setFinalidade] = useState(initialData?.finalidade ?? 'venda');
  const [descricao, setDescricao] = useState(initialData?.descricao ?? '');
  const [preco, setPreco] = useState(
    initialData?.preco != null ? String(initialData.preco) : ''
  );
  const [endereco, setEndereco] = useState(initialData?.endereco ?? '');
  const [numero, setNumero] = useState(initialData?.numero ?? '');
  const [complemento, setComplemento] = useState(initialData?.complemento ?? '');
  const [bairro, setBairro] = useState(initialData?.bairro ?? '');
  const [cidade, setCidade] = useState(initialData?.cidade ?? '');
  const [estado, setEstado] = useState(initialData?.estado ?? 'SP');
  const [cep, setCep] = useState(initialData?.cep ?? '');
  const [area, setArea] = useState(initialData?.area != null ? String(initialData.area) : '');
  const [quartos, setQuartos] = useState(initialData?.quartos != null ? String(initialData.quartos) : '');
  const [banheiros, setBanheiros] = useState(initialData?.banheiros != null ? String(initialData.banheiros) : '');
  const [vagas, setVagas] = useState(initialData?.vagas != null ? String(initialData.vagas) : '');
  const [condominio, setCondominio] = useState(initialData?.condominio != null ? String(initialData.condominio) : '');
  const [iptu, setIptu] = useState(initialData?.iptu != null ? String(initialData.iptu) : '');
  const [status, setStatus] = useState(initialData?.status ?? 'rascunho');
  const [destaque, setDestaque] = useState(initialData?.destaque ?? false);
  const [fotosUrls, setFotosUrls] = useState(
    initialData?.fotos?.length
      ? initialData.fotos.map((f) => f.url).join('\n')
      : ''
  );
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const precoNum = toNum(preco);
    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }
    if (precoNum === undefined || precoNum < 0) {
      setError('Preço inválido');
      return;
    }
    if (!endereco.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      setError('Endereço, bairro, cidade e estado são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const fotos = fotosUrls
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter(Boolean)
        .map((url, i) => ({ url, ordem: i, destaque: i === 0 }));
      await onSubmit({
        titulo: titulo.trim(),
        tipo,
        finalidade,
        descricao: descricao.trim() || undefined,
        preco: precoNum,
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        numero: numero.trim() || null,
        complemento: complemento.trim() || null,
        cep: cep.trim() || null,
        area: toNum(area) ?? undefined,
        quartos: toNum(quartos) ?? undefined,
        banheiros: toNum(banheiros) ?? undefined,
        vagas: toNum(vagas) ?? undefined,
        condominio: toNum(condominio) ?? undefined,
        iptu: toNum(iptu) ?? undefined,
        status,
        destaque,
        slug: slug.trim() || undefined,
        fotos: fotos.length ? fotos : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Título *</span>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tipo</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Finalidade</span>
          <select
            value={finalidade}
            onChange={(e) => setFinalidade(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {FINALIDADES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Descrição</span>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Preço (R$) *</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="rascunho">Rascunho</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={destaque}
            onChange={(e) => setDestaque(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">Destaque</span>
        </label>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-slate-800">Endereço</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Logradouro *</span>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Número</span>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Complemento</span>
            <input
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Bairro *</span>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Cidade *</span>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Estado *</span>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">CEP</span>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-slate-800">Características</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Área (m²)</span>
            <input
              type="number"
              min={0}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Quartos</span>
            <input
              type="number"
              min={0}
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Banheiros</span>
            <input
              type="number"
              min={0}
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Vagas</span>
            <input
              type="number"
              min={0}
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Condomínio (R$)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={condominio}
              onChange={(e) => setCondominio(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">IPTU (R$)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={iptu}
              onChange={(e) => setIptu(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-slate-800">Fotos e URL</h3>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Slug (deixe em branco para gerar)</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="apartamento-centro"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-sm font-medium text-slate-700">URLs das fotos (uma por linha ou separadas por vírgula)</span>
          <textarea
            value={fotosUrls}
            onChange={(e) => setFotosUrls(e.target.value)}
            rows={4}
            placeholder="https://exemplo.com/foto1.jpg"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      <div className="flex gap-3 border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : submitLabel}
        </button>
        <Link
          href="/painel"
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
