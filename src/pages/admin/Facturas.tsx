import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, X, Loader2, Printer, Pencil, Trash2 } from 'lucide-react'

// ── Datos fijos del emisor (Plantilla_Factura) ────────────────────────────────
const EMISOR = {
  nombre: 'QIMMO REAL ESTATE SL',
  cif: 'B93938959',
  direccion: ['Calle Balmes, 188, Planta 6 Puerta 2', '08006 Barcelona'],
  tel: '93 152 10 24',
  email: 'info@qimmo.es',
  iban: 'ES60 0182 0815 8302 0189 2475',
  banco: 'BBVA',
}

const LEGAL = `Esta factura ha sido emitida por QIMMO REAL ESTATE SL (en adelante, el Emisor) al amparo de lo establecido en el Real Decreto 1619/2012, de 30 de noviembre, por el que se aprueba el Reglamento por el que se regulan las obligaciones de facturación. El IVA repercutido es deducible conforme a la normativa fiscal vigente. El pago de la presente factura implica la aceptación de la prestación del servicio descrito. En caso de discrepancia, el receptor deberá comunicarlo al Emisor en el plazo de siete (7) días hábiles desde la recepción. A partir del vencimiento indicado, los importes pendientes devengarán el interés legal del dinero incrementado en dos puntos porcentuales, conforme al artículo 7 de la Ley 3/2004 de medidas de lucha contra la morosidad en operaciones comerciales.`

// ── Types ─────────────────────────────────────────────────────────────────────
type InvoiceStatus = 'borrador' | 'enviada' | 'pagada' | 'vencida' | 'anulada'
interface Linea { descripcion: string; cantidad: number; precio: number }

interface Invoice {
  id: string
  number: string
  status: InvoiceStatus
  concept: string
  subtotal: number
  iva_pct: number
  iva_amount: number | null
  total: number | null
  issued_at: string
  due_at: string | null
  paid_at: string | null
  client_name: string | null
  client_nif: string | null
  client_address: string | null
  reference: string | null
  lines: Linea[] | null
  created_at: string
}

const STATUSES: InvoiceStatus[] = ['borrador', 'enviada', 'pagada', 'vencida', 'anulada']
const STATUS_COLOR: Record<InvoiceStatus, { bg: string; text: string }> = {
  borrador: { bg: '#F3F4F6', text: '#6B7280' },
  enviada:  { bg: '#EFF6FF', text: '#2563EB' },
  pagada:   { bg: '#F0FDF4', text: '#16A34A' },
  vencida:  { bg: '#FEF2F2', text: '#DC2626' },
  anulada:  { bg: '#F3F4F6', text: '#9CA3AF' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100
const eur = (n: number) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
const ddmmyyyy = (s: string | null) => s ? s.split('-').reverse().join('/') : '—'
const today = () => new Date().toISOString().slice(0, 10)
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function linesOf(inv: Invoice): Linea[] {
  if (inv.lines?.length) return inv.lines
  return [{ descripcion: inv.concept, cantidad: 1, precio: Number(inv.subtotal) }]
}

// Siguiente nº correlativo FAC-AAAA-NNN a partir de los ya guardados
function nextNumber(invoices: Invoice[]): string {
  const year = new Date().getFullYear()
  const re = new RegExp(`^FAC-${year}-(\\d+)$`)
  const max = invoices.reduce((m, i) => {
    const r = re.exec(i.number)
    return r ? Math.max(m, parseInt(r[1], 10)) : m
  }, 0)
  return `FAC-${year}-${String(max + 1).padStart(3, '0')}`
}

// ── Documento imprimible (réplica de Plantilla_Factura) ───────────────────────
function printInvoice(inv: Invoice) {
  const lines = linesOf(inv)
  const subtotal = Number(inv.subtotal)
  const ivaPct = Number(inv.iva_pct)
  const iva = inv.iva_amount != null ? Number(inv.iva_amount) : round2(subtotal * ivaPct / 100)
  const total = inv.total != null ? Number(inv.total) : round2(subtotal + iva)
  const concepto = `Factura nº ${inv.number}${inv.reference ? ' — ' + inv.reference : ''}`
  const logo = `${window.location.origin}/LOGO%20QIMMO%20BLUE.png`

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Factura ${esc(inv.number)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #0D1F3C; font-size: 11px; margin: 0; }
  .wrap { max-width: 780px; margin: 0 auto; padding: 24px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  /* el PNG es cuadrado con mucho margen: recortamos al área del logotipo */
  .logo { width: 160px; height: 73px; overflow: hidden; margin-bottom: 12px; }
  .logo img { width: 241px; margin: -84px 0 0 -40px; display: block; }
  .emisor p { margin: 2px 0; line-height: 1.4; }
  .title { text-align: right; }
  .title h1 { font-size: 26px; letter-spacing: 2px; margin: 0 0 10px; }
  .title table td { padding: 2px 0 2px 12px; text-align: right; }
  .box { border: 1px solid #D9DDE5; border-radius: 6px; padding: 12px 14px; margin-top: 22px; }
  .box p { margin: 2px 0; line-height: 1.4; }
  .lbl { font-weight: bold; font-size: 10px; letter-spacing: 1px; color: #C49A3C; margin-bottom: 6px !important; }
  table.items { width: 100%; border-collapse: collapse; margin-top: 22px; }
  table.items th { background: #0D1F3C; color: #fff; text-align: left; padding: 8px 10px; font-size: 10px; letter-spacing: .5px; }
  table.items td { padding: 9px 10px; border-bottom: 1px solid #E5E7EB; vertical-align: top; }
  .num { text-align: right; white-space: nowrap; }
  .tot { width: 280px; margin: 16px 0 0 auto; border-collapse: collapse; }
  .tot td { padding: 6px 10px; }
  .tot tr.total td { border-top: 2px solid #0D1F3C; font-size: 14px; font-weight: bold; }
  .pago p { margin: 2px 0; }
  .legal { margin-top: 40px; font-size: 8.5px; line-height: 1.5; color: #6B7280; text-align: justify; }
  .actions { text-align: center; margin: 16px; }
  .actions button { background: #0D1F3C; color: #fff; border: 0; padding: 10px 22px; border-radius: 8px; font-size: 13px; cursor: pointer; }
  @media print { .actions { display: none; } .wrap { padding: 0; } }
</style></head><body>
<div class="actions"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
<div class="wrap">
  <div class="head">
    <div class="emisor">
      <div class="logo"><img src="${logo}" alt="qimmo"></div>
      <p><b>${EMISOR.nombre}</b></p>
      <p>CIF: ${EMISOR.cif}</p>
      ${EMISOR.direccion.map(l => `<p>${l}</p>`).join('')}
      <p>Tel.: ${EMISOR.tel}</p>
      <p>Email: ${EMISOR.email}</p>
    </div>
    <div class="title">
      <h1>FACTURA</h1>
      <table>
        <tr><td>Nº:</td><td><b>${esc(inv.number)}</b></td></tr>
        <tr><td>Fecha:</td><td><b>${ddmmyyyy(inv.issued_at)}</b></td></tr>
        <tr><td>Vencimiento:</td><td><b>${ddmmyyyy(inv.due_at ?? inv.issued_at)}</b></td></tr>
      </table>
    </div>
  </div>

  <div class="box">
    <p class="lbl">FACTURAR A:</p>
    <p>Nombre / Razón social: <b>${esc(inv.client_name ?? '')}</b></p>
    <p>NIF / CIF: <b>${esc(inv.client_nif ?? '')}</b></p>
    <p>Dirección: ${esc(inv.client_address ?? '').replace(/\n/g, '<br>')}</p>
  </div>

  <table class="items">
    <thead><tr><th>Descripción</th><th class="num">Cantidad</th><th class="num">Precio unit.</th><th class="num">Importe</th></tr></thead>
    <tbody>
      ${lines.map(l => `<tr>
        <td>${esc(l.descripcion).replace(/\n/g, '<br>')}</td>
        <td class="num">${l.cantidad.toLocaleString('es-ES')}</td>
        <td class="num">${eur(l.precio)}</td>
        <td class="num">${eur(round2(l.cantidad * l.precio))}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <table class="tot">
    <tr><td>Base imponible</td><td class="num"><b>${eur(subtotal)}</b></td></tr>
    <tr><td>IVA ${ivaPct.toLocaleString('es-ES')}%</td><td class="num"><b>${eur(iva)}</b></td></tr>
    <tr class="total"><td>TOTAL</td><td class="num">${eur(total)}</td></tr>
  </table>

  <div class="box pago">
    <p class="lbl">FORMA DE PAGO:</p>
    <p>Transferencia bancaria</p>
    <p>IBAN: <b>${EMISOR.iban}</b></p>
    <p>Banco: ${EMISOR.banco}</p>
    <p>Concepto transferencia: ${esc(concepto)}</p>
  </div>

  <p class="legal">${LEGAL}</p>
</div>
<script>window.onload = () => setTimeout(() => window.print(), 300)</script>
</body></html>`

  const w = window.open('', '_blank')
  if (!w) { alert('Permite las ventanas emergentes para imprimir la factura'); return }
  w.document.write(html)
  w.document.close()
}

// ── Formulario ────────────────────────────────────────────────────────────────
function InvoiceForm({ initial, suggestedNumber, onClose, onSaved, notify }: {
  initial: Invoice | null
  suggestedNumber: string
  onClose: () => void
  onSaved: (inv: Invoice, print: boolean) => void
  notify: (m: string, ok?: boolean) => void
}) {
  const [number, setNumber]   = useState(initial?.number ?? suggestedNumber)
  const [issued, setIssued]   = useState(initial?.issued_at ?? today())
  const [due, setDue]         = useState(initial?.due_at ?? today())
  const [client, setClient]   = useState(initial?.client_name ?? '')
  const [nif, setNif]         = useState(initial?.client_nif ?? '')
  const [address, setAddress] = useState(initial?.client_address ?? '')
  const [reference, setRef]   = useState(initial?.reference ?? '')
  const [ivaPct, setIvaPct]   = useState(String(initial?.iva_pct ?? 21))
  const [status, setStatus]   = useState<InvoiceStatus>(initial?.status ?? 'borrador')
  const [lines, setLines]     = useState<Linea[]>(
    initial ? linesOf(initial) : [{ descripcion: '', cantidad: 1, precio: 0 }])
  const [saving, setSaving]   = useState(false)

  const subtotal = round2(lines.reduce((s, l) => s + l.cantidad * l.precio, 0))
  const iva      = round2(subtotal * (parseFloat(ivaPct) || 0) / 100)
  const total    = round2(subtotal + iva)

  const setLine = (i: number, k: keyof Linea, v: string) =>
    setLines(ls => ls.map((l, j) => j !== i ? l : {
      ...l, [k]: k === 'descripcion' ? v : (parseFloat(v.replace(',', '.')) || 0),
    }))

  const save = async (print: boolean) => {
    if (!number.trim() || !client.trim() || !lines.some(l => l.descripcion.trim())) {
      notify('Nº, cliente y al menos una línea son obligatorios', false); return
    }
    setSaving(true)
    const clean = lines.filter(l => l.descripcion.trim())
    const payload = {
      number: number.trim(),
      status,
      concept: clean[0].descripcion.split('\n')[0].slice(0, 200),
      subtotal, iva_pct: parseFloat(ivaPct) || 0, iva_amount: iva, total,
      issued_at: issued, due_at: due || null,
      paid_at: status === 'pagada' ? (initial?.paid_at ?? today()) : null,
      client_name: client.trim(), client_nif: nif.trim() || null,
      client_address: address.trim() || null, reference: reference.trim() || null,
      lines: clean,
    }
    const q = initial
      ? supabase.from('invoices').update(payload).eq('id', initial.id).select().single()
      : supabase.from('invoices').insert(payload).select().single()
    const { data, error } = await q
    setSaving(false)
    if (error) {
      notify(error.code === '23505' ? `Ya existe una factura con el nº ${number}` : 'Error: ' + error.message, false)
      return
    }
    onSaved(data as Invoice, print)
  }

  const L = (label: string, node: React.ReactNode, cls = '') => (
    <label className={`block ${cls}`}>
      <span className="font-inter text-xs font-semibold text-gray-500 mb-1 block">{label}</span>
      {node}
    </label>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: 'rgba(13,31,60,.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E2E0DA' }}>
          <h2 className="font-jakarta font-bold text-navy text-lg">{initial ? `Editar ${initial.number}` : 'Nueva factura'}</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {L('Nº factura', <input className="input w-full" value={number} onChange={e => setNumber(e.target.value)} />)}
            {L('Fecha', <input type="date" className="input w-full" value={issued} onChange={e => setIssued(e.target.value)} />)}
            {L('Vencimiento', <input type="date" className="input w-full" value={due} onChange={e => setDue(e.target.value)} />)}
            {L('Estado', (
              <select className="input w-full" value={status} onChange={e => setStatus(e.target.value as InvoiceStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ))}
          </div>
          {!initial && (
            <p className="font-inter text-[11px] -mt-3" style={{ color: '#B45309' }}>
              Nº sugerido según las facturas guardadas aquí. Si has emitido otras fuera del admin, ajústalo para mantener la numeración correlativa.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {L('Cliente (nombre / razón social)', <input className="input w-full" value={client} onChange={e => setClient(e.target.value)} />)}
            {L('NIF / CIF', <input className="input w-full" value={nif} onChange={e => setNif(e.target.value)} />)}
            {L('Dirección', <textarea rows={2} className="input w-full" value={address} onChange={e => setAddress(e.target.value)} />, 'md:col-span-2')}
            {L('Inmueble / referencia (aparece en el concepto de la transferencia)',
              <input className="input w-full" value={reference} onChange={e => setRef(e.target.value)}
                placeholder="Muntaner 477, 8º 2ª" />, 'md:col-span-2')}
          </div>

          <div>
            <p className="font-inter text-xs font-semibold text-gray-500 mb-2">Líneas</p>
            <div className="space-y-2">
              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <textarea rows={2} placeholder="Descripción" className="input col-span-12 md:col-span-6"
                    value={l.descripcion} onChange={e => setLine(i, 'descripcion', e.target.value)} />
                  <input inputMode="decimal" placeholder="Cant." className="input col-span-3 md:col-span-2"
                    defaultValue={l.cantidad} onChange={e => setLine(i, 'cantidad', e.target.value)} />
                  <input inputMode="decimal" placeholder="Precio €" className="input col-span-4 md:col-span-2"
                    defaultValue={l.precio} onChange={e => setLine(i, 'precio', e.target.value)} />
                  <div className="col-span-4 md:col-span-1 font-inter text-sm text-right pt-2.5">{eur(round2(l.cantidad * l.precio))}</div>
                  <button className="col-span-1 pt-2.5 text-gray-400 hover:text-red-500" disabled={lines.length === 1}
                    onClick={() => setLines(ls => ls.filter((_, j) => j !== i))}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <button className="mt-2 font-inter text-sm font-semibold flex items-center gap-1" style={{ color: '#C49A3C' }}
              onClick={() => setLines(ls => [...ls, { descripcion: '', cantidad: 1, precio: 0 }])}>
              <Plus size={14} /> Añadir línea
            </button>
          </div>

          <div className="ml-auto w-full max-w-xs font-inter text-sm space-y-1.5">
            <div className="flex justify-between"><span>Base imponible</span><b>{eur(subtotal)}</b></div>
            <div className="flex justify-between items-center gap-2">
              <span className="flex items-center gap-1">IVA
                <input inputMode="decimal" className="input w-16 py-1" value={ivaPct} onChange={e => setIvaPct(e.target.value)} />%
              </span>
              <b>{eur(iva)}</b>
            </div>
            <div className="flex justify-between pt-2 text-base" style={{ borderTop: '2px solid #0D1F3C' }}>
              <b>TOTAL</b><b>{eur(total)}</b>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #E2E0DA' }}>
          <button onClick={onClose} className="btn-outline">Cancelar</button>
          <button onClick={() => save(false)} disabled={saving} className="btn-outline">Guardar</button>
          <button onClick={() => save(true)} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />} Guardar e imprimir
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sección ───────────────────────────────────────────────────────────────────
export default function SectionFacturas({ notify }: { notify: (m: string, ok?: boolean) => void }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<Invoice | 'new' | null>(null)
  const [filter, setFilter]     = useState<InvoiceStatus | 'todas'>('todas')

  useEffect(() => {
    supabase.from('invoices').select('*').order('issued_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) notify('Error cargando facturas: ' + error.message, false)
        setInvoices((data ?? []) as Invoice[])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (inv: Invoice, status: InvoiceStatus) => {
    const paid_at = status === 'pagada' ? (inv.paid_at ?? today()) : null
    const { error } = await supabase.from('invoices').update({ status, paid_at }).eq('id', inv.id)
    if (error) { notify('Error: ' + error.message, false); return }
    setInvoices(is => is.map(i => i.id === inv.id ? { ...i, status, paid_at } : i))
  }

  const onSaved = (inv: Invoice, print: boolean) => {
    setInvoices(is => [inv, ...is.filter(i => i.id !== inv.id)]
      .sort((a, b) => b.issued_at.localeCompare(a.issued_at)))
    setModal(null)
    notify(`Factura ${inv.number} guardada`)
    if (print) printInvoice(inv)
  }

  const year = String(new Date().getFullYear())
  const thisYear = invoices.filter(i => i.issued_at.startsWith(year) && i.status !== 'anulada')
  const facturado = thisYear.reduce((s, i) => s + Number(i.total ?? 0), 0)
  const pendiente = thisYear.filter(i => i.status === 'enviada' || i.status === 'vencida')
    .reduce((s, i) => s + Number(i.total ?? 0), 0)
  const filtered = filter === 'todas' ? invoices : invoices.filter(i => i.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-jakarta font-bold text-navy text-2xl">Facturas</h1>
          <p className="font-inter text-sm text-gray-500 mt-1">
            {year}: {eur(facturado)} facturado · {eur(pendiente)} pendiente de cobro
          </p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary"><Plus size={16} /> Nueva factura</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['todas', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full font-inter text-xs font-semibold capitalize"
            style={{
              background: filter === s ? '#0D1F3C' : 'white',
              color: filter === s ? 'white' : '#6B7280',
              border: '1px solid #E2E0DA',
            }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" /></div>
      ) : filtered.length === 0 ? (
        <p className="font-inter text-sm text-gray-500 py-12 text-center">No hay facturas.</p>
      ) : (
        <div className="bg-white rounded-2xl overflow-x-auto" style={{ border: '1px solid #E2E0DA' }}>
          <table className="w-full font-inter text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500" style={{ borderBottom: '1px solid #E2E0DA' }}>
                <th className="px-4 py-3">Nº</th><th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Concepto</th>
                <th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const c = STATUS_COLOR[inv.status]
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">{inv.number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{ddmmyyyy(inv.issued_at)}</td>
                    <td className="px-4 py-3">{inv.client_name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{inv.concept}</td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{eur(Number(inv.total ?? 0))}</td>
                    <td className="px-4 py-3">
                      <select value={inv.status} onChange={e => changeStatus(inv, e.target.value as InvoiceStatus)}
                        className="rounded-full px-2 py-1 text-xs font-semibold border-0 cursor-pointer"
                        style={{ background: c.bg, color: c.text }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button title="Editar" onClick={() => setModal(inv)} className="p-1.5 text-gray-400 hover:text-navy"><Pencil size={15} /></button>
                      <button title="Imprimir / PDF" onClick={() => printInvoice(inv)} className="p-1.5 text-gray-400 hover:text-navy"><Printer size={15} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <InvoiceForm
          initial={modal === 'new' ? null : modal}
          suggestedNumber={nextNumber(invoices)}
          onClose={() => setModal(null)}
          onSaved={onSaved}
          notify={notify}
        />
      )}
    </div>
  )
}
