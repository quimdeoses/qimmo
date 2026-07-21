import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, CheckCircle, Heart, Calendar, CreditCard, FolderOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FEATURES = [
  { icon: Heart,       key: 0 },
  { icon: Calendar,    key: 1 },
  { icon: CreditCard,  key: 2 },
  { icon: FolderOpen,  key: 3 },
]

export default function AreaClientes() {
  const { t } = useTranslation()
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [tried, setTried]     = useState(false)

  const features: string[] = t('auth.features_client', { returnObjects: true }) as string[]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setTried(true) }, 1200)
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D1726 0%, #1A2744 50%, #1A3060 100%)' }}>
      <div className="dot-grid absolute inset-0 pointer-events-none" />

      {/* Back */}
      <Link to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/40 hover:text-white font-inter text-xs transition-colors duration-200">
        <ArrowLeft size={14} />
        {t('auth.back_home')}
      </Link>

      {/* Logo */}
      <Link to="/" className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <span className="font-inter font-black text-2xl text-white tracking-[-0.04em]">qimmo</span>
      </Link>

      <div className="relative z-10 w-full flex flex-col lg:flex-row-reverse">

        {/* Right — features panel (reversed layout vs propietarios) */}
        <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 py-24 lg:w-5/12 xl:w-1/2">
          <div className="max-w-md ml-auto">
            <p className="label text-white/35 mb-4">{t('auth.clientes_label')}</p>
            <div className="gold-line mb-6" />
            <h1 className="font-cormorant font-semibold text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
              {t('auth.clientes_title')}
            </h1>
            <p className="text-white/50 font-inter text-sm leading-relaxed mb-10">
              {t('auth.clientes_subtitle')}
            </p>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, key }) => (
                <div key={key} className="glass-card flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <p className="font-inter text-white/65 text-sm">{features[key]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left — login form */}
        <div className="flex-1 flex items-center justify-center px-6 py-24 lg:py-0">
          <div className="w-full max-w-[400px]">

            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <p className="label text-white/35 mb-3">{t('auth.clientes_label')}</p>
              <h1 className="font-cormorant font-semibold text-white text-3xl">{t('auth.clientes_title')}</h1>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">

              {tried ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={24} className="text-gold" />
                  </div>
                  <h3 className="font-cormorant font-semibold text-navy text-2xl mb-2">{t('auth.coming_soon')}</h3>
                  <p className="text-slate-500 text-sm font-inter leading-relaxed mb-6">{t('auth.coming_soon_desc')}</p>
                  <Link to="/contacto" className="btn-primary w-full justify-center">
                    {t('auth.contact_us')}
                  </Link>
                  <button onClick={() => setTried(false)} className="mt-3 w-full text-center text-xs font-inter text-slate-400 hover:text-navy transition-colors py-2">
                    ← Volver
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="font-inter font-bold text-navy text-lg mb-1">{t('auth.clientes_label')}</h2>
                    <p className="text-slate-400 text-xs font-inter">{t('auth.no_access')} <Link to="/contacto" className="text-navy underline hover:text-gold transition-colors">{t('auth.contact_us')}</Link></p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="label-field">{t('auth.email')}</label>
                      <input
                        type="email" required className="input" placeholder={t('auth.email_placeholder')}
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="label-field mb-0">{t('auth.password')}</label>
                        <button type="button" className="text-[11px] font-inter text-slate-400 hover:text-navy transition-colors">
                          {t('auth.forgot')}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPwd ? 'text' : 'password'} required className="input pr-10"
                          placeholder={t('auth.password_placeholder')}
                          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                        >
                          {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-gold w-full justify-center py-3.5 mt-2 text-navy disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-navy/30 border-t-navy animate-spin" />
                          Verificando...
                        </span>
                      ) : t('auth.enter')}
                    </button>
                  </form>

                  <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                    <p className="text-xs font-inter text-slate-400">
                      {t('auth.no_access')}{' '}
                      <Link to="/contacto" className="text-navy font-semibold hover:text-gold transition-colors">
                        {t('auth.contact_us')}
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
