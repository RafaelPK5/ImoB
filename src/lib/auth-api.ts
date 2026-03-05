const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'corretor';
};

export type LoginResponse = {
  user: User;
  token: string;
};

const STORAGE_TOKEN = 'imob_token';
const STORAGE_USER = 'imob_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_TOKEN);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: User, token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (DEMO_MODE) {
    const users: User[] = [
      { id: 'userdemo-admin', email: 'admin@imobiliaria.com', name: 'Admin Silva', role: 'admin' },
      { id: 'userdemo-corretor', email: 'corretor@imobiliaria.com', name: 'Maria Corretora', role: 'corretor' },
    ];

    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    await new Promise((r) => setTimeout(r, 400));

    if (!user || password !== '123456') {
      throw new Error('Credenciais inválidas para o ambiente de demonstração');
    }

    return {
      user,
      token: `demo-token-${user.role}`,
    };
  }

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data.message as string) || 'Erro ao fazer login');
  }
  return data as LoginResponse;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
