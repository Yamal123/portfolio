# AIPMYM Content API v1 (Contract-Grade)

Last updated: `2026-05-28`

## 0. Base URLs

- Production: `https://www.aipmym.com`
- Local: `http://localhost:3000`

---

## 1. Auth Model (Important)

Management write APIs are **session-cookie based**, not API-token based.

### 1.1 Login Flow

1. `POST /api/auth/login` with admin username/password.
2. Server sets `admin_session` cookie.
3. Call management APIs with this cookie.

### 1.2 Session Cookie Attributes (actual implementation)

- Cookie name: `admin_session`
- `HttpOnly: true`
- `SameSite: Lax`
- `Secure: true` in production, `false` in local dev
- `Path: /`
- Expiration: `2h` (`maxAge = 7200`)
- Domain: not explicitly set (host-only cookie)

### 1.3 CSRF / CORS Reality

- Current implementation does **not** require a separate CSRF token.
- Browser cross-site usage is constrained by `SameSite=Lax`.
- This API is designed for:
  - same-site admin frontend, or
  - server-to-server calls that can carry login cookie.
- It is **not** a public third-party write API.

### 1.4 Auth Endpoints

- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`

Example:

```bash
curl -i -c /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X POST "https://www.aipmym.com/api/auth/login" \
  -d '{"username":"admin","password":"<YOUR_PASSWORD>"}'
```

---

## 2. Response Contract

### 2.1 Success

```json
{ "code": 0, "data": {}, "message": "optional" }
```

### 2.2 Error

```json
{ "code": 400, "message": "error message" }
```

### 2.3 Common HTTP status

- `400` validation/bad input
- `401` unauthenticated
- `409` write conflict / not-found-on-update
- `429` rate-limited (agent endpoint)
- `503` service unavailable

Note: field-level zod issue details are currently not returned in response body.

---

## 3. Resource Models

## 3.1 Portfolio (Project)

```ts
type ProjectInput = {
  id?: number
  slug: string // ^[a-z0-9]+(?:-[a-z0-9]+)*$, 1..80
  name: { zh: string; en: string } // required
  thumbnail?: string // default ''
  type: { zh: string; en: string } // required
  intro: { zh: string; en: string } // required
  keywords?: string[] // <=20, default []
  tags?: string[] // <=20, default []
  emoji?: string // default ''
  problem: { zh: string; en: string } // required
  action: { zh: string; en: string } // required
  result: { zh: string; en: string } // required
  content: { zh: string; en: string } // required
  externalUrl?: string // default ''
  published?: boolean // default true
  sortOrder?: number // 0..10000, default 0
  createdAt?: string // optional; if absent, server uses now
}
```

Server view shape (`GET` response `data` item):

```ts
type ProjectView = {
  id: number
  slug: string
  name: { zh: string; en: string }
  thumbnail: string
  type: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  tags: string[]
  emoji: string
  problem: { zh: string; en: string }
  action: { zh: string; en: string }
  result: { zh: string; en: string }
  content: { zh: string; en: string }
  externalUrl: string
  published: boolean
  sortOrder: number
  createdAt: string // YYYY-MM-DD
}
```

## 3.2 Methodology (Article)

```ts
type ArticleInput = {
  id?: number
  slug: string // same slug rule
  title: { zh: string; en: string } // required
  intro: { zh: string; en: string } // required
  keywords?: string[] // <=20, default []
  content: { zh: string; en: string } // required
  published?: boolean // default true
  createdAt: string // required; used as publishedAt
}
```

Server view shape (`GET` response `data` item):

```ts
type ArticleView = {
  id: number
  slug: string
  title: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  content: { zh: string; en: string }
  published: boolean
  createdAt: string // YYYY-MM-DD
}
```

---

## 4. Endpoint Matrix

## 4.1 Public (read-only)

- `GET /api/public/portfolio`
- `GET /api/public/portfolio?slug=:slug`
- `GET /api/public/methods`
- `GET /api/public/methods?slug=:slug`

Compatibility aliases (same datasource):

- `GET /api/public/projects`
- `GET /api/public/projects?slug=:slug`
- `GET /api/public/articles`
- `GET /api/public/articles?slug=:slug`

Behavior:

- with `slug`: `data` is single object or `null`
- without `slug`: `data` is array
- public endpoints only return published and non-deleted rows

## 4.2 Management (cookie session required)

Portfolio:

- `GET /api/management/portfolio`
- `GET /api/management/portfolio?slug=:slug`
- `POST /api/management/portfolio`
- `PUT /api/management/portfolio`
- `DELETE /api/management/portfolio?slug=:slug`

Methodology:

- `GET /api/management/methods`
- `GET /api/management/methods?slug=:slug`
- `POST /api/management/methods`
- `PUT /api/management/methods`
- `DELETE /api/management/methods?slug=:slug`

Compatibility aliases (same datasource):

- `/api/management/projects`
- `/api/management/articles`

Behavior:

- `GET` returns admin-visible rows (includes unpublished, excludes soft-deleted)
- `PUT` is full-payload update by `slug`
- `PUT` on missing `slug` row returns `409`
- `DELETE` is soft delete by `slug`
- `DELETE` is effectively idempotent (currently returns success even if row not found)

---

## 5. Example Calls

## 5.1 Read Public Portfolio

```bash
curl -s "https://www.aipmym.com/api/public/portfolio?slug=ai-portfolio"
```

## 5.2 Read Public Methodology

```bash
curl -s "https://www.aipmym.com/api/public/methods?slug=agent-loop"
```

## 5.3 Create Portfolio (Management)

```bash
curl -s -b /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X POST "https://www.aipmym.com/api/management/portfolio" \
  -d '{
    "slug":"agent-copilot-demo",
    "name":{"zh":"Agent 协作台","en":"Agent Copilot"},
    "thumbnail":"/images/portfolio/agent-copilot.png",
    "type":{"zh":"AI 产品","en":"AI Product"},
    "intro":{"zh":"面向运营团队的 AI 协作台","en":"AI workspace for operations"},
    "keywords":["AI","Agent"],
    "tags":["workflow","automation"],
    "emoji":"🤖",
    "problem":{"zh":"多系统切换效率低","en":"Low efficiency across systems"},
    "action":{"zh":"构建统一任务面板","en":"Built unified task panel"},
    "result":{"zh":"处理效率提升 40%","en":"40% faster handling"},
    "content":{"zh":"# 中文正文","en":"# English body"},
    "externalUrl":"https://example.com",
    "published":true,
    "sortOrder":10,
    "createdAt":"2026-05-28"
  }'
```

## 5.4 Create Methodology (Management)

```bash
curl -s -b /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X POST "https://www.aipmym.com/api/management/methods" \
  -d '{
    "slug":"agent-runtime-playbook",
    "title":{"zh":"Agent 运行手册","en":"Agent Runtime Playbook"},
    "intro":{"zh":"从路由到观测的一线实践","en":"Practical guide from routing to observability"},
    "keywords":["agent","ops","playbook"],
    "content":{"zh":"# 中文内容","en":"# English content"},
    "published":true,
    "createdAt":"2026-05-28"
  }'
```

---

## 6. Reliability Checklist Before External Integration

For production integration, verify these first:

1. Admin credentials are configured (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
2. Session secret configured (`ADMIN_SESSION_SECRET`) in production.
3. Your caller can persist and send `admin_session` cookie.
4. You are not relying on browser cross-site cookie behavior for management APIs.
5. You have tested both success and failure responses for your exact payloads.

---

## 7. Verified Regression (Local)

Verified on `2026-05-28` against `http://localhost:3000`:

1. Login session cookie works.
2. Portfolio `POST/PUT/DELETE` works.
3. Public `/api/public/portfolio` and `/api/public/projects` reflect updates immediately.
4. Methodology `POST/PUT/DELETE` works.
5. Public `/api/public/methods` and `/api/public/articles` reflect updates immediately.
6. Agent can query newly created records and return site links.
7. Deleted records disappear from public read endpoints.
