import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowRight, Users, Target, Zap, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

type Rol = 'todos' | 'direccion' | 'comercial' | 'backoffice' | 'gestores'

const VALORES = [
  { icon: Target,  title: 'Orientados al resultado',  desc: 'Cada operación es nuestra operación. No descansamos hasta que el cliente consigue lo que necesita.' },
  { icon: Zap,     title: 'Tecnología + criterio',    desc: 'Usamos datos y herramientas digitales, pero las decisiones las toman personas con criterio real de mercado.' },
  { icon: Users,   title: 'Equipo diverso y experto', desc: '40 profesionales con experiencia en residencial, comercial, financiero, legal y administración de fincas.' },
  { icon: Heart,   title: 'Relación a largo plazo',   desc: 'No buscamos la operación rápida. Buscamos ser el consultor de referencia de cada cliente durante años.' },
]

const EQUIPO = [
  // DIRECCIÓN
  { nombre: 'Quim Deosés', cargo: 'Director General',    rol: 'direccion', bio: 'Fundador de qimmo. 12+ años en el sector inmobiliario con experiencia en residencial, retail y operaciones de inversión en Barcelona y área metropolitana.',  avatar: 'QD' },
  { nombre: 'Marc Vilà',   cargo: 'Director Comercial',  rol: 'direccion', bio: 'Responsable del equipo comercial y estrategia de captación. Especialista en obra nueva, activos exclusivos y mercado prime de Barcelona.',                    avatar: 'MV' },

  // COMERCIALES
  { nombre: 'Laura Puig',     cargo: 'Consultora Senior',        rol: 'comercial', bio: 'Especialista en pisos y áticos en Eixample, Gràcia y Sarrià. Más de 8 años cerrando operaciones residenciales de alto valor.',                    avatar: 'LP' },
  { nombre: 'Arnau Costa',    cargo: 'Consultor Residencial',    rol: 'comercial', bio: 'Experto en obra nueva y activos en Sant Gervasi, Pedralbes y Les Corts. Licenciado en ADE con especialización en finanzas inmobiliarias.',         avatar: 'AC' },
  { nombre: 'Marta Ferrer',   cargo: 'Consultora Residencial',   rol: 'comercial', bio: 'Enfocada en Poblenou, 22@ y Sant Martí. Conoce el mercado de conversión industrial-residencial como nadie.',                                        avatar: 'MF' },
  { nombre: 'Pau Roca',       cargo: 'Consultor Comercial',      rol: 'comercial', bio: 'Especialista en locales, oficinas y naves. Gestiona la cartera comercial y contacto con inversores institucionales y family offices.',               avatar: 'PR' },
  { nombre: 'Júlia Mas',      cargo: 'Consultora Residencial',   rol: 'comercial', bio: 'Barcelona Vieja, Born y Gótico. Experta en pisos históricos con encanto y operaciones de reforma integral.',                                        avatar: 'JM' },
  { nombre: 'Sergi Blanes',   cargo: 'Consultor de Inversión',   rol: 'comercial', bio: 'Analista de rentabilidad y asesor en operaciones de compra-reforma-venta. Desarrolla modelos financieros para inversores particulares e institucionales.', avatar: 'SB' },
  { nombre: 'Neus Oliveres',  cargo: 'Consultora Senior',        rol: 'comercial', bio: 'Responsable de clientes internacionales y expatriados. Habla catalán, castellano, inglés y francés con soltura.',                                  avatar: 'NO' },
  { nombre: 'Oriol Pons',     cargo: 'Consultor Residencial',    rol: 'comercial', bio: 'L\'Hospitalet, Cornellà y Baix Llobregat. Conocedor del mercado periférico y operaciones de rendimiento en zona metropolitana.',                   avatar: 'OP' },
  { nombre: 'Cristina Soler', cargo: 'Consultora Residencial',   rol: 'comercial', bio: 'Experta en activos de lujo y propiedades exclusivas. Gestiona la cartera de clientes premium y contacto con family offices nacionales.',             avatar: 'CS' },
  { nombre: 'Miquel Torres',  cargo: 'Consultor Off-market',     rol: 'comercial', bio: 'Responsable de la red off-market y acuerdos con gestores de patrimonio, bancos y fondos. Más de 200 operaciones cerradas.',                         avatar: 'MT' },
  { nombre: 'Irene Camps',    cargo: 'Consultora Alquiler',      rol: 'comercial', bio: 'Especialista en lloguer residencial i temporal. Gestiona la relació amb inquilins i propietaris al dia a dia.',                                      avatar: 'IC' },
  { nombre: 'Dani Moreno',    cargo: 'Consultor Alquiler',       rol: 'comercial', bio: 'Experto en alquiler de locales y espacios de oficina. Gestiona contratos de uso distinto de vivienda y negociaciones con operadores comerciales.',   avatar: 'DM' },
  { nombre: 'Alba Gimeno',    cargo: 'Consultora Senior',        rol: 'comercial', bio: 'Zona Alta y Maresme. 10 años de experiencia con clientes de alto poder adquisitivo y propiedades de más de 1 millón de euros.',                    avatar: 'AG' },

  // BACKOFFICE
  { nombre: 'Berta Llopis',   cargo: 'Responsable de Marketing', rol: 'backoffice', bio: 'Dirige la estrategia de contenidos, SEO, campañas digitales y presencia de marca en todos los canales de qimmo.',                               avatar: 'BL' },
  { nombre: 'Toni Valls',     cargo: 'Tecnología & Producto',    rol: 'backoffice', bio: 'Responsable de la plataforma digital, portal del propietario y herramientas de análisis de datos en tiempo real.',                               avatar: 'TV' },
  { nombre: 'Elena Bravo',    cargo: 'Jurídica & Contratos',     rol: 'backoffice', bio: 'Abogada inmobiliaria especializada en contratos de compraventa, arrendamiento, due diligence legal y conflictos entre partes.',                  avatar: 'EB' },
  { nombre: 'Raül Navarro',   cargo: 'Finanzas & Administración', rol: 'backoffice', bio: 'Responsable de la contabilidad interna, control de cobros, facturación y coordinación con asesoría fiscal externa.',                           avatar: 'RN' },
  { nombre: 'Laia Ximenes',   cargo: 'Atención al Cliente',      rol: 'backoffice', bio: 'Primera línea de contacto con clientes y propietarios. Coordina visitas, responde consultas y asegura una experiencia impecable en cada paso.', avatar: 'LX' },
  { nombre: 'Pere Sala',      cargo: 'Fotografía & Staging',     rol: 'backoffice', bio: 'Fotógrafo y home stager profesional. Responsable de que cada propiedad aparezca en su mejor versión en todos los canales de difusión.',         avatar: 'PS' },
  { nombre: 'Montse Gil',     cargo: 'Coordinación Interna',     rol: 'backoffice', bio: 'Coordina el equipo, los plazos y los procesos internos para garantizar que cada operación avanza sin fricciones ni retrasos.',                  avatar: 'MG' },
  { nombre: 'Víctor Saura',   cargo: 'Hipotecas & Financiación', rol: 'backoffice', bio: 'Broker hipotecario independiente. Negocia con más de 20 entidades bancarias para conseguir las mejores condiciones para cada cliente.',         avatar: 'VS' },

  // GESTORES FINCAS
  { nombre: 'Carme Riba',     cargo: 'Gestora de Fincas Senior', rol: 'gestores', bio: 'Administradora de fincas colegiada con 20 años de experiencia. Gestiona comunidades de alta complejidad en Barcelona ciudad.',               avatar: 'CR' },
  { nombre: 'Jaume Esteve',   cargo: 'Gestor de Fincas',         rol: 'gestores', bio: 'Especializado en comunidades de nueva construcción y edificios mixtos residencial-comercial. Experto en ITE y certificados energéticos.',    avatar: 'JE' },
  { nombre: 'Rosa Puigdomènech', cargo: 'Gestora de Fincas',     rol: 'gestores', bio: 'Gestiona fincas en l\'Hospitalet, Cornellà y el Prat. Amplia experiencia en comunidades con conflictos de morosidad y obras urgentes.',       avatar: 'RP' },
  { nombre: 'Ferran Cots',    cargo: 'Gestor de Fincas',         rol: 'gestores', bio: 'Responsable de edificios de propietarios privados y family offices. Gestión patrimonial de carteras de 5 a 50 activos.',                     avatar: 'FC' },
  { nombre: 'Glòria Font',    cargo: 'Coordinadora Mantenimiento', rol: 'gestores', bio: 'Coordina todos los proveedores de mantenimiento, obras y reparaciones urgentes. Red de más de 80 profesionales homologados.',              avatar: 'GF' },
  { nombre: 'Ramon Puig',     cargo: 'Gestor de Fincas',         rol: 'gestores', bio: 'Sarrià, Sant Gervasi y Zona Alta. Especialista en edificios de lujo con servicios de conserje, piscina y jardines comunitarios.',            avatar: 'RP2' },
  { nombre: 'Noemí Casas',    cargo: 'Gestora de Fincas',        rol: 'gestores', bio: 'Barrios de Gràcia, Eixample y Horta-Guinardó. Experta en resolución de conflictos vecinales y negociación de obras comunitarias.',           avatar: 'NC' },
  { nombre: 'Josep Mir',      cargo: 'Gestor de Fincas',         rol: 'gestores', bio: 'Zona Metropolitana Norte: Badalona, Santa Coloma y Sant Adrià. Más de 40 comunidades bajo gestión directa.',                                avatar: 'JMi' },
  { nombre: 'Pilar Farré',    cargo: 'Gestora de Fincas',        rol: 'gestores', bio: 'Especialista en subvenciones de rehabilitación, ITE obligatoria y proyectos de mejora de eficiencia energética en edificios.',               avatar: 'PF' },
  { nombre: 'Xavier Duran',   cargo: 'Responsable de Seguros',   rol: 'gestores', bio: 'Gestor y asesor de seguros comunitarios, de hogar e impago. Negocia con las principales aseguradoras para obtener las mejores coberturas.',  avatar: 'XD' },
  { nombre: 'Mercè Ribas',    cargo: 'Gestora de Fincas',        rol: 'gestores', bio: 'Maresme y Vallès Oriental. Gestiona comunidades de urbanizaciones y residenciales privados con servicios comunes complejos.',                avatar: 'MRi' },
  { nombre: 'Andreu Torra',   cargo: 'Gestor de Fincas Junior',  rol: 'gestores', bio: 'Recién incorporado con formación en Administración de Fincas. Apoya al equipo senior en comunidades de nueva incorporación.',               avatar: 'AT' },
  { nombre: 'Laia Pont',      cargo: 'Gestora de Fincas Junior', rol: 'gestores', bio: 'Administradora junior especializada en digitalización de documentación, gestión de incidencias online y atención al propietario.',          avatar: 'LP2' },
  { nombre: 'Ricard Sala',    cargo: 'Técnico de Mantenimiento', rol: 'gestores', bio: 'Técnico superior en edificación. Realiza inspecciones técnicas, informes de estado y supervisión de obras en edificios gestionados.',        avatar: 'RS' },
  { nombre: 'Dolors Mas',     cargo: 'Gestora de Fincas',        rol: 'gestores', bio: 'Zona Baix Llobregat y Delta del Llobregat. Administradora colegiada con especialización en comunidades industriales y mixtas.',              avatar: 'DMas' },
  { nombre: 'Santi Ballester', cargo: 'Gestor de Fincas',        rol: 'gestores', bio: 'Eixample Esquerra y Sant Antoni. Experto en edificios con locales comerciales en planta baja y conflictos de uso mixto.',                    avatar: 'SBa' },
]

const FILTROS: { key: Rol; label: string; count: number }[] = [
  { key: 'todos',      label: 'Todos',           count: EQUIPO.length },
  { key: 'direccion',  label: 'Dirección',        count: EQUIPO.filter(m => m.rol === 'direccion').length },
  { key: 'comercial',  label: 'Comerciales',      count: EQUIPO.filter(m => m.rol === 'comercial').length },
  { key: 'backoffice', label: 'Backoffice',        count: EQUIPO.filter(m => m.rol === 'backoffice').length },
  { key: 'gestores',   label: 'Gestores',          count: EQUIPO.filter(m => m.rol === 'gestores').length },
]

function getGradient(rol: string) {
  if (rol === 'direccion')  return 'from-gold/30 to-gold/10'
  if (rol === 'comercial')  return 'from-blue-500/20 to-blue-500/5'
  if (rol === 'backoffice') return 'from-purple-500/20 to-purple-500/5'
  return 'from-emerald-500/20 to-emerald-500/5'
}

function getRolColor(rol: string) {
  if (rol === 'direccion')  return 'bg-gold/15 text-gold-dark'
  if (rol === 'comercial')  return 'bg-blue-50 text-blue-700'
  if (rol === 'backoffice') return 'bg-purple-50 text-purple-700'
  return 'bg-emerald-50 text-emerald-700'
}

export default function Equipo() {
  const [filtro, setFiltro] = useState<Rol>('todos')
  const visible = filtro === 'todos' ? EQUIPO : EQUIPO.filter(m => m.rol === filtro)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="h-[64px]" />

      {/* HERO */}
      <section className="pt-20 pb-24 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="label text-white/35 mb-5">El equipo</p>
            <h1 className="font-cormorant font-semibold text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.08 }}>
              40 profesionales,<br />
              <span style={{ color: '#C49A3C' }} className="italic">un solo objetivo.</span>
            </h1>
            <p className="text-white/55 font-inter text-[15px] leading-relaxed max-w-lg">
              En qimmo creemos que la tecnología sin criterio no vale nada. Por eso nuestro equipo combina herramientas digitales de vanguardia con el conocimiento real del mercado que solo dan los años de experiencia sobre el terreno.
            </p>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-3">Nuestra filosofía</p>
            <div className="w-7 h-[2px] mb-5" style={{ background: '#C49A3C' }} />
            <h2 className="h2 leading-tight">Lo que nos<br /><span className="text-gold italic">define</span></h2>
            <p className="text-slate-500 font-inter text-sm leading-relaxed mt-4">
              Somos una inmobiliaria boutique que opera con la mentalidad de una startup: orientada a datos, obsesionada con el cliente y en constante mejora.
            </p>
            <Link to="/contacto" className="btn-primary mt-6 inline-flex">
              Únete al equipo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALORES.map((v, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:border-navy/20 hover:shadow-[0_8px_40px_rgba(26,39,68,0.08)] transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy transition-colors duration-300">
                  <v.icon size={18} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-inter font-bold text-navy text-sm mb-2">{v.title}</h3>
                <p className="text-slate-500 text-xs font-inter leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-24">
        {/* Header + filtros */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="label mb-3">Nuestros profesionales</p>
            <div className="w-7 h-[2px] mb-5" style={{ background: '#C49A3C' }} />
            <h2 className="h2 leading-tight">El equipo<br /><span className="text-gold italic">qimmo</span></h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-inter text-xs font-semibold border transition-all duration-200 ${
                  filtro === f.key
                    ? 'bg-navy text-white border-navy'
                    : 'border-slate-200 text-slate-500 hover:border-navy/30 hover:text-navy'
                }`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  filtro === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((m, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-[0_8px_40px_rgba(26,39,68,0.10)] transition-all duration-300 overflow-hidden flex flex-col gap-4"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-gradient-to-r ${getGradient(m.rol)}`} style={{ background: m.rol === 'direccion' ? 'linear-gradient(90deg, #C8A96E, #DFC08A)' : undefined }} />

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-inter font-bold text-xs bg-gradient-to-br ${getGradient(m.rol)}`}
                  style={{ color: m.rol === 'direccion' ? '#A88A50' : undefined }}>
                  {m.avatar.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-inter font-semibold text-navy text-sm truncate">{m.nombre}</p>
                  <p className="text-slate-400 text-[11px] font-inter truncate">{m.cargo}</p>
                </div>
              </div>

              <p className="text-slate-500 text-xs font-inter leading-relaxed flex-1">{m.bio}</p>

              <span className={`self-start px-2.5 py-1 rounded-lg text-[10px] font-inter font-semibold uppercase tracking-wide ${getRolColor(m.rol)}`}>
                {FILTROS.find(f => f.key === m.rol)?.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0D1F3C' }}>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="label text-white/35 mb-4">¿Te unes?</p>
          <div className="w-7 h-[2px] mx-auto mb-6" style={{ background: '#C49A3C' }} />
          <h2 className="h2 text-white mb-4">Buscamos talento</h2>
          <p className="text-white/50 font-inter text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Si eres profesional inmobiliario, técnico, comercial o quieres hacer una beca en qimmo, escríbenos. Siempre tenemos hueco para la gente buena.
          </p>
          <Link to="/contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-inter font-semibold text-sm transition-all" style={{ background: '#C49A3C', color: '#0D1F3C' }}>
            Escríbenos <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
