-- ── v3: cerrar acceso público a datos del admin ─────────────────────────────
-- Antes: políticas "using (true)" → cualquiera con la anon key (pública en el
-- JS) podía leer leads/visitas y editar/borrar propiedades y posts.
-- Ahora: solo usuarios de Supabase Auth con rol admin/director (is_admin()).
-- La web pública sigue pudiendo leer lo publicado e insertar leads/visitas.

-- Aplicado con ALTER POLICY (DROP POLICY se quedaba bloqueado en producción).
alter policy "Admin puede todo"            on public.propiedades to authenticated using (public.is_admin()) with check (public.is_admin());
alter policy "Admin full blog access"      on public.blog_posts  to authenticated using (public.is_admin()) with check (public.is_admin());
alter policy "Admin puede todo en leads"   on public.leads       to authenticated using (public.is_admin()) with check (public.is_admin());
alter policy "Admin puede todo en visitas" on public.visitas     to authenticated using (public.is_admin()) with check (public.is_admin());

-- Fotos: lectura pública, escritura solo staff
alter policy "Admin puede subir fotos"  on storage.objects to authenticated with check (bucket_id = 'propiedades' and public.is_admin());
alter policy "Admin puede borrar fotos" on storage.objects to authenticated using (bucket_id = 'propiedades' and public.is_admin());

-- Facturas: líneas y dirección del cliente (Plantilla_Factura)
alter table public.invoices add column if not exists client_address text, add column if not exists lines jsonb;
