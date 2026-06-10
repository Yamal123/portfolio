# Admin Backend One-Version Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one cohesive admin backend iteration that fixes global scrolling, adds the top-right account menu, hardens authentication, adds bulk content actions, and ships simple analytics/session detail pages.

**Architecture:** Keep the Next.js admin app as the user-facing shell and move all admin auth to a persistent database-backed session model. Reuse the existing content repository and analytics data source where possible, and add only the minimal new database state needed for password management, session invalidation, and login throttling.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Drizzle ORM, PostgreSQL/Neon, Radix UI, SWR, Sonner.

---

### Task 1: Admin auth and session hardening

**Files:**
- Modify: `lib/db/schema.ts`
- Create: `drizzle/0002_admin_auth.sql`
- Modify: `lib/auth/index.ts`
- Modify: `lib/auth/middleware.ts`
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/api/auth/logout/route.ts`
- Modify: `app/api/auth/session/route.ts`
- Modify: `contexts/admin/AuthContext.tsx`
- Modify: `app/admin/login/page.tsx`
- Create: `app/api/settings/password/route.ts`

- [ ] **Step 1: Add a persistent `admin_users` table and session version field**
- [ ] **Step 2: Update login to validate hashed password, enforce 24h session expiry, and lock after repeated failures**
- [ ] **Step 3: Add single-active-session invalidation so a new login forces previous sessions to re-authenticate**
- [ ] **Step 4: Add password-change API with old-password check and the 3-of-4 password complexity rule**
- [ ] **Step 5: Update auth context and login page to work with cookie-based auth and the new session endpoint**
- [ ] **Step 6: Verify with `npm run typecheck` and a focused auth smoke test against `/api/auth/login`, `/api/auth/session`, `/api/auth/logout`, and `/api/settings/password`**

### Task 2: Global admin shell, top-right dropdown, and scroll isolation

**Files:**
- Modify: `components/admin/AdminLayout.tsx`
- Modify: `components/admin/Header.tsx`
- Modify: `components/admin/Sidebar.tsx`
- Modify: `app/globals.css`
- Create: `app/admin/settings/page.tsx`
- Modify: `components/ui/dropdown-menu.tsx` usage only; no library rewrite
- Create: `components/admin/HelpDialog.tsx` or `components/admin/HelpSheet.tsx`

- [ ] **Step 1: Make the admin shell own the viewport and split scroll responsibility across sidebar, list, and editor panes**
- [ ] **Step 2: Replace the current username/logout header with a dropdown menu containing personal site, change password, help, and logout**
- [ ] **Step 3: Wire personal-site action to open the homepage in a new tab**
- [ ] **Step 4: Add the help entry as a lightweight in-app panel that explains the admin areas**
- [ ] **Step 5: Add `/admin/settings` as the place for password change and future system settings**
- [ ] **Step 6: Verify the shell visually in the browser and confirm each pane scrolls independently without moving the full window**

### Task 3: Content list bulk actions

**Files:**
- Modify: `components/admin/ContentWorkbench.tsx`
- Modify: `app/admin/articles/page.tsx`
- Modify: `app/admin/portfolio/page.tsx`
- Modify: `app/admin/industry/page.tsx`
- Modify: `app/api/management/articles/route.ts`
- Modify: `app/api/management/projects/route.ts`
- Modify: `app/api/management/industry-updates/route.ts`
- Create: `app/api/management/articles/bulk/route.ts`
- Create: `app/api/management/projects/bulk/route.ts`
- Create: `app/api/management/industry-updates/bulk/route.ts`

- [ ] **Step 1: Add selection mode and row checkboxes to the content workbench**
- [ ] **Step 2: Add a bulk action bar with delete, publish, and unpublish actions**
- [ ] **Step 3: Implement bulk routes that accept a list of slugs/IDs and perform one operation consistently**
- [ ] **Step 4: Keep single-item actions working exactly as they do now**
- [ ] **Step 5: Verify that bulk actions update the list state, show success/error toast feedback, and clear the selection after completion**

### Task 4: Analytics, operation logs, and session detail pages

**Files:**
- Create: `app/admin/analytics/page.tsx`
- Create: `app/admin/logs/page.tsx`
- Modify: `lib/admin/constants.ts`
- Modify: `app/api/analytics/overview/route.ts`
- Modify: `app/api/analytics/trend/route.ts`
- Create: `app/api/analytics/category-distribution/route.ts`
- Modify: `app/api/logs/route.ts` or create `app/api/logs/[id]/route.ts` if detail expansion needs it
- Modify: `server/routes/analytics.js`
- Modify: `server/routes/logs.js`
- Modify: `server/services/index.js`

- [ ] **Step 1: Remove random analytics data and make the Next.js analytics routes return real values from the live data source**
- [ ] **Step 2: Build a simple analytics dashboard with overview cards, trend chart, and top-project list**
- [ ] **Step 3: Build a session-detail / operation-log page using `visitStats` and `adminLogs` as the first version of the “会话明细” view**
- [ ] **Step 4: Add the new pages to the admin menu and keep route names consistent**
- [ ] **Step 5: Verify the report pages load data, handle empty states, and do not depend on mock randomness**

### Task 5: Final validation and local preview handoff

**Files:**
- Modify: any files changed above

- [ ] **Step 1: Run `npm run typecheck`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Run targeted smoke checks for login, logout, password change, bulk actions, analytics, and logs**
- [ ] **Step 4: Open the app locally and confirm the final UI behaves correctly in a browser**
- [ ] **Step 5: If anything fails, do one repair pass and rerun the same checks; stop after the second round**

## Self-Review Checklist

- [ ] Every requirement from the current admin-bug list is mapped to at least one task.
- [ ] No task depends on a non-existent helper or file path.
- [ ] Auth changes are consistent across cookie handling, login/logout/session routes, and the admin context.
- [ ] Analytics pages use real data and do not rely on random placeholders.
- [ ] Bulk actions have both UI selection and backend support.
- [ ] The plan is scoped to a single shippable version, not a multi-release rewrite.
