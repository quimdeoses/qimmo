-- ── v4: finanzas (aplicado en producción) ───────────────────────────────────
-- Gastos importados del Excel «qimmo real estate sl» (pestaña Gastos).
-- El P&L cuenta la base de los gastos con consolidado = true (misma regla que el Excel).
create table if not exists public.gastos (
  id            bigint generated always as identity primary key,
  fecha         date not null,
  clasificacion text not null,
  concepto      text not null,
  base          numeric(12,2),
  iva           numeric(12,2),
  total         numeric(12,2),
  estado        text not null default 'Contabilizado',   -- Contabilizado | Incidencia | Previsto | Pendiente de factura
  consolidado   boolean not null default true,            -- cuenta en el P&L
  recurrente    boolean not null default false,
  periodicidad  text,
  proveedor     text,
  nif_proveedor text,
  num_factura   text,
  drive_ref     text,
  pagado_quim   text,                                     -- columna «a Quim» del Excel
  created_at    timestamptz not null default now()
);
create index if not exists gastos_fecha_idx on public.gastos (fecha);
alter table public.gastos enable row level security;
create policy "Staff gestiona gastos" on public.gastos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Facturas: vertical de negocio (Ventas, Rentals, Administración…)
alter table public.invoices add column if not exists vertical text;
