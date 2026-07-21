import { useState } from 'react'
import { FileText, Download, ChevronDown, Check } from 'lucide-react'
import { jsPDF } from 'jspdf'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Types ───────────────────────────────────────────────────────────────────

type Operacion = 'venta' | 'alquiler'
type Modalidad = 'exclusiva' | 'sin_exclusiva' | 'agente_unico'
type Duracion  = '1' | '2' | '3' | '6' | 'personalizado'

interface Form {
  // Propietario
  propNombre: string
  propDni: string
  propDomicilio: string
  propEmail: string
  propTelefono: string
  // Inmueble
  inmDireccion: string
  inmReferenciaCatastral: string
  inmTipo: string
  inmDescripcion: string
  // Encargo
  operacion: Operacion
  modalidad: Modalidad
  precio: string
  duracion: Duracion
  duracionPersonalizada: string
  honorarios: string
  lugar: string
  // Permisos
  permPublicar: boolean
  permVisitas: boolean
  permFotos: boolean
  permCartel: boolean
  permNegociar: boolean
  permDocumentacion: boolean
  permComunidad: boolean
}

const INITIAL: Form = {
  propNombre: '', propDni: '', propDomicilio: '', propEmail: '', propTelefono: '',
  inmDireccion: '', inmReferenciaCatastral: '', inmTipo: '', inmDescripcion: '',
  operacion: 'venta', modalidad: 'exclusiva',
  precio: '', duracion: '3', duracionPersonalizada: '', honorarios: '3',
  lugar: 'Barcelona',
  permPublicar: true, permVisitas: true, permFotos: true,
  permCartel: true, permNegociar: true, permDocumentacion: true, permComunidad: false,
}

// ─── PDF Generator ───────────────────────────────────────────────────────────

function generarPDF(f: Form) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, M = 20, CW = W - M * 2
  let y = 0

  const gold  = [196, 154, 60]  as [number,number,number]
  const navy  = [6, 12, 24]     as [number,number,number]
  const gray  = [90, 90, 100]   as [number,number,number]
  const light = [160, 160, 170] as [number,number,number]

  const nl = (n = 5) => { y += n }
  const line = (color = light) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.3)
    doc.line(M, y, W - M, y)
    nl(5)
  }

  // ── Header ──
  doc.setFillColor(...navy)
  doc.rect(0, 0, W, 38, 'F')

  doc.setFillColor(...gold)
  doc.rect(0, 36, W, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('qimmo', M, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(200, 200, 210)
  doc.text('Consultoría Inmobiliaria & Patrimonial · Barcelona', M, 25)
  doc.text('info@qimmo.es · 609 019 160 · qimmo.es', M, 30)

  y = 50

  // ── Título documento ──
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...navy)
  doc.text('NOTA DE ENCARGO DE INTERMEDIACIÓN INMOBILIARIA', M, y)
  nl(6)

  const modalidadLabel: Record<Modalidad, string> = {
    exclusiva: 'CON EXCLUSIVA',
    sin_exclusiva: 'SIN EXCLUSIVA',
    agente_unico: 'AGENTE ÚNICO',
  }
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gold)
  doc.text(`${f.operacion.toUpperCase()} · ${modalidadLabel[f.modalidad]}`, M, y)
  nl(8)
  line(gold as [number,number,number])

  // ── Sección helper ──
  const sectionTitle = (title: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...gold)
    doc.text(title.toUpperCase(), M, y)
    nl(1)
    doc.setDrawColor(...gold)
    doc.setLineWidth(0.5)
    doc.line(M, y, M + doc.getTextWidth(title.toUpperCase()), y)
    nl(5)
  }

  const field = (label: string, value: string, x = M, w = CW) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...gray)
    doc.text(label, x, y)
    nl(4)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...navy)
    const lines = doc.splitTextToSize(value || '—', w)
    doc.text(lines, x, y)
    nl(lines.length * 4.5 + 2)
  }

  const twoFields = (l1: string, v1: string, l2: string, v2: string) => {
    const half = (CW - 8) / 2
    field(l1, v1, M, half)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...gray)
    doc.text(l2, M + half + 8, y - (field as unknown as () => number)())
    // Reposition — draw side by side
    const savedY = y
    y -= 6.5
    field(l2, v2, M + half + 8, half)
    if (y < savedY) y = savedY
  }

  // ─ Datos del Propietario ─
  sectionTitle('1. Datos del Propietario / Titular')

  // Two column layout
  const halfW = (CW - 8) / 2
  const col2 = M + halfW + 8

  const rowStart = () => { return y }
  const colField = (label: string, value: string, x: number, w: number) => {
    const startY = y
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...gray)
    doc.text(label, x, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...navy)
    doc.text(value || '—', x, y + 4.5)
    return startY
  }

  // Row 1: Nombre + DNI/NIE
  let rowY = rowStart()
  colField('Nombre y apellidos', f.propNombre, M, halfW)
  colField('DNI / NIE', f.propDni, col2, halfW)
  y = rowY + 11

  // Row 2: Domicilio
  field('Domicilio del propietario', f.propDomicilio)

  // Row 3: Email + Teléfono
  rowY = rowStart()
  colField('Email', f.propEmail, M, halfW)
  colField('Teléfono', f.propTelefono, col2, halfW)
  y = rowY + 11

  nl(2)
  line()

  // ─ Datos del Inmueble ─
  sectionTitle('2. Identificación del Inmueble')

  field('Dirección completa del inmueble', f.inmDireccion)

  rowY = rowStart()
  colField('Tipo de inmueble', f.inmTipo, M, halfW)
  colField('Referencia catastral', f.inmReferenciaCatastral || '(pendiente)', col2, halfW)
  y = rowY + 11

  if (f.inmDescripcion) {
    field('Descripción breve', f.inmDescripcion)
  }

  nl(2)
  line()

  // ─ Condiciones del Encargo ─
  sectionTitle('3. Condiciones del Encargo')

  const durLabel: Record<Duracion, string> = {
    '1': '1 mes',
    '2': '2 meses',
    '3': '3 meses',
    '6': '6 meses',
    personalizado: f.duracionPersonalizada || 'Según acuerdo',
  }

  const condRows = [
    ['Tipo de operación', f.operacion === 'venta' ? 'VENTA' : 'ALQUILER'],
    ['Modalidad de encargo', modalidadLabel[f.modalidad]],
    [
      f.operacion === 'venta' ? 'Precio de venta' : 'Precio mensual de alquiler',
      f.precio ? `${Number(f.precio).toLocaleString('es-ES')} €` : '(según valoración)',
    ],
    ['Duración del encargo', durLabel[f.duracion]],
    [
      'Honorarios del agente',
      f.operacion === 'venta'
        ? `${f.honorarios}% sobre el precio de venta final (+ IVA)`
        : `${f.honorarios} mensualidad(es) de alquiler (+ IVA)`,
    ],
  ]

  condRows.forEach(([label, value]) => {
    rowY = rowStart()
    colField(label, value, M, halfW)
    y = rowY + 11
  })

  nl(2)
  line()

  // ─ Permisos ─
  sectionTitle('4. Autorización y Permisos')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...navy)

  const intro = `El/la propietario/a, D./Dña. ${f.propNombre || '_______________'}, con DNI/NIE ${f.propDni || '_______________'}, en calidad de titular del inmueble descrito, AUTORIZA expresamente a QIMMO Consultoría Inmobiliaria a:`
  const introLines = doc.splitTextToSize(intro, CW)
  doc.text(introLines, M, y)
  nl(introLines.length * 4.5 + 3)

  const permisos: [boolean, string][] = [
    [f.permPublicar,      'Publicar y difundir anuncios del inmueble en portales inmobiliarios (Idealista, Fotocasa, habitaclia, etc.), redes sociales y otros medios de comunicación.'],
    [f.permVisitas,       'Coordinar y realizar visitas al inmueble con potenciales compradores o arrendatarios, previa comunicación al propietario.'],
    [f.permFotos,         'Realizar reportaje fotográfico, vídeo y/o tour virtual del inmueble para uso comercial.'],
    [f.permCartel,        'Instalar cartel de "SE VENDE" / "SE ALQUILA" visible en el exterior del inmueble.'],
    [f.permNegociar,      'Recibir, evaluar y trasladar ofertas de compraventa o arrendamiento, negociando en el marco del precio autorizado.'],
    [f.permDocumentacion, 'Solicitar y gestionar la documentación necesaria para la operación (cédula de habitabilidad, certificado energético, nota simple registral, etc.).'],
    [f.permComunidad,     'Contactar con la administración de fincas o comunidad de propietarios si fuera necesario para la operación.'],
  ]

  permisos.filter(([enabled]) => enabled).forEach(([, text], i) => {
    const prefix = `${i + 1}.  `
    const lines = doc.splitTextToSize(text, CW - 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...gold)
    doc.text(prefix, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...navy)
    doc.text(lines, M + 6, y)
    nl(lines.length * 4.5 + 2)
  })

  nl(2)
  line()

  // ─ Condiciones generales ─
  sectionTitle('5. Condiciones Generales')

  const condGen = [
    `EXCLUSIVIDAD: ${f.modalidad === 'exclusiva'
      ? 'Durante la vigencia del presente encargo, el propietario se compromete a no encomendar la intermediación a ningún otro agente inmobiliario. En caso de incumplimiento, se devengará el honorario pactado.'
      : f.modalidad === 'agente_unico'
        ? 'El propietario podrá comercializar el inmueble directamente, pero no a través de otros intermediarios. Si la venta se produce directamente por el propietario, no se devengarán honorarios.'
        : 'El propietario podrá encargar la intermediación a otros agentes simultáneamente. Los honorarios solo se devengarán si la operación se produce como resultado directo de la gestión de QIMMO.'
    }`,
    'HONORARIOS: El pago de los honorarios acordados se hará efectivo en el momento de la firma del contrato de compraventa o contrato de arrendamiento resultante de la gestión.',
    'PROTECCIÓN DE DATOS: Los datos personales facilitados serán tratados conforme al RGPD y la LOPDGDD, únicamente para la gestión del encargo.',
    `VIGENCIA: El presente encargo tendrá validez desde la fecha de firma hasta ${durLabel[f.duracion]} después, prorrogable por mutuo acuerdo.`,
    'LEGISLACIÓN APLICABLE: Este contrato se rige por la legislación española vigente en materia de intermediación inmobiliaria.',
  ]

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.8)
  condGen.forEach((text, i) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...gray)
    const titleEnd = text.indexOf(':')
    if (titleEnd > 0) {
      const title = text.slice(0, titleEnd + 1)
      const rest  = text.slice(titleEnd + 1)
      doc.text(title, M, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...navy)
      const restLines = doc.splitTextToSize(rest, CW - doc.getTextWidth(title) - 2)
      // Same line if short, else next line
      if (restLines.length === 1 && doc.getTextWidth(title + rest) < CW) {
        doc.text(rest.trim(), M + doc.getTextWidth(title) + 1, y)
        nl(5)
      } else {
        nl(4.5)
        const lines = doc.splitTextToSize(rest.trim(), CW)
        doc.text(lines, M, y)
        nl(lines.length * 4 + 3)
      }
    } else {
      const lines = doc.splitTextToSize(text, CW)
      doc.text(lines, M, y)
      nl(lines.length * 4 + 3)
    }
    if (i < condGen.length - 1) nl(1)
  })

  nl(4)
  line()

  // ─ Firmas ─
  // Check if we need a new page
  if (y > 240) {
    doc.addPage()
    y = 25
  }

  sectionTitle('6. Firmas')

  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...navy)
  doc.text(`En ${f.lugar}, a ${today}`, M, y)
  nl(14)

  // Firma propietario
  const sigW = (CW - 10) / 2
  doc.setDrawColor(...light)
  doc.setLineWidth(0.4)
  doc.line(M, y, M + sigW, y)
  nl(4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...navy)
  doc.text('EL/LA PROPIETARIO/A', M, y)
  nl(4)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...gray)
  doc.text(f.propNombre || '___________________', M, y)
  nl(4)
  doc.text(`DNI/NIE: ${f.propDni || '___________________'}`, M, y)

  // Firma agente
  const agX = M + sigW + 10
  const agY = y - 20
  doc.setDrawColor(...light)
  doc.line(agX, agY, agX + sigW, agY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...navy)
  doc.text('EL AGENTE INMOBILIARIO', agX, agY + 4)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...gray)
  doc.text('Joaquim (Quim) — QIMMO', agX, agY + 8)
  doc.text('info@qimmo.es · 609 019 160', agX, agY + 12)

  // ── Footer de página ──
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...light)
    doc.text(`qimmo.es · Consultoría Inmobiliaria & Patrimonial · Barcelona`, M, 292)
    doc.text(`Página ${p} de ${pageCount}`, W - M, 292, { align: 'right' })
  }

  const nombreArchivo = `Nota_Encargo_Qimmo_${f.propNombre.split(' ')[0] || 'Propietario'}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(nombreArchivo)
}

// ─── Component ───────────────────────────────────────────────────────────────

const TIPOS_INMUEBLE = ['Piso', 'Àtic / Àtico', 'Dúplex', 'Casa / Chalet', 'Local comercial', 'Oficina', 'Nave industrial', 'Parking / Garaje', 'Solar / Terreno', 'Otro']

export default function Documentacion() {
  const [form, setForm] = useState<Form>(INITIAL)
  const [generado, setGenerado] = useState(false)
  const [openSection, setOpenSection] = useState<number | null>(0)

  const set = <K extends keyof Form>(key: K, val: Form[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleGenerar = () => {
    generarPDF(form)
    setGenerado(true)
    setTimeout(() => setGenerado(false), 3000)
  }

  const Section = ({ idx, title, children }: { idx: number; title: string; children: React.ReactNode }) => (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpenSection(openSection === idx ? null : idx)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-jakarta font-semibold text-white text-sm">{idx + 1}. {title}</span>
        <ChevronDown
          size={16}
          className="text-white/40 transition-transform duration-200"
          style={{ transform: openSection === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {openSection === idx && (
        <div className="px-6 pb-6 border-t border-white/08 pt-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  )

  const Field = ({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-[11px] font-inter font-semibold uppercase tracking-wider text-white/40 mb-1.5">
        {label}{req && <span className="text-amber-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  const inp = "w-full px-4 py-3 bg-white/05 border border-white/10 rounded-xl font-inter text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:bg-white/07 transition-all"

  const ToggleBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-xs font-inter font-semibold transition-all duration-200 border ${
        active
          ? 'text-white border-amber-500/60'
          : 'text-white/40 border-white/10 hover:border-white/25 hover:text-white/70'
      }`}
      style={active ? { background: 'linear-gradient(135deg, #C49A3C, #A07B28)' } : {}}
    >
      {children}
    </button>
  )

  const PermRow = ({ key: k, label }: { key: keyof Form; label: string }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        onClick={() => set(k, !form[k] as Form[typeof k])}
        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 ${
          form[k]
            ? 'border-amber-500/60 text-white'
            : 'border-white/20 text-transparent group-hover:border-white/35'
        }`}
        style={form[k] ? { background: 'linear-gradient(135deg, #C49A3C, #A07B28)' } : {}}
      >
        <Check size={11} strokeWidth={3} />
      </button>
      <span className="text-sm font-inter text-white/70 leading-snug group-hover:text-white/90 transition-colors">
        {label}
      </span>
    </label>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />

      <section className="pt-40 pb-12 relative">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(196,154,60,0.07) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-inter font-semibold uppercase tracking-widest mb-6"
            style={{ background: 'rgba(196,154,60,0.10)', border: '1px solid rgba(196,154,60,0.20)', color: '#D4AF6A' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Área privada · qimmo.es/documentacion
          </div>
          <h1 className="font-jakarta font-black text-4xl md:text-5xl text-white mb-4 tracking-tight">
            Generador de<br />
            <span style={{ color: '#C49A3C' }}>Documentos Profesionales</span>
          </h1>
          <p className="text-white/50 font-inter text-base leading-relaxed max-w-xl">
            Genera notas de encargo con firma personalizada. Rellena los datos, descarga el PDF en segundos.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 lg:px-10 pb-24 w-full space-y-3">

        {/* ── 1. Tipo de documento ── */}
        <Section idx={0} title="Tipo de encargo y operación">
          <div>
            <Field label="Operación">
              <div className="flex gap-2 flex-wrap">
                <ToggleBtn active={form.operacion === 'venta'} onClick={() => set('operacion', 'venta')}>Venta</ToggleBtn>
                <ToggleBtn active={form.operacion === 'alquiler'} onClick={() => set('operacion', 'alquiler')}>Alquiler</ToggleBtn>
              </div>
            </Field>
          </div>
          <div>
            <Field label="Modalidad de encargo">
              <div className="flex gap-2 flex-wrap">
                <ToggleBtn active={form.modalidad === 'exclusiva'} onClick={() => set('modalidad', 'exclusiva')}>Con exclusiva</ToggleBtn>
                <ToggleBtn active={form.modalidad === 'sin_exclusiva'} onClick={() => set('modalidad', 'sin_exclusiva')}>Sin exclusiva</ToggleBtn>
                <ToggleBtn active={form.modalidad === 'agente_unico'} onClick={() => set('modalidad', 'agente_unico')}>Agente único</ToggleBtn>
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={form.operacion === 'venta' ? 'Precio de venta (€)' : 'Precio mensual (€)'}>
              <input
                type="number" className={inp} placeholder="450000"
                value={form.precio} onChange={e => set('precio', e.target.value)}
              />
            </Field>
            <Field label="Honorarios del agente">
              <input
                type="text" className={inp}
                placeholder={form.operacion === 'venta' ? 'ej: 3 (%)' : 'ej: 1 (mensualidad)'}
                value={form.honorarios} onChange={e => set('honorarios', e.target.value)}
              />
            </Field>
          </div>
          <div>
            <Field label="Duración del encargo">
              <div className="flex gap-2 flex-wrap">
                {(['1','2','3','6','personalizado'] as Duracion[]).map(d => (
                  <ToggleBtn key={d} active={form.duracion === d} onClick={() => set('duracion', d)}>
                    {d === 'personalizado' ? 'Personalizado' : `${d} ${d === '1' ? 'mes' : 'meses'}`}
                  </ToggleBtn>
                ))}
              </div>
              {form.duracion === 'personalizado' && (
                <input
                  type="text" className={`${inp} mt-3`} placeholder="ej: 4 meses, hasta 31/12/2025..."
                  value={form.duracionPersonalizada} onChange={e => set('duracionPersonalizada', e.target.value)}
                />
              )}
            </Field>
          </div>
        </Section>

        {/* ── 2. Propietario ── */}
        <Section idx={1} title="Datos del propietario">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre y apellidos" req>
              <input type="text" className={inp} placeholder="Juan García López"
                value={form.propNombre} onChange={e => set('propNombre', e.target.value)} />
            </Field>
            <Field label="DNI / NIE" req>
              <input type="text" className={inp} placeholder="12345678A"
                value={form.propDni} onChange={e => set('propDni', e.target.value)} />
            </Field>
          </div>
          <Field label="Domicilio del propietario" req>
            <input type="text" className={inp} placeholder="C/ Ejemplo 12, 3º 1ª, 08001 Barcelona"
              value={form.propDomicilio} onChange={e => set('propDomicilio', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" className={inp} placeholder="juan@email.com"
                value={form.propEmail} onChange={e => set('propEmail', e.target.value)} />
            </Field>
            <Field label="Teléfono">
              <input type="tel" className={inp} placeholder="+34 6XX XXX XXX"
                value={form.propTelefono} onChange={e => set('propTelefono', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* ── 3. Inmueble ── */}
        <Section idx={2} title="Datos del inmueble">
          <Field label="Dirección completa" req>
            <input type="text" className={inp} placeholder="C/ Mallorca 300, 5º 2ª, 08037 Barcelona"
              value={form.inmDireccion} onChange={e => set('inmDireccion', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo de inmueble" req>
              <select className={inp} value={form.inmTipo} onChange={e => set('inmTipo', e.target.value)}
                style={{ background: 'white' }}>
                <option value="">Seleccionar...</option>
                {TIPOS_INMUEBLE.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Referencia catastral">
              <input type="text" className={inp} placeholder="(opcional)"
                value={form.inmReferenciaCatastral} onChange={e => set('inmReferenciaCatastral', e.target.value)} />
            </Field>
          </div>
          <Field label="Descripción breve (opcional)">
            <textarea rows={2} className={`${inp} resize-none`} placeholder="Piso de 90m², 3 habitaciones, reformado..."
              value={form.inmDescripcion} onChange={e => set('inmDescripcion', e.target.value)} />
          </Field>
        </Section>

        {/* ── 4. Permisos ── */}
        <Section idx={3} title="Permisos del propietario">
          <p className="text-white/40 text-xs font-inter mb-2">
            Marca los permisos que el propietario otorga. Aparecerán como cláusulas firmadas en el documento.
          </p>
          <div className="space-y-4">
            <PermRow key="permPublicar" label="Publicar anuncios en portales inmobiliarios (Idealista, Fotocasa, habitaclia, redes sociales y otros medios)" />
            <PermRow key="permVisitas" label="Coordinar y realizar visitas al inmueble con potenciales compradores o arrendatarios" />
            <PermRow key="permFotos" label="Realizar reportaje fotográfico, vídeo y/o tour virtual del inmueble" />
            <PermRow key="permCartel" label="Instalar cartel de SE VENDE / SE ALQUILA en el exterior del inmueble" />
            <PermRow key="permNegociar" label="Recibir ofertas, evaluar y negociar condiciones dentro del precio autorizado" />
            <PermRow key="permDocumentacion" label="Solicitar y gestionar documentación (cédula habitabilidad, certificado energético, nota simple, etc.)" />
            <PermRow key="permComunidad" label="Contactar con la administración de fincas o comunidad de propietarios si fuera necesario" />
          </div>
        </Section>

        {/* ── 5. Firma / lugar ── */}
        <Section idx={4} title="Lugar de firma">
          <Field label="Ciudad donde se firma el documento">
            <input type="text" className={inp} placeholder="Barcelona"
              value={form.lugar} onChange={e => set('lugar', e.target.value)} />
          </Field>
        </Section>

        {/* ── Botón generar ── */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleGenerar}
            disabled={!form.propNombre || !form.inmDireccion}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-jakarta font-bold text-base text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: generado
                ? 'linear-gradient(135deg, #059669, #047857)'
                : 'linear-gradient(135deg, #C49A3C, #A07B28)',
              boxShadow: generado
                ? '0 8px 32px rgba(5,150,105,0.30)'
                : '0 8px 32px rgba(196,154,60,0.30)',
            }}
          >
            {generado ? (
              <><Check size={20} /> PDF generado y descargado</>
            ) : (
              <><Download size={20} /> Generar y descargar Nota de Encargo</>
            )}
          </button>
          {(!form.propNombre || !form.inmDireccion) && (
            <p className="text-white/30 text-xs font-inter text-center mt-3">
              Completa al menos el nombre del propietario y la dirección del inmueble
            </p>
          )}
        </div>

      </main>

      <Footer />
    </div>
  )
}
