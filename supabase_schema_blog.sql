-- Blog posts table
create table if not exists public.blog_posts (
  id              bigserial primary key,
  slug            text unique not null,
  titulo          text not null,
  categoria       text not null,
  extracto        text not null,
  contenido       text not null default '',
  fecha           date not null default current_date,
  tiempo_lectura  text not null default '5 min',
  publicado       boolean not null default false,
  created_at      timestamptz default now()
);

-- Row Level Security
alter table public.blog_posts enable row level security;

-- Public can read published posts
create policy "Public read published blog posts"
  on public.blog_posts for select
  using (publicado = true);

-- Admin full access (authenticated or service role)
create policy "Admin full blog access"
  on public.blog_posts
  using (true)
  with check (true);
