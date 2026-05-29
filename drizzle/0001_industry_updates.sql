CREATE TABLE IF NOT EXISTS "industry_updates" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title_zh" text NOT NULL,
  "title_en" text NOT NULL,
  "intro_zh" text DEFAULT '' NOT NULL,
  "intro_en" text DEFAULT '' NOT NULL,
  "keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "content_zh" text DEFAULT '' NOT NULL,
  "content_en" text DEFAULT '' NOT NULL,
  "cover_image" text DEFAULT '' NOT NULL,
  "sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "news_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "tech_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "published_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS "industry_updates_slug_unique" ON "industry_updates" USING btree ("slug");
