# Consumindo a API – Login e rotas protegidas

Este guia mostra como consumir a API do backend na **tela de login** e como usar o token nas demais requisições.

---

## Base URL

Em desenvolvimento, a API roda em:

```
http://localhost:3001/api
```

Ajuste a URL base no seu front (variável de ambiente ou constante) conforme o ambiente.

---

## Login

### Endpoint

| Método | URL           | Autenticação |
|--------|----------------|--------------|
| `POST` | `/api/auth/login` | Não          |

### Corpo da requisição (JSON)

| Campo    | Tipo   | Obrigatório | Descrição      |
|----------|--------|-------------|----------------|
| `email`  | string | Sim         | Email do usuário |
| `password` | string | Sim       | Senha          |

**Exemplo:**

```json
{
  "email": "admin@imobiliaria.com",
  "password": "123456"
}
```

### Resposta de sucesso (200)

```json
{
  "user": {
    "id": "user0000000001",
    "email": "admin@imobiliaria.com",
    "name": "Admin Silva",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guarde o `token` e o `user` no front (contexto, localStorage, etc.) para usar após o login.

### Respostas de erro

| Status | Situação              | Exemplo de corpo                          |
|--------|------------------------|-------------------------------------------|
| `400`  | Email ou senha em branco | `{ "message": "Email e senha são obrigatórios" }` |
| `401`  | Credenciais inválidas  | `{ "message": "Email ou senha inválidos" }` |
| `500`  | Erro no servidor       | `{ "message": "Erro ao fazer login" }`    |

---

## Enviando o token nas requisições

Todas as rotas **protegidas** exigem o header:

```
Authorization: Bearer <seu_token_aqui>
```

Ou seja: a palavra `Bearer`, um espaço e em seguida o valor do `token` retornado no login.

---

## Exemplos de código

### Fetch (JavaScript/TypeScript)

```ts
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@imobiliaria.com',
    password: '123456',
  }),
});

if (!response.ok) {
  const data = await response.json().catch(() => ({}));
  throw new Error(data.message ?? 'Erro ao fazer login');
}

const { user, token } = await response.json();

// Salvar no estado/localStorage para usar depois
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

### Requisição autenticada (ex.: meus anúncios)

```ts
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/imoveis/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (response.status === 401) {
  // Token inválido ou expirado → redirecionar para login
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // redirect to /login
  return;
}

const { data } = await response.json();
```

### Axios

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'admin@imobiliaria.com',
  password: '123456',
});

const { user, token } = data;
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Opcional: persistir e reaplicar o token ao recarregar a página
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Interceptor para reaplicar o token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para 401 → deslogar e ir para login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // redirect to /login
    }
    return Promise.reject(err);
  }
);
```

---

## Fluxo sugerido na tela de login

1. Usuário preenche **email** e **senha** e clica em “Entrar”.
2. Disparar `POST /api/auth/login` com `{ email, password }`.
3. **Sucesso (200):**
   - Guardar `user` e `token` (estado global, contexto ou `localStorage`).
   - Redirecionar para a área logada (ex.: dashboard ou listagem de “Meus anúncios”).
4. **Erro 400 ou 401:**
   - Exibir a `message` retornada (ex.: “Email ou senha inválidos”) na própria tela de login.
5. **Erro 500 ou rede:**
   - Exibir mensagem genérica (ex.: “Erro ao conectar. Tente de novo.”).

---

## Dados de teste (seed)

Use estes usuários após rodar o seed no backend (`npm run db:seed`):

| Email                     | Senha   | Nome             | Role     |
|---------------------------|---------|------------------|----------|
| `admin@imobiliaria.com`   | `123456` | Admin Silva      | `admin`  |
| `corretor@imobiliaria.com` | `123456` | Maria Corretora | `corretor` |

O campo `role` pode ser usado no front para exibir menus ou rotas diferentes (ex.: apenas admin vê gestão de usuários).

---

## Rotas que exigem token

Depois do login, estas rotas devem receber o header `Authorization: Bearer <token>`:

| Método   | Rota                 | Descrição              |
|----------|----------------------|------------------------|
| `GET`    | `/api/imoveis/me`    | Listar meus anúncios   |
| `POST`   | `/api/imoveis`       | Criar anúncio          |
| `PATCH`  | `/api/imoveis/:id`   | Atualizar anúncio      |
| `DELETE` | `/api/imoveis/:id`   | Desativar ou apagar anúncio |

Se o token estiver ausente, inválido ou expirado, a API responde com **401** e corpo como `{ "message": "Token não informado" }` ou `{ "message": "Token inválido ou expirado" }`. Nesses casos, o front deve deslogar o usuário e redirecionar para a tela de login.
