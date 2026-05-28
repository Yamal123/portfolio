# AIPMYM Content API v1

Base URL:

```text
https://www.aipmym.com
```

Local:

```text
http://localhost:3000
```

## 1) Auth & Security

- Admin write APIs require same-origin session cookie.
- Login: `POST /api/auth/login`
- Check session: `GET /api/auth/session`
- Logout: `POST /api/auth/logout`
- JSON content type: `application/json`
- All write APIs validate request body with `zod`.

Login example:

```bash
curl -i -c /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X POST "https://www.aipmym.com/api/auth/login" \
  -d '{"username":"admin","password":"<YOUR_PASSWORD>"}'
```

## 2) Unified Response Contract

Success:

```json
{ "code": 0, "data": {}, "message": "optional" }
```

Failure:

```json
{ "code": 400, "message": "error message" }
```

Common status:

- `400` bad request / validation failed
- `401` unauthenticated
- `409` conflict (e.g. duplicate slug)
- `429` rate limited
- `503` upstream/service unavailable

---

## 3) Portfolio Module APIs

Portfolio = project content module. These are alias APIs designed for business semantics. They map to the same data source as `/api/public/projects` and `/api/management/projects`.

### 3.1 Public Read

#### `GET /api/public/portfolio`

- Query:
  - `slug` (optional): get single item by slug

Examples:

```bash
curl -s "https://www.aipmym.com/api/public/portfolio"
curl -s "https://www.aipmym.com/api/public/portfolio?slug=ai-portfolio"
```

### 3.2 Admin CRUD

#### `GET /api/management/portfolio`

```bash
curl -s -b /tmp/aipmym.cookies \
  "https://www.aipmym.com/api/management/portfolio"
```

#### `POST /api/management/portfolio`

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

#### `PUT /api/management/portfolio`

```bash
curl -s -b /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X PUT "https://www.aipmym.com/api/management/portfolio" \
  -d '{ ...same payload as POST... }'
```

#### `DELETE /api/management/portfolio?slug=...`

```bash
curl -s -b /tmp/aipmym.cookies \
  -X DELETE "https://www.aipmym.com/api/management/portfolio?slug=agent-copilot-demo"
```

---

## 4) Methodology Module APIs

Methodology = long-form knowledge articles. These are alias APIs mapped to the same content source as `/api/public/articles` and `/api/management/articles`.

### 4.1 Public Read

#### `GET /api/public/methods`

- Query:
  - `slug` (optional): get single item by slug

Examples:

```bash
curl -s "https://www.aipmym.com/api/public/methods"
curl -s "https://www.aipmym.com/api/public/methods?slug=agent-loop"
```

### 4.2 Admin CRUD

#### `GET /api/management/methods`

```bash
curl -s -b /tmp/aipmym.cookies \
  "https://www.aipmym.com/api/management/methods"
```

#### `POST /api/management/methods`

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

#### `PUT /api/management/methods`

```bash
curl -s -b /tmp/aipmym.cookies \
  -H "Content-Type: application/json" \
  -X PUT "https://www.aipmym.com/api/management/methods" \
  -d '{ ...same payload as POST... }'
```

#### `DELETE /api/management/methods?slug=...`

```bash
curl -s -b /tmp/aipmym.cookies \
  -X DELETE "https://www.aipmym.com/api/management/methods?slug=agent-runtime-playbook"
```

---

## 5) Compatibility APIs (Existing Paths)

Portfolio-compatible:

- `GET /api/public/projects`
- `GET /api/public/projects?slug=...`
- `GET/POST/PUT/DELETE /api/management/projects`

Methodology-compatible:

- `GET /api/public/articles`
- `GET /api/public/articles?slug=...`
- `GET/POST/PUT/DELETE /api/management/articles`

Both path sets point to the same database source.

---

## 6) Recommended Integration Scenarios

- CMS/backoffice UI: use `/api/management/portfolio` and `/api/management/methods`.
- External automation (n8n/Zapier/custom worker): call management APIs with login cookie or server-side proxy.
- Public rendering/SEO pages and Agent tools: use `/api/public/portfolio` and `/api/public/methods` for stable business semantics.
