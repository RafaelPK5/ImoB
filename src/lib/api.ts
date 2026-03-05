const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

import { getAuthHeaders, clearStoredAuth } from './auth-api';

export type Foto = {
  id: string;
  url: string;
  ordem: number;
  destaque: boolean;
};

export type Imovel = {
  id: string;
  titulo: string;
  slug: string;
  tipo: string;
  finalidade: string;
  descricao: string;
  preco: number | string;
  condominio?: number | string | null;
  iptu?: number | string | null;
  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  endereco: string;
  numero?: string | null;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string | null;
  status: string;
  destaque: boolean;
  fotos?: Foto[];
  createdAt: string;
  updatedAt: string;
};

export type ListagemResponse = {
  data: Imovel[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function listarImoveis(params?: {
  page?: number;
  limit?: number;
  tipo?: string;
  finalidade?: string;
  cidade?: string;
  ordem?: string;
  condominio?: string;
}): Promise<ListagemResponse> {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.tipo) search.set('tipo', params.tipo);
  if (params?.finalidade) search.set('finalidade', params.finalidade);
  if (params?.cidade) search.set('cidade', params.cidade);
  if (params?.ordem) search.set('ordem', params.ordem);
  if (params?.condominio) search.set('condominio', params.condominio);
  const res = await fetch(`${API_URL}/api/imoveis?${search.toString()}`);
  if (!res.ok) throw new Error('Erro ao carregar imóveis');
  return res.json();
}

export async function buscarImovelPorSlug(slug: string): Promise<Imovel | null> {
  const res = await fetch(`${API_URL}/api/imoveis/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Erro ao carregar imóvel');
  return res.json();
}

/** Payload para criar ou atualizar imóvel (campos enviados à API). */
export type ImovelPayload = {
  titulo: string;
  tipo?: string;
  finalidade?: string;
  descricao?: string;
  preco: number;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero?: string | null;
  complemento?: string | null;
  cep?: string | null;
  condominio?: number | null;
  iptu?: number | null;
  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  status?: string;
  destaque?: boolean;
  slug?: string;
  latitude?: number | null;
  longitude?: number | null;
  fotos?: Array<{ url: string; ordem?: number; destaque?: boolean }>;
};

function checkAuthResponse(res: Response): void {
  if (res.status === 401) {
    clearStoredAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/painel/login';
    }
  }
}

/** Lista anúncios do usuário logado (GET /api/imoveis/me). */
export async function listarMeusImoveis(): Promise<{ data: Imovel[] }> {
  const res = await fetch(`${API_URL}/api/imoveis/me`, {
    headers: { ...getAuthHeaders() },
  });
  checkAuthResponse(res);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data.message as string) || 'Erro ao listar anúncios');
  }
  return res.json();
}

/** Cria anúncio (POST /api/imoveis). */
export async function criarImovel(payload: ImovelPayload): Promise<Imovel> {
  const res = await fetch(`${API_URL}/api/imoveis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  checkAuthResponse(res);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || 'Erro ao criar anúncio');
  }
  return data as Imovel;
}

/** Atualiza anúncio (PATCH /api/imoveis/:id). */
export async function atualizarImovel(id: string, payload: Partial<ImovelPayload>): Promise<Imovel> {
  const res = await fetch(`${API_URL}/api/imoveis/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  checkAuthResponse(res);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || 'Erro ao atualizar anúncio');
  }
  return data as Imovel;
}

/** Desativa anúncio (DELETE sem ?apagar=true) ou exclui permanentemente (?apagar=true). */
export async function excluirImovel(id: string, apagarPermanentemente = false): Promise<void> {
  const url = apagarPermanentemente ? `${API_URL}/api/imoveis/${id}?apagar=true` : `${API_URL}/api/imoveis/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  checkAuthResponse(res);
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data.message as string) || 'Erro ao excluir anúncio');
  }
}
