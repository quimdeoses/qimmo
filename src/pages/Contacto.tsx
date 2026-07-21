
import { Mail, Phone, ExternalLink, Clock, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


export default function Contacto() {


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-20 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy opacity-98" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label text-white/40 mb-4">Contacto</p>
          <div className="w-10 h-[2px] bg-gold mb-8" />
          <h1 className="h1 text-white max-w-2xl mb-6">
            Cuéntame<br />
            <span className="text-gold italic">qué necesitas</span>
          </h1>
          <p className="text-white/50 font-inter text-lg font-light leading-relaxed max-w-lg">
            Sin compromiso. En menos de 24 horas te respondo personalmente para ver cómo puedo ayudarte.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quim card */}
            <div className="card">
              <img
                src="/quim.png"
                alt="Joaquín de Oses"
                className="w-16 h-16 rounded-2xl object-cover mb-4"
              />
              <h3 className="font-inter font-semibold text-navy text-base mb-1">Quim</h3>
              <p className="text-[#6B7280] text-xs font-inter uppercase tracking-wider mb-3">Consultor & Fundador · qimmo</p>
              <p className="text-[#6B7280] text-sm font-inter leading-relaxed">
                Consultor inmobiliario independiente con más de 12 años de experiencia en residencial, retail e inversión en el área de Barcelona.
              </p>
            </div>

            {/* Datos */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-navy" />
                </div>
                <div>
                  <p className="text-[#6B7280] text-xs font-inter uppercase tracking-wider mb-0.5">Email</p>
                  <a href="mailto:info@qimmo.es" className="text-navy text-sm font-inter font-medium hover:text-gold transition-colors">
                    info@qimmo.es
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-navy" />
                </div>
                <div>
                  <p className="text-[#6B7280] text-xs font-inter uppercase tracking-wider mb-0.5">Respuesta</p>
                  <p className="text-navy text-sm font-inter font-medium">Menos de 24 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-navy" />
                </div>
                <div>
                  <p className="text-[#6B7280] text-xs font-inter uppercase tracking-wider mb-0.5">Área de actuación</p>
                  <p className="text-navy text-sm font-inter font-medium">Barcelona & Área Metropolitana</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <ExternalLink size={14} className="text-navy" />
                </div>
                <div>
                  <p className="text-[#6B7280] text-xs font-inter uppercase tracking-wider mb-0.5">LinkedIn</p>
                  <a href="#" className="text-navy text-sm font-inter font-medium hover:text-gold transition-colors">
                    linkedin.com/in/qimmo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contacto directo */}
          <div className="lg:col-span-3 space-y-4">
            <a href="tel:+34609019160" className="card flex items-center gap-5 hover:border-navy/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F0F4FA' }}>
                <Phone size={20} style={{ color: '#0D1F3C' }} />
              </div>
              <div>
                <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Llámame</p>
                <p className="font-jakarta font-bold text-lg" style={{ color: '#0D1F3C' }}>+34 609 019 160</p>
                <p className="font-inter text-xs" style={{ color: '#6B7280' }}>Lunes a viernes, de 9h a 20h</p>
              </div>
            </a>
            <a href="https://wa.me/34609019160" target="_blank" rel="noopener noreferrer"
              className="card flex items-center gap-5 hover:border-green-200 transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F0FDF4' }}>
                <svg viewBox="0 0 24 24" fill="#25D366" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>WhatsApp</p>
                <p className="font-jakarta font-bold text-lg" style={{ color: '#0D1F3C' }}>Escríbeme un mensaje</p>
                <p className="font-inter text-xs" style={{ color: '#6B7280' }}>Respondo en el mismo día</p>
              </div>
            </a>
            <a href="mailto:info@qimmo.es" className="card flex items-center gap-5 hover:border-navy/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F0F4FA' }}>
                <Mail size={20} style={{ color: '#0D1F3C' }} />
              </div>
              <div>
                <p className="font-inter text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Email</p>
                <p className="font-jakarta font-bold text-lg" style={{ color: '#0D1F3C' }}>info@qimmo.es</p>
                <p className="font-inter text-xs" style={{ color: '#6B7280' }}>Respuesta en menos de 24 horas</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
