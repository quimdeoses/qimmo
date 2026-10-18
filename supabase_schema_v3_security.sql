-- ── v3: cerrar acceso público a datos del admin ─────────────────────────────
-- Antes: políticas "using (true)" → cualquiera con la anon key (pública en el
-- JS) podía leer leads/visitas y editar/borrar propiedades y posts.
-- Ahora: solo usuarios de Supabase Auth con rol admin/director (is_admin()).
-- La web pública sigue pudiendo leer lo publicado e insertar leads/visitas.

drop policy if exists "Admin puede todo"            on public.propiedades;
drop policy if exists "Admin full blog access"      on public.blog_posts;
drop policy if exists "Admin puede todo en leads"   on public.leads;
drop policy if exists "Admin puede todo en visitas" on public.visitas;

create policy "Staff gestiona propiedades" on public.propiedades for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Staff gestiona blog" on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Staff gestiona leads" on public.leads for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Staff gestiona visitas" on public.visitas for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Fotos: lectura pública, escritura solo staff
drop policy if exists "Admin puede subir fotos"  on storage.objects;
drop policy if exists "Admin puede borrar fotos" on storage.objects;
create policy "Staff sube fotos propiedades" on storage.objects for insert to authenticated
  with check (bucket_id = 'propiedades' and public.is_admin());
create policy "Staff actualiza fotos propiedades" on storage.objects for update to authenticated
  using (bucket_id = 'propiedades' and public.is_admin());
create policy "Staff borra fotos propiedades" on storage.objects for delete to authenticated
  using (bucket_id = 'propiedades' and public.is_admin());

-- Facturas: líneas y dirección del cliente (Plantilla_Factura)
alter table public.invoices add column if not exists client_address text, add column if not exists lines jsonb;
