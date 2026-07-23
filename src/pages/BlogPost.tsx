import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase, supabaseReady } from '../lib/supabase'
import { POSTS, CAT_COLORS } from './Blog'

interface PostData {
  id?: number
  slug: string
  titulo: string
  categoria: string
  extracto: string
  contenido: string
  fecha: string
  tiempo_lectura: string
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return }

    if (supabaseReady) {
      supabase
        .from('blog_posts')
        .select('id,slug,titulo,categoria,extracto,contenido,fecha,tiempo_lectura')
        .eq('slug', slug)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setPost(data as PostData)
          } else {
            // Fall back to static POSTS array
            const staticPost = POSTS.find(p => p.slug === slug)
            if (staticPost) {
              setPost({
                slug: staticPost.slug,
                titulo: staticPost.title,
                categoria: staticPost.cat,
                extracto: staticPost.excerpt,
                contenido: '',
                fecha: staticPost.date,
                tiempo_lectura: staticPost.read,
              })
            } else {
              setNotFound(true)
            }
          }
          setLoading(false)
        })
    } else {
      // No Supabase — use static fallback
      const staticPost = POSTS.find(p => p.slug === slug)
      if (staticPost) {
        setPost({
          slug: staticPost.slug,
          titulo: staticPost.title,
          categoria: staticPost.cat,
          extracto: staticPost.excerpt,
          contenido: '',
          fecha: staticPost.date,
          tiempo_lectura: staticPost.read,
        })
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F6F2' }}>
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C49A3C', borderTopColor: 'transparent' }} />
        </div>
        <Footer />
      </>
    )
  }

  if (notFound || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#F7F6F2' }}>
          <p className="label mb-4" style={{ color: '#C49A3C' }}>404</p>
          <h1 className="h1 text-navy mb-4">Artículo no encontrado</h1>
          <p className="font-inter mb-8" style={{ color: '#6B7280' }}>
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/blog" className="btn-primary">
            Ver todos los artículos
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const catColor = CAT_COLORS[post.categoria as keyof typeof CAT_COLORS] ?? '#C49A3C'
  const paragraphs = post.contenido
    ? post.contenido.split('\n\n').filter(p => p.trim())
    : [post.extracto]

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6" style={{ background: '#0D1F3C' }}>
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-inter text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: '#94A3B8' }}
          >
            <ArrowLeft size={15} />
            Todos los artículos
          </Link>

          <div className="mb-5">
            <span
              className="inline-block px-3 py-1 rounded-full font-inter text-xs font-semibold"
              style={{ background: `${catColor}25`, color: catColor }}
            >
              {post.categoria}
            </span>
          </div>

          <h1 className="h1 text-white mb-6 leading-tight">
            {post.titulo}
          </h1>

          <div className="flex items-center gap-4 font-inter text-sm" style={{ color: '#64748B' }}>
            <span>{formatDate(post.fecha)}</span>
            <span style={{ color: '#334155' }}>·</span>
            <span style={{ color: '#C49A3C', fontWeight: 600 }}>{post.tiempo_lectura} lectura</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6" style={{ background: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-2xl">
              {/* Lead paragraph */}
              <p className="font-inter text-lg leading-relaxed mb-8 font-medium" style={{ color: '#374151' }}>
                {post.extracto}
              </p>

              {/* Body paragraphs */}
              {post.contenido && paragraphs.map((para, i) => (
                <p key={i} className="font-inter text-base leading-relaxed mb-6" style={{ color: '#4B5563' }}>
                  {para}
                </p>
              ))}

              {/* Back link */}
              <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E2E0DA' }}>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 font-inter text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: '#0D1F3C' }}
                >
                  <ArrowLeft size={15} />
                  Volver al blog
                </Link>
              </div>
            </div>

            {/* Sidebar CTA */}
            <aside className="lg:w-72 shrink-0">
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{ background: '#F7F6F2', border: '1px solid #E2E0DA' }}
              >
                <p className="font-jakarta font-bold text-navy text-lg mb-2">
                  ¿Tienes dudas sobre este tema?
                </p>
                <p className="font-inter text-sm mb-6" style={{ color: '#6B7280' }}>
                  Consúltame directamente, sin compromiso.
                </p>

                <a
                  href="tel:+34600000000"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-inter text-sm font-semibold mb-3 transition-opacity hover:opacity-80"
                  style={{ background: '#0D1F3C', color: 'white' }}
                >
                  Llamar ahora
                </a>

                <Link
                  to="/contacto"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-inter text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: 'white', color: '#0D1F3C', border: '1px solid #E2E0DA' }}
                >
                  Enviar consulta
                </Link>

                <p className="font-inter text-xs mt-4 text-center" style={{ color: '#9CA3AF' }}>
                  Respuesta en menos de 24h
                </p>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
