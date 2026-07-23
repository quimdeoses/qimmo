import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase, supabaseReady } from '../lib/supabase'

type Category = 'Todos' | 'Comprar' | 'Vender' | 'Alquilar' | 'Inversión' | 'Normativa'

export interface Post {
  id?: number
  slug: string
  cat: Exclude<Category, 'Todos'>
  title: string
  excerpt: string
  date: string
  read: string
}

export const POSTS: Post[] = [
  // COMPRAR
  {
    slug: 'gastos-reales-comprar-piso-barcelona',
    cat: 'Comprar',
    title: 'Gastos reales al comprar un piso en Barcelona: lo que nadie te dice',
    excerpt: 'Más allá del precio de venta, comprar una vivienda implica entre un 10% y un 15% adicional en impuestos, notaría y registro. Te desglosamos cada partida para que no te pille por sorpresa.',
    date: '2025-06-10',
    read: '5 min',
  },
  {
    slug: 'itp-vs-iva-impuesto-vivienda-cataluna',
    cat: 'Comprar',
    title: 'ITP vs IVA: qué impuesto pagas al comprar una vivienda en Cataluña',
    excerpt: 'La diferencia entre comprar una vivienda de obra nueva o de segunda mano determina qué impuesto pagas. En Cataluña, el ITP es del 10% para vivienda usada. Te lo explicamos con ejemplos reales.',
    date: '2025-06-03',
    read: '4 min',
  },
  {
    slug: 'nota-simple-antes-de-comprar',
    cat: 'Comprar',
    title: 'Qué es la nota simple y por qué es imprescindible antes de comprar',
    excerpt: 'La nota simple del Registro de la Propiedad es el documento que te dice si el inmueble tiene cargas, hipotecas o limitaciones. Cuesta 9€ y puede ahorrarte un disgusto enorme.',
    date: '2025-05-27',
    read: '3 min',
  },
  {
    slug: 'arras-checklist-antes-de-firmar',
    cat: 'Comprar',
    title: 'Qué revisar antes de firmar las arras: checklist completo',
    excerpt: 'Las arras son un precontrato que te compromete. Si te echas atrás, pierdes el dinero. Si el vendedor se echa atrás, te devuelve el doble. Antes de firmar, revisa estas 12 cosas.',
    date: '2025-05-20',
    read: '6 min',
  },
  {
    slug: 'cedula-habitabilidad-cataluna',
    cat: 'Comprar',
    title: 'Cédula de habitabilidad en Cataluña: qué es y cuándo es obligatoria',
    excerpt: 'La cédula acredita que una vivienda cumple las condiciones mínimas de habitabilidad. En Cataluña es obligatoria para cualquier compraventa o contrato de alquiler. Aprende cómo obtenerla.',
    date: '2025-05-13',
    read: '4 min',
  },
  {
    slug: 'calcular-cuanto-pagar-vivienda',
    cat: 'Comprar',
    title: 'Cómo calcular cuánto puedes pagar por una vivienda',
    excerpt: 'La regla del 30% dice que la cuota hipotecaria no debería superar el 30% de tus ingresos netos. Pero hay más variables en juego: ahorros disponibles, gastos fijos, empleo y perfil bancario.',
    date: '2025-05-06',
    read: '5 min',
  },
  {
    slug: 'proceso-compraventa-espana',
    cat: 'Comprar',
    title: 'El proceso de compraventa en España, paso a paso',
    excerpt: 'Desde la primera visita hasta la firma en notaría: ¿qué pasa en cada etapa, cuánto dura y quién paga qué? Una guía práctica para compradores en 2025.',
    date: '2025-04-29',
    read: '7 min',
  },
  {
    slug: 'periodo-reflexion-notario',
    cat: 'Comprar',
    title: 'Qué es el período de reflexión del notario y cómo te protege',
    excerpt: 'Desde 2019, el banco debe enviarte la documentación hipotecaria al menos 10 días antes de la firma. Este período es tu tiempo para revisar, preguntar y cambiar de opinión sin penalización.',
    date: '2025-04-22',
    read: '3 min',
  },
  {
    slug: 'primera-vivienda-ventajas-fiscales',
    cat: 'Comprar',
    title: 'Primera vivienda habitual: ventajas fiscales que debes conocer',
    excerpt: 'Comprar tu primera vivienda habitual puede implicar bonificaciones en el ITP, acceso a hipotecas con aval ICO y deducciones autonómicas. Te contamos cuáles aplican en Cataluña.',
    date: '2025-04-15',
    read: '5 min',
  },
  {
    slug: 'off-market-comprar-antes-mercado',
    cat: 'Comprar',
    title: 'Off-market: cómo comprar antes de que salga al mercado',
    excerpt: 'Muchas de las mejores oportunidades inmobiliarias nunca llegan a Idealista. Se cierran entre compradores con acceso a carteras privadas. Así funciona el mercado off-market en Barcelona.',
    date: '2025-04-08',
    read: '4 min',
  },
  // VENDER
  {
    slug: 'mejor-momento-vender-piso-barcelona',
    cat: 'Vender',
    title: 'Cuándo es el mejor momento para vender tu piso en Barcelona',
    excerpt: 'La primavera y el inicio del otoño concentran la mayor actividad compradora. Pero la estacionalidad es solo una variable. El precio, la zona y el perfil del inmueble pesan más.',
    date: '2025-06-17',
    read: '4 min',
  },
  {
    slug: 'precio-venta-correcto',
    cat: 'Vender',
    title: 'Cómo fijar el precio de venta correcto (sin quedarte corto ni largo)',
    excerpt: 'Poner el precio alto para "tener margen de negociación" es el error más caro que comete un vendedor. Cuándo bajar precio, cuándo mantenerlo y cómo saber que estás en el punto justo.',
    date: '2025-05-27',
    read: '5 min',
  },
  {
    slug: 'plusvalia-municipal-vender',
    cat: 'Vender',
    title: 'Plusvalía municipal al vender: quién la paga y cómo calcularla',
    excerpt: 'La plusvalía municipal grava el incremento del valor del suelo urbano. La paga el vendedor. Desde 2021 hay dos métodos de cálculo y puedes elegir el que más te convenga.',
    date: '2025-05-13',
    read: '4 min',
  },
  {
    slug: 'documentos-vender-vivienda-2025',
    cat: 'Vender',
    title: 'Documentos necesarios para vender tu vivienda en 2025',
    excerpt: 'Nota simple, cédula de habitabilidad, certificado energético, IBI al día, certificado de la comunidad... Te damos la lista completa para tenerlo todo listo antes de empezar.',
    date: '2025-04-29',
    read: '3 min',
  },
  {
    slug: 'home-staging-venta-inmueble',
    cat: 'Vender',
    title: 'Home staging: qué es y cuánto acelera la venta de un inmueble',
    excerpt: 'Un inmueble bien presentado se vende hasta un 30% más rápido y por un precio superior. El home staging no es decorar — es neutralizar y destacar lo que más valora el comprador.',
    date: '2025-04-15',
    read: '4 min',
  },
  // ALQUILAR
  {
    slug: 'nueva-ley-vivienda-2023-propietarios',
    cat: 'Alquilar',
    title: 'Nueva Ley de Vivienda 2023: lo que debes saber si eres propietario',
    excerpt: 'La ley 12/2023 introdujo cambios importantes: zonas tensionadas, topes de renta, prórroga extraordinaria y limitaciones de actualización. Un resumen claro de lo que afecta a los propietarios.',
    date: '2025-06-24',
    read: '6 min',
  },
  {
    slug: 'indice-contencion-precios-barcelona',
    cat: 'Alquilar',
    title: 'Índice de contención de precios en Barcelona: cómo te afecta',
    excerpt: 'Barcelona es zona tensionada. Eso significa que si alquilas un piso que ya estaba alquilado, no puedes subir el precio respecto al contrato anterior. Te explicamos las excepciones.',
    date: '2025-06-10',
    read: '5 min',
  },
  {
    slug: 'seguro-impago-alquiler-vale-pena',
    cat: 'Alquilar',
    title: 'Seguro de impago de alquiler: ¿vale la pena contratarlo?',
    excerpt: 'Un seguro de impago cuesta entre el 3% y el 5% de la renta anual. Si el inquilino deja de pagar, el seguro cubre entre 6 y 18 meses. Hacemos los números para ver si compensa.',
    date: '2025-05-27',
    read: '4 min',
  },
  {
    slug: 'clausulas-contrato-arrendamiento',
    cat: 'Alquilar',
    title: 'Cláusulas esenciales en todo contrato de arrendamiento',
    excerpt: 'El contrato tipo de la LAU protege al inquilino. Para protegerte como propietario, necesitas incluir cláusulas específicas sobre mascotas, subarrendamiento, desperfectos y resolución anticipada.',
    date: '2025-05-13',
    read: '5 min',
  },
  {
    slug: 'fianza-alquiler-cataluna-incasol',
    cat: 'Alquilar',
    title: 'Cómo gestionar la fianza de alquiler en Cataluña (INCASÒL)',
    excerpt: 'En Cataluña, el propietario está obligado a depositar la fianza en el INCASÒL en los 30 días siguientes a la firma del contrato. Así funciona el trámite y las consecuencias de no hacerlo.',
    date: '2025-04-29',
    read: '3 min',
  },
  // INVERSIÓN
  {
    slug: 'rentabilidad-bruta-vs-neta-inmobiliaria',
    cat: 'Inversión',
    title: 'Rentabilidad bruta vs neta en inversión inmobiliaria: cuál importa',
    excerpt: 'La rentabilidad bruta es fácil de calcular pero engañosa. La neta descuenta gastos reales: IBI, comunidad, seguro, vacancia, gestión y reformas. Así se analiza una inversión real.',
    date: '2025-06-17',
    read: '5 min',
  },
  {
    slug: 'invertir-locales-comerciales-barcelona',
    cat: 'Inversión',
    title: 'Invertir en locales comerciales en Barcelona: oportunidades y riesgos',
    excerpt: 'Los locales comerciales ofrecen rentabilidades brutas del 5% al 8%, superiores a la vivienda. Pero el riesgo de vacancia y los cambios de uso son factores que hay que entender antes de comprar.',
    date: '2025-06-03',
    read: '5 min',
  },
  {
    slug: 'cap-rate-evaluar-activo-inmobiliario',
    cat: 'Inversión',
    title: 'Qué es el cap rate y cómo usarlo para evaluar un activo inmobiliario',
    excerpt: 'El cap rate (tasa de capitalización) es el indicador más usado por inversores profesionales. Te explicamos cómo calcularlo, qué valores son aceptables en Barcelona y cuándo no sirve de nada.',
    date: '2025-05-20',
    read: '4 min',
  },
  {
    slug: 'declarar-ingresos-alquiler-irpf',
    cat: 'Inversión',
    title: 'Cómo declarar los ingresos por alquiler en el IRPF',
    excerpt: 'Los rendimientos del capital inmobiliario tributan como renta. Pero puedes deducir gastos de mantenimiento, intereses hipotecarios, seguros, amortización y más. Guía completa para 2025.',
    date: '2025-05-06',
    read: '6 min',
  },
  {
    slug: 'inversion-inmobiliaria-vs-bolsa-2025',
    cat: 'Inversión',
    title: 'Inversión inmobiliaria vs bolsa: comparativa honesta para 2025',
    excerpt: 'El inmueble da estabilidad y apalancamiento. La bolsa da liquidez y diversificación. No son sustitutos — son activos complementarios. Analizamos los datos reales de los últimos 10 años.',
    date: '2025-04-22',
    read: '5 min',
  },
  // NORMATIVA
  {
    slug: 'certificado-energetico-obligatorio',
    cat: 'Normativa',
    title: 'Certificado energético: obligatorio para vender o alquilar desde 2013',
    excerpt: 'Sin certificado energético no puedes publicar legalmente tu inmueble ni en portales ni en una agencia. Cuesta entre 100€ y 300€ y tiene validez de 10 años. Lo que necesitas saber.',
    date: '2025-07-01',
    read: '3 min',
  },
  {
    slug: 'pisos-turisticos-barcelona-normativa-2025',
    cat: 'Normativa',
    title: 'Normativa sobre pisos turísticos en Barcelona: estado actual 2025',
    excerpt: 'Barcelona lleva años restringiendo las licencias de alquiler turístico (HUT). En 2024 se anunció que no se renovarán más de 10.000 licencias. Qué puedes y no puedes hacer hoy.',
    date: '2025-06-24',
    read: '5 min',
  },
  {
    slug: 'derecho-tanteo-retracto',
    cat: 'Normativa',
    title: 'Derecho de tanteo y retracto: qué es y cuándo puede afectarte',
    excerpt: 'Si vendes tu piso en Cataluña y tiene inquilino, este puede tener derecho preferente de compra. El tanteo es previo a la venta; el retracto, posterior. Te explicamos cuándo aplica cada uno.',
    date: '2025-06-10',
    read: '4 min',
  },
  {
    slug: 'obras-comunidad-propietarios',
    cat: 'Normativa',
    title: 'Obras en comunidad de propietarios: quién paga qué',
    excerpt: 'La Ley de Propiedad Horizontal regula cómo se reparten los gastos de obras en elementos comunes. Hay diferencia entre obras ordinarias, extraordinarias y las que afectan a elementos privativos.',
    date: '2025-05-27',
    read: '4 min',
  },
  {
    slug: 'herencia-viviendas-cataluna',
    cat: 'Normativa',
    title: 'Herencia de viviendas en Cataluña: impuestos y trámites',
    excerpt: 'El impuesto de sucesiones en Cataluña puede ser muy elevado para herederos que no son cónyuge o hijos directos. Te explicamos las bonificaciones existentes, los plazos y el proceso completo.',
    date: '2025-05-13',
    read: '6 min',
  },
]

const CATEGORIES: Category[] = ['Todos', 'Comprar', 'Vender', 'Alquilar', 'Inversión', 'Normativa']

export const CAT_COLORS: Record<Exclude<Category, 'Todos'>, string> = {
  Comprar:   '#1D4ED8',
  Vender:    '#059669',
  Alquilar:  '#7C3AED',
  Inversión: '#C49A3C',
  Normativa: '#DC2626',
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos')
  const [posts, setPosts] = useState<Post[]>(POSTS)

  useEffect(() => {
    if (!supabaseReady) return
    supabase.from('blog_posts')
      .select('id,slug,titulo,categoria,extracto,fecha,tiempo_lectura,publicado')
      .eq('publicado', true)
      .order('fecha', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPosts(data.map(d => ({
            id: d.id,
            slug: d.slug,
            cat: d.categoria as Post['cat'],
            title: d.titulo,
            excerpt: d.extracto,
            date: d.fecha,
            read: d.tiempo_lectura,
          })))
        }
      })
  }, [])

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.cat === activeCategory)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-32 pb-20 px-6"
        style={{ background: '#0D1F3C' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="label mb-4" style={{ color: '#C49A3C' }}>Blog Inmobiliario</p>
          <h1 className="h1 text-white mb-6">
            Guías y consejos para<br className="hidden sm:block" /> tomar mejores decisiones
          </h1>
          <p className="font-inter text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
            Artículos prácticos sobre compra, venta, alquiler e inversión inmobiliaria en Barcelona y Cataluña. Sin letra pequeña.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-16 z-40 border-b" style={{ background: '#F7F6F2', borderColor: '#E2E0DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = cat === activeCategory
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-inter font-medium transition-all duration-150 border"
                  style={{
                    background: isActive ? '#0D1F3C' : 'white',
                    color: isActive ? 'white' : '#6B7280',
                    borderColor: isActive ? '#0D1F3C' : '#E2E0DA',
                  }}
                >
                  {cat}
                  {cat !== 'Todos' && (
                    <span
                      className="ml-1.5 text-xs"
                      style={{ opacity: isActive ? 0.7 : 0.5 }}
                    >
                      {posts.filter(p => p.cat === cat).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 px-6" style={{ background: '#F7F6F2' }}>
        <div className="max-w-7xl mx-auto lg:px-4">
          <p className="font-inter text-sm mb-8" style={{ color: '#9CA3AF' }}>
            {filtered.length} {filtered.length === 1 ? 'artículo' : 'artículos'}
            {activeCategory !== 'Todos' && ` en ${activeCategory}`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                to={'/blog/' + post.slug}
                style={{ textDecoration: 'none' }}
              >
                <article
                  className="card flex flex-col hover:-translate-y-1"
                  style={{ padding: '1.75rem', background: 'white', border: '1px solid #E2E0DA', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }}
                >
                  {/* Category badge */}
                  <div className="mb-4">
                    <span
                      className="label inline-block px-3 py-1 rounded-full text-xs font-inter font-semibold"
                      style={{
                        background: `${CAT_COLORS[post.cat]}15`,
                        color: CAT_COLORS[post.cat],
                      }}
                    >
                      {post.cat}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-jakarta font-bold text-base leading-snug mb-3 flex-grow"
                    style={{ color: '#0D1F3C' }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="font-inter text-sm leading-relaxed mb-5"
                    style={{ color: '#6B7280' }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div
                    className="flex items-center justify-between text-xs font-inter pt-4"
                    style={{ borderTop: '1px solid #E2E0DA', color: '#9CA3AF' }}
                  >
                    <span>{formatDate(post.date)}</span>
                    <span style={{ color: '#C49A3C', fontWeight: 600 }}>{post.read} lectura</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: 'white', borderTop: '1px solid #E2E0DA' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="h2 mb-4" style={{ color: '#0D1F3C' }}>
            ¿Tienes una pregunta específica?
          </h2>
          <p className="font-inter mb-8" style={{ color: '#6B7280' }}>
            Nuestro equipo resuelve dudas sobre compra, venta, alquiler e inversión en Barcelona.
            Sin compromiso y sin letra pequeña.
          </p>
          <Link to="/contacto" className="btn-primary">
            Habla con un asesor
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
