# 🟢 CooperaCom — Plataforma de Projetos Comunitários

O **CooperaCom** é uma plataforma que conecta iniciativas sociais a pessoas dispostas a ajudar.  
Permite criar projetos, gerenciar voluntários, acompanhar avisos e conversar por meio de um chat interno — tudo de forma simples e intuitiva.

🌍 Projeto rodando:
https://cooperacom-front.pages.dev/

---

# 🛠️ Rodando o projeto localmente

Abaixo está o passo a passo para fazer o sistema rodar no seu computador.

---

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/CooperaCom.git
cd CooperaCom
```
## 2️⃣ Configurar o backend
Entre na pasta:
```bash
cd backend
```
Instale as dependências:
```bash
npm install
```
Crie um arquivo .env com:
```bash
PORT=3000
# Banco
DATABASE_URL=postgres://postgres:senha@localhost:5432/cooperacom

# JWT
JWT_SECRET=sua_chave_secreta

# Email
RESEND_API_KEY=sua-chave-do-resend
EMAIL_TO=email-que-criou-a-chave

# Storage
STORAGE_DRIVER=local
```
Inicie o servidor:
```bash
npm run dev
```

Backend local rodando em:
👉 http://localhost:3000

## 3️⃣ Configurar banco local (PostgreSQL)
No PostgreSQL crie um banco chamado cooperacom com o seguinte sql
```bash
-- ============================================================
-- Usuários
-- ============================================================

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Categorias
-- ============================================================

CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ============================================================
-- Projetos
-- ============================================================

CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    notice_board TEXT,
    category_id INT REFERENCES public.categories(id) ON DELETE SET NULL,
    creator_id INT REFERENCES public.users(id) ON DELETE SET NULL,
    number_volunteer INT,
    current_volunteer INT,
    project_date DATE,
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Voluntários
-- ============================================================

CREATE TABLE public.volunteers (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE SET NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Mensagens (Chat)
-- ============================================================

CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id INT REFERENCES public.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Trigger para limpeza ao excluir usuário
-- ============================================================

CREATE OR REPLACE FUNCTION public.cleanup_user_volunteers()
RETURNS TRIGGER AS $$
BEGIN
    -- Remover o usuário dos projetos ativos
    DELETE FROM public.volunteers
    WHERE user_id = OLD.id
      AND project_id IN (SELECT id FROM public.projects WHERE status = 'ativo');

    -- Atualizar contador de voluntários
    UPDATE public.projects p
    SET current_volunteer = sub.count
    FROM (
        SELECT project_id, COUNT(*) AS count
        FROM public.volunteers
        WHERE user_id IS NOT NULL
        GROUP BY project_id
    ) AS sub
    WHERE p.id = sub.project_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cleanup_user_volunteers
BEFORE DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.cleanup_user_volunteers();

-- ============================================================
-- Categorias iniciais
-- ============================================================

INSERT INTO public.categories (name, description) VALUES
('Meio Ambiente', 'Projetos relacionados à sustentabilidade e ecologia'),
('Educação', 'Projetos voltados ao ensino e capacitação'),
('Comunidade', 'Ações sociais e de apoio local'),
('Tecnologia', 'Iniciativas de inovação e software'),
('Saúde', 'Projetos voltados à saúde pública e bem-estar');

```
## 4️⃣ Rodando o frontend
Em outra aba do terminal:

Entre na pasta
```bash
cd /frontend
```

Suba um servidor local:
```bash
python -m http.server 8001
```

Frontend disponível em:
👉 http://localhost:8001

🔌 Integração com o backend

No arquivo do frontend:
/js/api.js

Substitua:
```bash
const apiBaseURL = "https://cooperacom-production.up.railway.app/api";
```
por
```bash
const API_BASE_URL = "http://localhost:3000/api";
```
E no arquivo do frontend:
/js/chat.js

Substitua:
```bash
const SOCKET_SERVER_URL = "https://cooperacom-production.up.railway.app";
```
por
```bash
const SOCKET_SERVER_URL = "http://localhost:3000";
```
