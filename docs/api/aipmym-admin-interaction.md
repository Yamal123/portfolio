# AI PM 后台管理系统 — 前后端交互规范 V1.0

---

## 1. 接口请求规范

### 1.1 请求头格式

| Header 名 | 值 | 必填 | 说明 |
|-----------|-----|------|------|
| `Content-Type` | `application/json` | 是(POST/PUT/PATCH) | 请求体为 JSON 格式 |
| `Authorization` | `Bearer {token}` | 是(需认证接口) | JWT Token，登录后获取 |
| `Accept` | `application/json` | 是 | 响应期望格式 |
| `X-Request-Id` | UUID 字符串 | 否 | 请求追踪 ID，用于日志关联 |
| `X-CSRF-Token` | CSRF Token 字符串 | 是(写操作) | CSRF 防护 Token |

### 1.2 Token 传递方式

| 场景 | 方式 | 存储位置 | 有效期 |
|------|------|---------|--------|
| API 请求 | Header: `Authorization: Bearer xxx` | localStorage / sessionStorage | Access Token: 2h |
| 刷新 Token | POST `/api/auth/refresh` + RefreshToken Body | Cookie(httpOnly) 或 localStorage | Refresh Token: 7d |

**记住我逻辑映射**：

| 前端行为 | Token 存储 | 有效期 |
|---------|-----------|--------|
| 勾选"记住我" | localStorage | Access 2h + Refresh 7d |
| 未勾选 | sessionStorage | Access 2h，关闭浏览器失效 |

### 1.3 Content-Type 对照表

| 操作类型 | Content-Type | 请求体编码 |
|---------|-------------|----------|
| 普通 CRUD(JSON) | `application/json` | JSON.stringify |
| 文件上传 | `multipart/form-data` | FormData 对象 |
| 文件下载 | `application/octet-stream` | Blob 响应 |
| 备份恢复(SQL) | `multipart/form-data` | FormData 含 .sql 文件 |

### 1.4 超时时间配置

| 接口类型 | 超时时间(ms) | 说明 |
|---------|------------|------|
| 登录接口 | 10000 | 密码校验可能较慢 |
| 普通查询接口 | 8000 | 标准 GET 请求 |
| 写操作接口 | 15000 | 含数据库事务 |
| 文件上传接口 | 60000 | 大文件传输 |
| 文件下载接口 | 30000 | SQL 导出可能较大 |
| 数据备份接口 | 120000 | 全库导出 |

---

## 2. 接口响应规范

### 2.1 统一响应格式

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {},
  "timestamp": 1715740800000
}
```

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `code` | Integer | 是 | 业务状态码（见 2.2 节） |
| `message` | String | 是 | 可读的提示信息 |
| `data` | Object/Array/null | 是 | 业务数据载荷 |
| `timestamp` | Long | 是 | 服务端响应时间戳(毫秒) |

### 2.2 状态码定义

| code | HTTP Status | 含义 | 前端处理动作 |
|------|------------|------|-------------|
| **1000** | 200 | 成功 | 正常展示数据 |
| **1001** | 400 | 参数错误 | 展示字段级错误信息 |
| **1002** | 401 | 未登录/Token 过期 | 清除本地存储，跳转 /login |
| **1003** | 403 | 无权限 | Toast 提示"无权限操作" |
| **1004** | 404 | 资源不存在 | Toast 提示"数据不存在" |
| **1005** | 409 | 数据冲突 | 如 slug 已存在、用户名已注册 |
| **1006** | 429 | 请求过频 | Toast 提示"操作过于频繁" |
| **1010** | 400 | 账号锁定 | Toast 提示锁定剩余时间 |
| **1020** | 500 | 服务器内部错误 | Toast 提示"系统繁忙，请稍后重试" |
| **1021** | 503 | 服务不可用 | 展示维护页面 |

### 2.3 错误信息格式

**单字段错误**：

```json
{
  "code": 1001,
  "message": "参数校验失败",
  "data": null,
  "errors": [
    { "field": "name", "message": "名称不能为空", "code": "REQUIRED" },
    { "field": "email", "message": "邮箱格式不正确", "code": "FORMAT" }
  ]
}
```

**errors 数组中每个对象结构**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `field` | String | 出错的表单字段名（对应前端 form item 的 name） |
| `message` | String | 用户可读的错误描述 |
| `code` | String | 错误类型码：REQUIRED / FORMAT / LENGTH / UNIQUE / RANGE |

**前端映射规则**：`errors[].field` → Ant Design Form 的 `name` 属性 → 自动定位到对应输入框下方显示红色错误文字。

### 2.4 分页响应格式

```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPage": 10
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | Array | 当前页数据数组 |
| `total` | Integer | 总记录数（不受分页影响） |
| `page` | Integer | 当前页码 |
| `pageSize` | Integer | 每页条数 |
| `totalPage` | Integer | 总页数 = ceil(total/pageSize) |

**前端 Ant Design Pagination 映射**：

| 组件属性 | 接口字段 | 类型转换 |
|---------|---------|---------|
| `current` | `page` | 直接使用 |
| `pageSize` | `pageSize` | 直接使用 |
| `total` | `total` | 直接使用 |
| onChange(page, size) | 请求参数 `page` / `pageSize` | 直接传递 |

---

## 3. 数据格式规范

### 3.1 日期时间格式

| 场景 | 格式 | 示例 | 前端处理 |
|------|------|------|---------|
| 接口传输 | ISO 8601 | `2026-05-15T14:30:00+08:00` | dayjs().format() |
| 表单显示 | YYYY-MM-DD HH:mm:ss | `2026-05-15 14:30:00` | dayjs(value).format() |
| 表单编辑 | DatePicker 返回 moment/dayjs 对象 | - | 提交前 format 为 ISO |
| 图表 X 轴 | MM-DD | `05-15` | dayjs(value).format('MM-DD') |
| 趋势图日期范围 | YYYY-MM-DD | `2026-05-09 ~ 2026-05-15` | - |

**统一规则**：前后端全部使用 UTC+8 (Asia/Shanghai) 时区。

### 3.2 图片 URL 格式

| 字段 | URL 格式 | 示例 |
|------|---------|------|
| 头像 avatar | `/uploads/avatar/{timestamp}_{random8}.ext` | `/uploads/avatar/1715740800_a1b2c3d4.png` |
| 封面图 thumbnail | `/uploads/covers/{timestamp}_{random8}.ext` | `/uploads/covers/1715740800_e5f6g7h8.jpg` |
| 二维码 qrcodeImage | `/uploads/qrcode/{timestamp}_{random8}.ext` | `/uploads/qrcode/1715740800_i9j0k1l2.png` |
| favicon | `/uploads/favicon.{ext}` | `/uploads/favicon.svg` |
| 详情内嵌图片 | `/uploads/content/{date}/{random}.{ext}` | `/uploads/content/2026/05/abc123.png` |

**URL 规则**：
- 所有图片路径为相对路径，不以 `/` 开头则拼接 CDN 域名
- 空字符串 `""` 表示未设置，前端显示默认占位图
- 图片不存在时返回 404，前端显示 fallback 占位图

### 3.3 富文本格式

| 字段 | 存储格式 | 编辑器输出 | 前端渲染 |
|------|---------|----------|---------|
| introduction | HTML | `<p>一段<strong>富文本</strong></p>` | dangerouslySetInnerHTML |
| contentZh / contentEn | Markdown | `# 标题\n\n- 列表项` | 自定义 Markdown 渲染器 |

**HTML 白名单标签**：`p, br, strong, b, em, i, u, s, h1-h6, ul, ol, li, a, img, blockquote, pre, code, table, thead, tbody, tr, th, td`

**HTML 白名单属性**：`href, src, alt, title, target(_blank), class, style(color/font-size/text-align)`

**Markdown 渲染规则**（前台展示用）：
- `# H1` → `<h1>` (text-3xl font-bold orange)
- `## H2` → `<h2>` (text-2xl font-bold orange)
- `### H3` → `<h3>` (text-xl font-bold orange)
- `- item` → `<ul><li>`
- `**bold**` → `<strong>`
- 空行 → `<br/>` 或段落分隔

### 3.4 枚举值定义

#### 技能分类 skill_cate.cate_name

| 枚举值 | 内置ID | 图标标识 |
|--------|--------|---------|
| AI 能力 | 1 | brain |
| 产品能力 | 2 | bulb |
| 技术技能 | 3 | code |
| 软技能 | 4 | team |

#### 项目分类 project_cate.cate_name

| 枚举值 | 内置ID |
|--------|--------|
| 个人项目 | 1 |
| 工作项目 | 2 |
| 开源项目 | 3 |
| 学习项目 | 4 |

#### 社交平台 social_link.platform

| 枚举值 | 默认图标 | 默认颜色 |
|--------|---------|---------|
| GitHub | github | #24292e |
| LinkedIn | linkedin | #0077b5 |
| 微博 | weibo | #E6162D |
| Twitter | twitter | #1DA1F2 |
| 知乎 | zhihu | #0084FF |
| 其他 | link | #999 |

#### 操作日志 action_type

| 枚举值 | Tag 颜色 | 说明 |
|--------|---------|------|
| login | purple | 登录系统 |
| create | green | 新增数据 |
| update | blue | 修改数据 |
| delete | red | 删除数据 |
| backup | cyan | 数据备份 |
| restore | magenta | 数据恢复 |
| upload | orange | 上传文件 |

#### 状态值 status / is_enabled / is_displayed

| 值 | 含义 | 前端 Badge 颜色 | Switch 状态 |
|-----|------|---------------|------------|
| 1 | 启用/显示/上架 | green (success) | checked=true |
| 0 | 禁用/隐藏/下架 | default (gray) | checked=false |

---

## 4. 异常处理规范

### 4.1 前端异常分层

| 异常层 | 触发场景 | 处理方式 | 展示组件 |
|--------|---------|---------|---------|
| 表单校验异常 | blur / submit 时字段不合法 | Form setError 到对应 field | Input 下方红字 |
| 接口调用异常 | axios 请求失败(网络/超时/5xx) | 全局拦截器统一捕获 | message.error Toast |
| 渲染异常 | React 组件崩溃 | ErrorBoundary 包裹 | 降级 UI 页面 |
| 路由异常 | 访问不存在的路由 | Not Found 页面 | 404 页面 |
| 权限异常 | 未登录访问需认证路由 | AuthContext 路由守卫 | 重定向到 /login |

### 4.2 后端异常分层

| 异常层 | HTTP Code | 业务 Code | 触发场景 |
|--------|-----------|-----------|---------|
| 参数校验异常 | 400 | 1001 | @Validated 校验不通过 |
| 认证异常 | 401 | 1002 | Token 无效/过期/缺失 |
| 权限异常 | 403 | 1003 | 无该资源操作权限 |
| 资源不存在 | 404 | 1004 | 主键查不到记录 |
| 业务冲突 | 409 | 1005 | 唯一约束违反(slug重复等) |
| 频率限制 | 429 | 1006 | 超出接口调用频率限制 |
| 账号锁定 | 403 | 1010 | 连续输错密码超限 |
| 服务器异常 | 500 | 1020 | 未捕获的 RuntimeException |
| 数据库异常 | 500 | 1020 | SQL 执行失败 / 连接断开 |

### 4.3 接口报错统一处理流程

```
[前端发起请求]
    ↓
[axios 拦截器 - request] → 注入 Token + Headers
    ↓
[HTTP 请求发送] → 超时控制
    ↓
[axios 拦截器 - response]
    ├─ HTTP 2xx → 解析 response.data.code
    │   ├─ code=1000 → resolve(data)
    │   ├─ code=1001 → reject(errors) → Form setFields
    │   ├─ code=1005 → reject(msg) → message.warning
    │   └─ 其他非1000 → reject(msg) → message.error
    ├─ HTTP 401 → 清除 Token → 跳转 /login?redirect=/xxx
    ├─ HTTP 403 → message.error("无权限")
    ├─ HTTP 429 → message.error("操作过于频繁")
    └─ HTTP 5xx → message.error("系统繁忙")
    ↓
[组件 catch] → 最终兜底 message.error("未知错误")
```

### 4.4 数据校验失败处理对照表

| 校验失败类型 | 后端返回 | 前端行为 | 用户感知 |
|-------------|---------|---------|---------|
| 必填字段为空 | errors[{field:"name", msg:"名称不能为空"}] | Form.setFields([{name, errors:[msg]}]) | 输入框下方红字 |
| 格式不正确 | errors[{field:"email", msg:"邮箱格式错误"}] | 同上 | 输入框下方红字 |
| 长度超限 | errors[{field:"title", msg:"标题最长50字"}] | 同上 | 输入框下方红字 + 字数统计标红 |
| 唯一性冲突 | errors[{field:"slug", msg:"标识符已存在"}] | 同上 | 输入框下方红字 |
| 关联数据不存在 | errors[{field:"cateId", msg:"分类不存在"}] | Select 显示校验态 | 下拉框红框 |
| 文件过大 | 单独的 file error 回调 | Upload 显示错误提示 | 文件卡片红色错误文字 |

---

## 5. 图片上传规范

### 5.1 上传路径与命名

| 图片类型 | 存储目录 | 命名规则 | 示例 |
|---------|---------|---------|------|
| 头像 | `/uploads/avatar/` | `{unix_timestamp}_{8位随机字符}.jpg` | `1715740800_a1b2c3d4.jpg` |
| 封面图 | `/uploads/covers/` | 同上 | `1715740801_e5f6g7h8.webp` |
| 二维码 | `/uploads/qrcode/` | 同上 | `1715740802_i9j0k1l2.png` |
| Favicon | `/uploads/` | `favicon.{original_ext}` | `favicon.svg` |
| 富文本内嵌图 | `/uploads/content/{YYYY/MM}/` | `{unix_timestamp}_{8位随机}.{ext}` | `2026/05/1715740803_mnopqrst.png` |

### 5.2 格式与大小限制

| 图片类型 | 允许格式 | 大小上限 | 前端压缩目标 | 分辨率建议 |
|---------|---------|---------|------------|-----------|
| 头像 | jpg/jpeg/png/webp | 2MB | < 1MB | 200×200px (1:1) |
| 封面图 | jpg/jpeg/png/webp | 5MB | < 2MB | 1920×1080px (16:9) |
| 二维码 | jpg/png | 2MB | 不压缩 | 300×300px (1:1) |
| Favicon | svg/png/ico | 100KB | 不压缩 | - |
| 富文本内嵌图 | jpg/png/webp | 2MB | < 1MB | 自适应 |

### 5.3 上传交互流程

```
[用户点击上传区域/选择文件]
    ↓
[前端校验] → 格式白名单 + 大小检查 → 不通过则显示错误提示
    ↓
[前端预览] → FileReader 读取为 DataURL → Image 压缩(如需要) → 显示预览
    ↓
[构造 FormData] → append('file', blob, filename)
    ↓
[调用 POST /api/upload] → Headers: { Authorization, Content-Type: multipart/form-data }
    ↓
[后端接收] → 校验格式/大小 → 生成存储路径 → 写入磁盘/OSS → 返回完整 URL
    ↓
[前端接收] → { code: 1000, data: { url: "/uploads/avatar/xxx.png" } }
    ↓
[填入表单] → 将 url 赋值给对应表单字段(thumbnail/avatar/qrcodeImage 等)
    ↓
[保存时提交] → URL 随表单其他字段一起提交到业务接口
```

### 5.4 预览规则

| 阶段 | 预览方式 | 尺寸 |
|------|---------|------|
| 选择后、上传前 | 本地 FileReader 预览 | 原始尺寸等比缩放至容器 |
| 上传成功后 | 使用返回的 URL 的 `<img>` 标签预览 | 同上 |
| 已有数据回显 | 使用数据库中的 URL | 同上 |
| 上传失败 | 保持上一个有效状态或清空 | - |

---

## 6. 权限校验规范

### 6.1 登录校验

| 校验点 | 位置 | 校验逻辑 | 失败处理 |
|--------|------|---------|---------|
| 路由级 | Next.js Middleware / 前端路由守卫 | 检查 localStorage/sessionStorage 是否有 token | 无 token → 重定向 /login?redirect=当前路径 |
| 布局级 | `(dashboard)/layout.tsx` | 调用 GET /api/auth/me 验证 token 有效性 | 401 → 清除 token → 跳转 /login |
| 接口级 | 后端中间件/JWT Filter | 解析 Authorization Header 中的 Bearer Token | 401 → 返回 { code: 1002 } |

### 6.2 接口鉴权矩阵

| 接口类别 | 是否需要 Token | 需要管理员角色 | 备注 |
|---------|--------------|---------------|------|
| POST /api/auth/login | ❌ | ❌ | 公开接口 |
| POST /api/auth/refresh | ❌ | ❌ | 仅需 RefreshToken |
| GET /api/public/* | ❌ | ❌ | 前台公开接口 |
| GET/POST/PUT/DELETE /api/* | ✅ | ✅ | 全部后台管理接口 |

**V1.0 仅单一超级管理员角色，不做 RBAC 细粒度控制。**

### 6.3 敏感操作二次校验

| 敏感操作 | 校验方式 | 确认文案 | 取消文案 |
|---------|---------|---------|---------|
| 删除技能 | Modal.confirm | "确定删除该技能吗？删除后不可恢复。" | "取消" |
| 删除项目 | Modal.confirm | "确定删除该项目吗？相关数据将被清除。" | "取消" |
| 删除社交链接 | Modal.confirm | "确定删除该社交链接吗？" | "取消" |
| 下架操作 | Popconfirm | "确定下架吗？前台将不再显示。" | "取消" |
| 恢复数据 | Modal.confirm | "⚠️ 此操作将覆盖现有数据，是否继续？建议先备份。" | "取消" |
| 修改密码 | 无二次确认（已有确认密码字段） | - | - |

**实现要求**：所有删除类操作必须经过 Modal.confirm 或 Popconfirm，禁止直接调用 DELETE 接口。

---

## 7. 数据同步规范

### 7.1 后台修改后的前台同步机制

| 修改操作 | 同步方式 | 延迟 | 实现原理 |
|---------|---------|------|---------|
| 个人信息修改 | 前台下次访问时拉取最新 | < 1s | 前台无缓存，每次请求实时查库 |
| 技能上下架 | 前台列表接口实时过滤 | < 1s | WHERE status=1 条件过滤 |
| 项目上下架 | 同上 | < 1s | 同上 |
| 联系方式开关 | 同上 | < 1s | is_displayed 条件过滤 |
| 网站设置修改 | 前台读取配置接口 | < 1s | site_config 表实时读取 |
| 浏览量自增 | Redis INCR + 定时同步 MySQL | 实时 | 前台调 view 接口即生效 |

### 7.2 前端数据更新策略

| 场景 | 更新策略 | 具体实现 |
|------|---------|---------|
| 列表页新增成功 | 列表头部插入新行 + total+1 | `setList([newItem, ...list])` |
| 列表页编辑成功 | 替换列表中对应 id 的项 | `setList(list.map(item => item.id===id ? newData : item))` |
| 列表页删除成功 | 从列表移除该项 + total-1 | `setList(list.filter(item => item.id !== id))` |
| 切换上下架成功 | 更新该项 status 字段 | 同编辑策略 |
| 拖拽排序成功 | 按 sortOrder 重新排序列表 | `setList([...sortedList])` |
| 详情页保存成功 | Toast 成功 + 可选跳转列表 | `message.success()` + `router.push('/xxx')` |
| 表单内联编辑失焦保存 | 该字段立即更新 + Toast | `patchField(id, field, value)` |

### 7.3 缓存策略

| 缓存位置 | 数据 | TTL | 失效策略 |
|---------|------|-----|---------|
| 前台无服务端缓存 | 所有公开数据 | 无 | 实时查库 |
| Redis | 浏览量计数器 | 24h | 每日 02:00 同步 MySQL |
| CDN | 静态资源(图片/CSS/JS) | 1年 | 版本号 hash 破缓存 |
| 浏览器 | API 响应 | 不缓存 | Cache-Control: no-store |

---

## 8. 字段映射规范

### 8.1 个人主页信息 user_profile

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| 站点昵称 | nickname | nickname | VARCHAR(50) | ✅ | 2-50 字符 |
| 个人签名 | signature | signature | VARCHAR(200) | ✅ | 2-200 字符 |
| 简介 | introduction | introduction | TEXT | ✅ | max 5000 字符 |
| 头像 | avatar | avatar | VARCHAR(500) | - | URL 格式 |
| 从业年限 | yearsOfExperience | years_of_experience | TINYINT UNSIGNED | - | 0-50 整数 |
| 项目数量 | projectCount | project_count | SMALLINT UNSIGNED | - | 0-999 整数 |
| 成功率 | successRate | success_rate | DECIMAL(5,1) | - | 0-100, 1位小数 |
| 效率提升 | efficiencyGain | efficiency_gain | DECIMAL(5,1) | - | 0-999, 1位小数 |

### 8.2 社交链接 social_link

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| 平台 | platform | platform | VARCHAR(50) | ✅ | 枚举值之一 |
| 链接 | url | url | VARCHAR(500) | ✅ | 合法 URL(http/https) |
| 图标 | icon | icon | VARCHAR(50) | - | 默认根据 platform 自动填充 |
| 排序 | sortNum | sort_num | INT | - | 整数，默认自增 |
| 是否显示 | isDisplayed | is_displayed | TINYINT UNSIGNED | - | 0/1 |

**批量操作接口**：`PUT /api/profile/social-links`，Body 为 `socialLinks[]` 数组，全量替换。

### 8.3 个人标签 user_tag

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| 标签名称 | tagName | tag_name | VARCHAR(30) | ✅ | 1-20 字符 |
| 背景色 | bgColor | bg_color | VARCHAR(20) | - | hex 色，默认 #fff7e6 |
| 文字色 | textColor | text_color | VARCHAR(20) | - | hex 色，默认 #d46b08 |
| 排序 | sortNum | sort_num | INT | - | 整数 |
| 启用状态 | isEnabled | is_enabled | TINYINT UNSIGNED | - | 0/1 |

**批量操作接口**：`PUT /api/profile/tags`，Body 为 `tags[]` 字符串数组或对象数组。

### 8.4 技能详情 skill_info

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| 技能名称 | name | name | VARCHAR(50) | ✅ | 2-30 字符 |
| 所属分类 | categoryId | cate_id | BIGINT UNSIGNED | ✅ | 必须存在于 skill_cate 表 |
| 熟练度 | level | level | TINYINT UNSIGNED | ✅ | 0-100 整数 |
| 技能描述 | description | description | VARCHAR(200) | - | max 200 字符 |
| 标签 | tags | tags | VARCHAR(200) | - | 逗号分隔字符串 |
| 排序 | sortOrder | sort_num | INT | - | 整数，默认 0 |
| 状态 | status | status | TINYINT UNSIGNED | - | 0/1 |

### 8.5 项目主表 project_info

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| URL 标识 | slug | slug | VARCHAR(50) | ✅ | 小写字母数字连字符，唯一 |
| 中文名称 | nameZh | name_zh | VARCHAR(100) | ✅ | 2-50 字符 |
| 英文名称 | nameEn | name_en | VARCHAR(200) | ✅ | 2-100 字符 |
| 分类 | categoryId | cate_id | BIGINT UNSIGNED | ✅ | 必须存在于 project_cate 表 |
| 封面图 | thumbnail | thumbnail | VARCHAR(500) | - | URL |
| 中文详情 | contentZh | content_zh | TEXT | ✅ | max 10000 字符 |
| 英文详情 | contentEn | content_en | TEXT | ✅ | max 10000 字符 |
| 标签 | tags | tags | VARCHAR(300) | - | 逗号分隔，最多 10 个 |
| 外部链接 | externalUrl | external_url | VARCHAR(500) | - | 合法 URL |
| 排序 | sortOrder | sort_num | INT | - | 整数 |
| 状态 | status | status | TINYINT UNSIGNED | - | 0/1 |

**注意**：`view_count` 和 `deleted_at` 由系统维护，不在表单中暴露。

### 8.6 联系方式 contact_info

| 前端表单字段 | 接口参数名 | 数据库字段 | 类型 | 必填 | 校验规则 |
|------------|-----------|-----------|------|------|---------|
| 邮箱 | email | email | VARCHAR(100) | ✅ | 合法邮箱格式 |
| 邮箱显示 | emailDisplayed | email_displayed | TINYINT UNSIGNED | - | 0/1 |
| 电话 | phone | phone | VARCHAR(20) | ✅ | 11 位手机号 |
| 电话显示 | phoneDisplayed | phone_displayed | TINYINT UNSIGNED | - | 0/1 |
| 微信号 | wechatId | wechat_id | VARCHAR(30) | ✅ | 2-30 字符 |
| 微信二维码 | qrcodeImage | wechat_qrcode | VARCHAR(500) | - | URL |
| 微信显示 | wechatDisplayed | wechat_displayed | TINYINT UNSIGNED | - | 0/1 |

**接口**：`PUT /api/contact`，Body 为单个扁平对象（contact_info 表只有一行记录）。

### 8.7 系统设置 site_config

| 前端表单字段 | 接口参数名 | config_key | 类型 | 必填 |
|------------|-----------|------------|------|------|
| 网站标题 | siteTitle | site_title | TEXT | ✅ |
| SEO 描述 | siteDescription | site_description | TEXT | - |
| 版权信息 | copyright | copyright | TEXT | - |
| 网站 favicon | favicon | favicon | TEXT | - |
| ICP 备案号 | icpCode | icp_code | TEXT | - |
| GA 追踪 ID | gaTrackingId | ga_tracking_id | TEXT | - |

**接口**：`PUT /api/settings/site`，Body 为 `{ [config_key]: config_value }` 键值对对象。
