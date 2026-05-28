CREATE TABLE IF NOT EXISTS "profiles" (
  "id" serial PRIMARY KEY,
  "nickname" text NOT NULL,
  "avatar" text NOT NULL DEFAULT '',
  "title_zh" text NOT NULL DEFAULT '',
  "title_en" text NOT NULL DEFAULT '',
  "bio_zh" text NOT NULL DEFAULT '',
  "bio_en" text NOT NULL DEFAULT '',
  "years_of_experience" integer NOT NULL DEFAULT 0,
  "success_rate" integer NOT NULL DEFAULT 0,
  "efficiency_gain" integer NOT NULL DEFAULT 0,
  "email" text NOT NULL DEFAULT '',
  "phone" text NOT NULL DEFAULT '',
  "wechat_id" text NOT NULL DEFAULT '',
  "wechat_qrcode" text NOT NULL DEFAULT '',
  "linkedin" text NOT NULL DEFAULT '',
  "github" text NOT NULL DEFAULT '',
  "zhihu" text NOT NULL DEFAULT '',
  "email_displayed" boolean NOT NULL DEFAULT true,
  "phone_displayed" boolean NOT NULL DEFAULT false,
  "wechat_displayed" boolean NOT NULL DEFAULT false,
  "experiences" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "skills" (
  "id" serial PRIMARY KEY, "name_zh" text NOT NULL, "name_en" text NOT NULL,
  "level" integer NOT NULL DEFAULT 0, "category" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0, "enabled" boolean NOT NULL DEFAULT true,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY, "slug" text NOT NULL UNIQUE, "name_zh" text NOT NULL, "name_en" text NOT NULL,
  "thumbnail" text NOT NULL DEFAULT '', "type_zh" text NOT NULL DEFAULT '', "type_en" text NOT NULL DEFAULT '',
  "intro_zh" text NOT NULL DEFAULT '', "intro_en" text NOT NULL DEFAULT '', "keywords" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "tags" jsonb NOT NULL DEFAULT '[]'::jsonb, "emoji" text NOT NULL DEFAULT '', "problem_zh" text NOT NULL DEFAULT '',
  "problem_en" text NOT NULL DEFAULT '', "action_zh" text NOT NULL DEFAULT '', "action_en" text NOT NULL DEFAULT '',
  "result_zh" text NOT NULL DEFAULT '', "result_en" text NOT NULL DEFAULT '', "content_zh" text NOT NULL DEFAULT '',
  "content_en" text NOT NULL DEFAULT '', "external_url" text NOT NULL DEFAULT '', "published" boolean NOT NULL DEFAULT true,
  "sort_order" integer NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz
);
CREATE TABLE IF NOT EXISTS "articles" (
  "id" serial PRIMARY KEY, "slug" text NOT NULL UNIQUE, "title_zh" text NOT NULL, "title_en" text NOT NULL,
  "intro_zh" text NOT NULL DEFAULT '', "intro_en" text NOT NULL DEFAULT '', "keywords" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "content_zh" text NOT NULL DEFAULT '', "content_en" text NOT NULL DEFAULT '', "published" boolean NOT NULL DEFAULT true,
  "published_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz
);
CREATE TABLE IF NOT EXISTS "agent_configs" (
  "id" serial PRIMARY KEY, "mode" text NOT NULL DEFAULT 'auto', "provider" text NOT NULL DEFAULT 'openai',
  "model" text NOT NULL DEFAULT 'gpt-4o-mini', "base_url" text NOT NULL DEFAULT 'https://api.openai.com/v1',
  "max_tool_rounds" integer NOT NULL DEFAULT 3, "system_prompt" text NOT NULL DEFAULT '',
  "welcome_message" jsonb NOT NULL, "quick_questions" jsonb NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
