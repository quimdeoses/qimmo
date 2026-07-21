import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, FileText, Wrench, Users,
  BarChart2, Scale, Bell, Shield, CheckCircle, Clock
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICIOS = [
  {
    icon: BarChart2,
    title: 'Gestión contable',
    desc: 'Contabilidad de la comunidad, presupuestos anuales, liquidaciones y control de cuentas bancarias. Total transparencia.',
  },
  {
    icon: Users,
    title: 'Convocatoria de juntas',
    desc: 'Convocatoria, celebración y actas de juntas ordinarias y extraordinarias. Gestión de acuerdos y seguimiento de ejecución.',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento',
    desc: 'Coordinación de reparaciones, contratos de mantenimiento (ascensor, piscina, jardines) y gestión de proveedores homologados.',
  },
  {
    icon: FileText,
    title: 'Gestión documental',
    desc: 'Archivado de toda la documentación de la comunidad, ITE, cedulas de habitabilidad, contratos y seguros. Acceso digital 24/7.',
  },
  {
    icon: Bell,
    title: 'Atención a propietarios',
    desc: 'Atención directa y personalizada a los propietarios. Resolución de consultas, incidencias y mediación en conflictos vecinales.',
  },
  {
    icon: Scale,
    title: 'Gestión de morosos',
    desc: 'Control de cuotas impagadas, reclamación amistosa y, si es necesario, coordinación con servicios jurídicos especializados.',
  },
  {
    icon: Shield,
    title: 'Seguros comunitarios',
    desc: 'Revisión y optimización del seguro de la comunidad. Gestión de siniestros y tramitación de partes con las aseguradoras.',
  },
  {
    icon: FileText,
    title: 'ITE y certificados',
    desc: 'Gestión de la Inspección Técnica de Edificios, certificado energético y cualquier trámite administrativo ante el Ayuntamiento.',
  },
]

const PROCESO = [
  {
    num: '01',
    title: 'Reunión de presentación',
    desc: 'Nos reunimos con la junta directiva, revisamos el estado actual de la comunidad y detectamos áreas de mejora. Sin coste.',
  },
  {
    num: '02',
    title: 'Propuesta a medida',
    desc: 'Presentamos una propuesta de honorarios personalizada según el tamaño y necesidades de la comunidad. Aprobación en junta.',
  },
  {
    num: '03',
    title: 'Traspaso y onboarding',
    desc: 'Recepción de toda la documentación del administrador anterior, revisión de contratos vigentes y alta de la comunidad en nuestro sistema.',
  },
  {
    num: '04',
    title: 'Gestión continua',
    desc: 'Administración del día a día con reporte mensual, acceso al portal del propietario y reunión semestral de seguimiento.',
  },
]

const INCLUYE = [
  'Portal online para propietarios (24/7)',
  'App móvil para incidencias y consultas',
  'Informes mensuales de actividad',
  'Cuenta bancaria separada por comunidad',
  'Certificados de deuda para transmisiones',
  'Mediación en conflictos vecinales',
  'Gestión de subvenciones para rehabilitación',
  'Asesoramiento legal especializado',
]

export default function AdminFincas() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-96" />
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 right-20 w-px h-72 bg-white" />
          <div className="absolute top-32 right-48 w-48 h-px bg-white" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label text-white/40 mb-4">Administración de Fincas</p>
          <div className="w-10 h-[2px] bg-gold mb-8" />
          <h1 className="h1 text-white max-w-2xl mb-6">
            Tu comunidad,<br />
            <span className="text-gold italic">en buenas manos.</span>
          </h1>
          <p className="text-white/55 font-inter text-lg font-light leading-relaxed max-w-xl mb-10">
            Administración profesional de comunidades de propietarios en Barcelona y Área Metropolitana. Transparencia total, gestión ágil y atención personalizada a cada propietario.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contacto" className="btn-primary bg-gold text-navy hover:bg-gold-light">
              Solicitar presupuesto <ArrowRight size={15} />
            </Link>
            <a href="mailto:info@qimmo.es" className="inline-flex items-center gap-2 text-white/60 font-inter text-sm font-medium hover:text-white transition-colors">
              Consulta gratuita <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              { value: '80+', label: 'Comunidades gestionadas' },
              { value: '24h', label: 'Tiempo de respuesta' },
              { value: '100%', label: 'Transparencia contable' },
              { value: '15+', label: 'Años de experiencia' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm px-6 py-6 text-center">
                <p className="font-cormorant font-semibold text-3xl text-gold mb-1">{s.value}</p>
                <p className="font-inter text-white/40 text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14">
          <p className="label mb-4">Qué incluye</p>
          <div className="navy-accent mx-auto mb-6" />
          <h2 className="h2 max-w-lg mx-auto">Un servicio integral<br />para tu comunidad</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICIOS.map((s, i) => (
            <div key={i} className="group card flex flex-col gap-4 hover:shadow-hover relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="w-11 h-11 rounded-2xl bg-navy/5 flex items-center justify-center group-hover:bg-navy transition-colors duration-300">
                <s.icon size={18} className="text-navy group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-inter font-semibold text-navy text-sm mb-2">{s.title}</h3>
                <p className="text-stone-500 text-xs font-inter leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="bg-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="label text-white/40 mb-4">Cómo empezamos</p>
            <div className="w-10 h-[2px] bg-gold mx-auto mb-6" />
            <h2 className="h2 text-white max-w-lg mx-auto">El proceso de<br /><span className="text-gold italic">cambio de administrador</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESO.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-gold/30 transition-colors">
                <p className="font-cormorant font-semibold text-5xl text-gold/20">{p.num}</p>
                <div>
                  <h3 className="font-inter font-semibold text-white text-sm mb-2">{p.title}</h3>
                  <p className="text-white/50 text-xs font-inter leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS + EXTRAS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label mb-4">Por qué qimmo</p>
            <div className="w-10 h-[2px] bg-gold mb-8" />
            <h2 className="h2 mb-6">
              Más que un administrador,<br />
              <span className="text-gold italic">tu gestor de confianza</span>
            </h2>
            <p className="text-stone-500 font-inter text-sm leading-relaxed mb-6">
              Somos administradores de fincas colegiados con más de 15 años de experiencia en Barcelona y su área metropolitana. Conocemos la normativa local, los proveedores de calidad y cómo resolver cualquier situación.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Administrador colegiado y con seguro de responsabilidad civil',
                'Portal del propietario con acceso a toda la documentación',
                'Reuniones de junta telemáticas y presenciales',
                'Sin letra pequeña: precio cerrado sin sorpresas',
                'Gestor asignado que conoce tu comunidad',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={14} className="text-gold mt-0.5 shrink-0" />
                  <p className="text-stone-600 text-sm font-inter">{item}</p>
                </div>
              ))}
            </div>
            <Link to="/contacto" className="btn-primary">
              Pedir presupuesto sin compromiso <ArrowRight size={15} />
            </Link>
          </div>

          <div>
            <div className="bg-stone-bg border border-stone-200 rounded-2xl p-6 mb-4">
              <p className="font-inter font-semibold text-navy text-sm mb-4 pb-3 border-b border-stone-200">
                ¿Qué más incluye nuestro servicio?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INCLUYE.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <BadgeCheck size={13} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-stone-600 text-xs font-inter">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-card hover:shadow-hover transition-all">
                <Clock size={18} className="text-gold mx-auto mb-2" />
                <p className="font-cormorant font-semibold text-3xl text-navy">24h</p>
                <p className="text-stone-400 text-[11px] font-inter uppercase tracking-wider mt-1">Respuesta garantizada</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-card hover:shadow-hover transition-all">
                <Shield size={18} className="text-gold mx-auto mb-2" />
                <p className="font-cormorant font-semibold text-3xl text-navy">100%</p>
                <p className="text-stone-400 text-[11px] font-inter uppercase tracking-wider mt-1">Transparencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-bg border-y border-stone-200 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="label mb-4">¿Cambias de administrador?</p>
          <div className="gold-accent mx-auto mb-8" />
          <h2 className="h2 mb-5">Nos encargamos del cambio<br /><span className="text-gold italic">sin que notes nada</span></h2>
          <p className="text-stone-500 font-inter text-sm leading-relaxed mb-8">
            El proceso de cambio de administrador es más sencillo de lo que parece. Nosotros gestionamos todo el traspaso para que la comunidad no note ninguna interrupción en el servicio.
          </p>
          <Link to="/contacto" className="btn-primary">
            Solicitar presupuesto <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
