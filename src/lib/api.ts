const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

import { getAuthHeaders, clearStoredAuth, getStoredUser } from './auth-api';

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

// -------------------- DEMO MODE (mock) --------------------

let demoImoveisCache: Imovel[] | null = null;

function getDemoImoveis(): Imovel[] {
  if (!demoImoveisCache) {
    const now = new Date().toISOString();
    demoImoveisCache = [
      {
        id: 'imovel-demo-1',
        slug: 'casa-sp-jardins-venda',
        titulo: 'Casa ampla nos Jardins, 4 suítes',
        tipo: 'casa',
        finalidade: 'venda',
        descricao: 'Casa em condomínio fechado, 350m², jardim, churrasqueira, piscina. Excelente localização.',
        preco: 2_850_000,
        condominio: null,
        iptu: 4200,
        area: 350,
        quartos: 4,
        banheiros: 5,
        vagas: 4,
        endereco: 'Rua Oscar Freire',
        numero: '1200',
        complemento: null,
        bairro: 'Jardins',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01426-001',
        status: 'ativo',
        destaque: true,
        fotos: [
          { id: 'foto-demo-1-1', url: 'https://picsum.photos/800/600?random=11', ordem: 0, destaque: true },
          { id: 'foto-demo-1-2', url: 'https://picsum.photos/800/600?random=12', ordem: 1, destaque: false },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'imovel-demo-2',
        slug: 'apartamento-copacabana-aluguel',
        titulo: 'Apartamento 2 quartos com vista para o mar',
        tipo: 'apartamento',
        finalidade: 'aluguel',
        descricao: 'Apartamento reformado, vista mar, 85m². Próximo ao metrô e praia.',
        preco: 4_200,
        condominio: 1200,
        iptu: 380,
        area: 85,
        quartos: 2,
        banheiros: 2,
        vagas: 1,
        endereco: 'Avenida Atlântica',
        numero: '2200',
        complemento: null,
        bairro: 'Copacabana',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '22041-080',
        status: 'ativo',
        destaque: true,
        fotos: [
          { id: 'foto-demo-2-1', url: 'https://picsum.photos/800/600?random=21', ordem: 0, destaque: true },
          { id: 'foto-demo-2-2', url: 'https://picsum.photos/800/600?random=22', ordem: 1, destaque: false },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'imovel-demo-3',
        slug: 'terreno-curitiba-batel',
        titulo: 'Terreno 400m² no Batel',
        tipo: 'terreno',
        finalidade: 'venda',
        descricao: 'Terreno plano, esquina, ótimo para construção. Região valorizada.',
        preco: 1_200_000,
        condominio: null,
        iptu: null,
        area: 400,
        quartos: null,
        banheiros: null,
        vagas: null,
        endereco: 'Rua Chile',
        numero: '500',
        complemento: null,
        bairro: 'Batel',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '80420-000',
        status: 'ativo',
        destaque: false,
        fotos: [
          { id: 'foto-demo-3-1', url: 'https://picsum.photos/800/600?random=31', ordem: 0, destaque: true },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'imovel-demo-4',
        slug: 'sala-comercial-belo-horizonte',
        titulo: 'Sala comercial 120m² - Savassi',
        tipo: 'comercial',
        finalidade: 'aluguel',
        descricao: 'Sala em andar nobre, ar condicionado, recepção. Pronto para uso.',
        preco: 8_500,
        condominio: 2100,
        iptu: 950,
        area: 120,
        quartos: null,
        banheiros: 2,
        vagas: 3,
        endereco: 'Avenida Getúlio Vargas',
        numero: '1500',
        complemento: null,
        bairro: 'Savassi',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        cep: '30112-020',
        status: 'ativo',
        destaque: true,
        fotos: [
          { id: 'foto-demo-4-1', url: 'https://picsum.photos/800/600?random=41', ordem: 0, destaque: true },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
  return demoImoveisCache!;
}

function setDemoImoveis(next: Imovel[]): void {
  demoImoveisCache = next;
}

export async function listarImoveis(params?: {
  page?: number;
  limit?: number;
  tipo?: string;
  finalidade?: string;
  cidade?: string;
  ordem?: string;
  condominio?: string;
}): Promise<ListagemResponse> {
  if (DEMO_MODE) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;
    const ordem = params?.ordem ?? 'createdAt';

    let data = getDemoImoveis().filter((i) => i.status === 'ativo');

    if (params?.tipo) {
      data = data.filter((i) => i.tipo === params.tipo);
    }
    if (params?.finalidade) {
      data = data.filter((i) => i.finalidade === params.finalidade);
    }
    if (params?.cidade) {
      const c = params.cidade.toLowerCase();
      data = data.filter((i) => i.cidade.toLowerCase().includes(c));
    }

    if (ordem === 'preco') {
      data = [...data].sort((a, b) => Number(a.preco) - Number(b.preco));
    } else if (ordem === 'preco-desc') {
      data = [...data].sort((a, b) => Number(b.preco) - Number(a.preco));
    } else {
      data = [...data].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const pageData = data.slice(start, start + limit);

    await new Promise((r) => setTimeout(r, 300));

    return {
      data: pageData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

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
  if (DEMO_MODE) {
    const imovel = getDemoImoveis().find((i) => i.slug === slug) ?? null;
    await new Promise((r) => setTimeout(r, 200));
    return imovel ?? null;
  }

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
  if (DEMO_MODE) {
    const user = getStoredUser();
    if (!user) {
      throw new Error('Faça login para ver seus anúncios');
    }
    const all = getDemoImoveis();
    const data = all.filter((i) => (i as any).userId ? (i as any).userId === user.id : true);
    await new Promise((r) => setTimeout(r, 250));
    return { data };
  }

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
  if (DEMO_MODE) {
    const user = getStoredUser();
    if (!user) {
      throw new Error('Faça login para criar anúncios');
    }
    const now = new Date().toISOString();
    const all = getDemoImoveis();
    const newImovel: Imovel = {
      id: `imovel-demo-${all.length + 1}-${Date.now()}`,
      titulo: payload.titulo,
      slug: payload.slug || `${payload.titulo.toLowerCase().replace(/\s+/g, '-')}-${all.length + 1}`,
      tipo: payload.tipo || 'casa',
      finalidade: payload.finalidade || 'venda',
      descricao: payload.descricao || '',
      preco: payload.preco,
      condominio: payload.condominio ?? null,
      iptu: payload.iptu ?? null,
      area: payload.area ?? null,
      quartos: payload.quartos ?? null,
      banheiros: payload.banheiros ?? null,
      vagas: payload.vagas ?? null,
      endereco: payload.endereco,
      numero: payload.numero ?? null,
      complemento: payload.complemento ?? null,
      bairro: payload.bairro,
      cidade: payload.cidade,
      estado: payload.estado,
      cep: payload.cep ?? null,
      status: payload.status || 'ativo',
      destaque: Boolean(payload.destaque),
      fotos: payload.fotos?.map((f, idx) => ({
        id: `foto-demo-new-${Date.now()}-${idx}`,
        url: f.url,
        ordem: f.ordem ?? idx,
        destaque: Boolean(f.destaque),
      })),
      createdAt: now,
      updatedAt: now,
    };
    setDemoImoveis([...all, newImovel]);
    await new Promise((r) => setTimeout(r, 300));
    return newImovel;
  }

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
  if (DEMO_MODE) {
    const all = getDemoImoveis();
    const idx = all.findIndex((i) => i.id === id);
    if (idx === -1) {
      throw new Error('Imóvel não encontrado (demo)');
    }
    const current = all[idx];
    const updated: Imovel = {
      ...current,
      ...payload,
      preco: payload.preco ?? current.preco,
      updatedAt: new Date().toISOString(),
    };
    const next = [...all];
    next[idx] = updated;
    setDemoImoveis(next);
    await new Promise((r) => setTimeout(r, 250));
    return updated;
  }

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
  if (DEMO_MODE) {
    const all = getDemoImoveis();
    const idx = all.findIndex((i) => i.id === id);
    if (idx === -1) return;
    if (apagarPermanentemente) {
      const next = all.filter((i) => i.id !== id);
      setDemoImoveis(next);
    } else {
      const next = [...all];
      next[idx] = { ...all[idx], status: 'inativo', updatedAt: new Date().toISOString() };
      setDemoImoveis(next);
    }
    await new Promise((r) => setTimeout(r, 200));
    return;
  }

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
