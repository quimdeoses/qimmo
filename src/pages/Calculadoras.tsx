import { useState } from 'react'
import { Home, ShoppingCart, Hammer, Download, Info } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Datos ITP por CCAA ───────────────────────────────────────────────────────
type BonificacionInfo = { id: string; label: string; rate: number }
type CCAAData = {
  nombre: string
  itp: number        // tipo general %
  ajd: number        // AJD para 2ª mano (%)
  bonificaciones: BonificacionInfo[]
}

const CCAA: Record<string, CCAAData> = {
  AND: { nombre: 'Andalucía',       itp: 7,   ajd: 1.2, bonificaciones: [{ id: 'joven', label: 'Joven (<35 años)', rate: 3.5 }, { id: 'vpo', label: 'VPO / Protegida', rate: 3.5 }] },
  ARA: { nombre: 'Aragón',          itp: 8,   ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<35 años)', rate: 5 }] },
  AST: { nombre: 'Asturias',        itp: 8,   ajd: 1.2, bonificaciones: [] },
  BAL: { nombre: 'Baleares',        itp: 10,  ajd: 1.2, bonificaciones: [{ id: 'vpo', label: 'VPO / Protegida', rate: 4 }] },
  CAN: { nombre: 'Canarias',        itp: 6.5, ajd: 1.0, bonificaciones: [] },
  CANT: { nombre: 'Cantabria',      itp: 10,  ajd: 1.5, bonificaciones: [] },
  CLM: { nombre: 'Castilla-La Mancha', itp: 9, ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<36 años)', rate: 6 }] },
  CYL: { nombre: 'Castilla y León', itp: 8,   ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<36 años)', rate: 5 }] },
  CAT: { nombre: 'Cataluña',        itp: 10,  ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<33 años)', rate: 5 }, { id: 'famnumerosa', label: 'Familia numerosa', rate: 5 }] },
  EXT: { nombre: 'Extremadura',     itp: 8,   ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<35 años)', rate: 7 }] },
  GAL: { nombre: 'Galicia',         itp: 10,  ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<36 años)', rate: 6 }, { id: 'rural', label: 'Zona rural', rate: 6 }] },
  RIO: { nombre: 'La Rioja',        itp: 7,   ajd: 1.0, bonificaciones: [] },
  MAD: { nombre: 'Madrid',          itp: 6,   ajd: 0.75, bonificaciones: [{ id: 'joven', label: 'Joven (<35 años, ≤250k€)', rate: 0.75 }] },
  MUR: { nombre: 'Murcia',          itp: 8,   ajd: 1.5, bonificaciones: [] },
  NAV: { nombre: 'Navarra',         itp: 6,   ajd: 0.5, bonificaciones: [] },
  PV:  { nombre: 'País Vasco',      itp: 4,   ajd: 0, bonificaciones: [] },
  VAL: { nombre: 'C. Valenciana',   itp: 10,  ajd: 1.5, bonificaciones: [{ id: 'joven', label: 'Joven (<35 años, ≤180k€)', rate: 6 }, { id: 'vpo', label: 'VPO / Protegida', rate: 6 }] },
}

// ─── IRPF plusvalía tramos ─────────────────────────────────────────────────────
function calcularIRPF(ganancia: number): number {
  if (ganancia <= 0) return 0
  let impuesto = 0
  const tramos = [
    { hasta: 6000,   tipo: 0.19 },
    { hasta: 50000,  tipo: 0.21 },
    { hasta: 200000, tipo: 0.23 },
    { hasta: 300000, tipo: 0.27 },
    { hasta: Infinity, tipo: 0.28 },
  ]
  let restante = ganancia
  let prevUmbral = 0
  for (const t of tramos) {
    const base = Math.min(restante, t.hasta - prevUmbral)
    impuesto += base * t.tipo
    restante -= base
    prevUmbral = t.hasta
    if (restante <= 0) break
  }
  return impuesto
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €'
const fmtPct = (n: number) => n.toFixed(2) + '%'
const parse = (s: string) => parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-stone-100 last:border-0 ${highlight ? 'font-semibold' : ''}`}>
      <span className={`font-inter text-sm ${highlight ? 'text-navy' : 'text-stone-500'}`}>{label}</span>
      <span className={`font-inter text-sm tabular-nums ${highlight ? 'text-navy' : 'text-stone-700'}`}>{value}</span>
    </div>
  )
}

function ResultBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-navy rounded-2xl p-5 text-center">
      <p className="font-inter text-white/50 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="font-cormorant font-semibold text-4xl text-gold">{value}</p>
      {sub && <p className="text-white/40 text-xs font-inter mt-1">{sub}</p>}
    </div>
  )
}

// ─── Calculadora 1: Rentabilidad de Alquiler ──────────────────────────────────
function CalcAlquiler() {
  const [precio,    setPrecio]    = useState('')
  const [pctGastos, setPctGastos] = useState('10')   // gastos compra %
  const [alquiler,  setAlquiler]  = useState('')
  const [vacios,    setVacios]    = useState('5')     // % meses vacíos
  const [gastosMes, setGastosMes] = useState('')
  const [anos,      setAnos]      = useState('10')
  const [revalAno,  setRevalAno]  = useState('3')

  const p   = parse(precio)
  const gco = parse(pctGastos) / 100
  const a   = parse(alquiler)
  const va  = parse(vacios)    / 100
  const gm  = parse(gastosMes)
  const n   = Math.max(1, parseInt(anos)  || 10)
  const rv  = parse(revalAno)  / 100

  const inversion   = p * (1 + gco)
  const ingresoAno  = a * 12 * (1 - va)
  const gastosAno   = gm * 12
  const netaAno     = ingresoAno - gastosAno
  const brutaPct    = p > 0 ? (a * 12) / p * 100 : 0
  const netaPct     = inversion > 0 ? (netaAno / inversion) * 100 : 0
  const valorFinal  = p * Math.pow(1 + rv, n)
  const ingresosTot = netaAno * n
  const plusvalia   = valorFinal - p
  const gananciaTotal = ingresosTot + plusvalia
  const roi         = inversion > 0 ? (gananciaTotal / inversion) * 100 : 0
  const payback     = netaAno > 0 ? inversion / netaAno : 0

  const ok = p > 0 && a > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="card space-y-4">
          <h3 className="font-inter font-semibold text-navy text-base border-b border-stone-100 pb-3">Datos del activo</h3>
          <div>
            <label className="label-field">Precio de compra (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 280.000" value={precio} onChange={e => setPrecio(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Gastos de compra estimados (%)</label>
            <input className="input" type="text" inputMode="decimal" placeholder="10" value={pctGastos} onChange={e => setPctGastos(e.target.value)} />
            <p className="text-stone-300 text-[11px] font-inter mt-1">ITP/IVA + notaría + registro + gestoría</p>
          </div>
          <div>
            <label className="label-field">Alquiler mensual bruto (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 1.200" value={alquiler} onChange={e => setAlquiler(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Tasa de vacíos estimada (%)</label>
            <input className="input" type="text" inputMode="decimal" placeholder="5" value={vacios} onChange={e => setVacios(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Gastos mensuales — IBI, comunidad, seguro, mantenimiento (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 200" value={gastosMes} onChange={e => setGastosMes(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Horizonte (años)</label>
              <input className="input" type="text" inputMode="numeric" placeholder="10" value={anos} onChange={e => setAnos(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Revalorización anual (%)</label>
              <input className="input" type="text" inputMode="decimal" placeholder="3" value={revalAno} onChange={e => setRevalAno(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {ok ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultBlock label="Rentab. bruta" value={fmtPct(brutaPct)} />
                <ResultBlock label="Rentab. neta" value={fmtPct(netaPct)} />
                <ResultBlock label={`ROI en ${n} años`} value={fmtPct(roi)} />
                <ResultBlock label="Payback" value={`${payback.toFixed(1)} años`} />
              </div>
              <div className="card">
                <h4 className="font-inter font-semibold text-navy text-sm mb-3">Desglose</h4>
                <ResultRow label="Inversión total (compra + gastos)" value={fmt(inversion)} />
                <ResultRow label={`Ingresos netos anuales`}          value={fmt(netaAno)} />
                <ResultRow label={`Ingresos acumulados en ${n} años`} value={fmt(ingresosTot)} />
                <ResultRow label={`Valor del activo en ${n} años`}   value={fmt(valorFinal)} />
                <ResultRow label="Plusvalía estimada"                 value={fmt(plusvalia)} />
                <ResultRow label="Ganancia total estimada"            value={fmt(gananciaTotal)} highlight />
              </div>
            </>
          ) : (
            <div className="card flex items-center justify-center h-full min-h-[200px] text-stone-300 text-sm font-inter text-center">
              Introduce precio de compra<br />y alquiler mensual
            </div>
          )}
        </div>
      </div>
      <div className="card bg-navy/5 border border-navy/10 flex gap-2.5 items-start">
        <Info size={14} className="text-navy mt-0.5 shrink-0" />
        <p className="text-stone-500 text-xs font-inter leading-relaxed">Cálculo orientativo. No incluye IRPF sobre rentas de alquiler ni variaciones de mercado. La revalorización es una estimación lineal.</p>
      </div>
    </div>
  )
}

// ─── Calculadora 2: Gastos de Compraventa ─────────────────────────────────────
function CalcGastosCompraventa() {
  const [precio,   setPrecio]   = useState('')
  const [tipo,     setTipo]     = useState<'segunda' | 'nueva'>('segunda')
  const [ccaa,     setCcaa]     = useState('CAT')
  const [bonif,    setBonif]    = useState('')
  const [iva,      setIva]      = useState<'10' | '4'>('10')

  const p   = parse(precio)
  const com = CCAA[ccaa]

  let itpIva = 0
  let ajd    = 0
  let label  = ''

  if (tipo === 'segunda') {
    const itpRate = bonif && com.bonificaciones.find(b => b.id === bonif)
      ? (com.bonificaciones.find(b => b.id === bonif)!.rate / 100)
      : (com.itp / 100)
    itpIva = p * itpRate
    ajd    = 0 // en 2ª mano no hay AJD sobre el precio (solo en hipoteca)
    label  = bonif ? `ITP bonificado (${(itpRate * 100).toFixed(1)}%)` : `ITP (${com.itp}%)`
  } else {
    itpIva = p * (parseFloat(iva) / 100)
    ajd    = p * (com.ajd / 100)
    label  = `IVA (${iva}%)`
  }

  const notaria   = p > 0 ? Math.max(300, Math.min(2500, p * 0.004)) : 0
  const registro  = p > 0 ? Math.max(150, Math.min(1200, p * 0.002)) : 0
  const gestoria  = 350
  const total     = itpIva + ajd + notaria + registro + gestoria
  const pctTotal  = p > 0 ? (total / p) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card space-y-4">
          <h3 className="font-inter font-semibold text-navy text-base border-b border-stone-100 pb-3">Parámetros</h3>

          <div>
            <label className="label-field">Precio de compra (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 350.000" value={precio} onChange={e => setPrecio(e.target.value)} />
          </div>

          <div>
            <label className="label-field">Tipo de compraventa</label>
            <div className="flex gap-2 mt-1">
              {(['segunda', 'nueva'] as const).map(t => (
                <button key={t} type="button" onClick={() => { setTipo(t); setBonif('') }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-inter font-medium border transition-all ${
                    tipo === t ? 'bg-navy text-white border-navy' : 'bg-stone-bg text-stone-500 border-stone-200 hover:border-navy/30'
                  }`}>
                  {t === 'segunda' ? '2ª mano (ITP)' : '1ª mano / Obra nueva (IVA)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">Comunidad Autónoma</label>
            <select className="input" value={ccaa} onChange={e => { setCcaa(e.target.value); setBonif('') }}>
              {Object.entries(CCAA).sort((a, b) => a[1].nombre.localeCompare(b[1].nombre)).map(([k, v]) => (
                <option key={k} value={k}>{v.nombre}</option>
              ))}
            </select>
          </div>

          {tipo === 'segunda' && com.bonificaciones.length > 0 && (
            <div>
              <label className="label-field">ITP bonificado (si aplica)</label>
              <select className="input" value={bonif} onChange={e => setBonif(e.target.value)}>
                <option value="">Sin bonificación — tipo general ({com.itp}%)</option>
                {com.bonificaciones.map(b => (
                  <option key={b.id} value={b.id}>{b.label} — {b.rate}%</option>
                ))}
              </select>
            </div>
          )}

          {tipo === 'nueva' && (
            <div>
              <label className="label-field">Tipo de IVA</label>
              <select className="input" value={iva} onChange={e => setIva(e.target.value as '10' | '4')}>
                <option value="10">IVA general — 10%</option>
                <option value="4">IVA superreducido — 4% (VPO calificada)</option>
              </select>
            </div>
          )}
        </div>

        <div className="card space-y-0">
          <h3 className="font-inter font-semibold text-navy text-base border-b border-stone-100 pb-3 mb-3">Desglose de gastos</h3>
          {p > 0 ? (
            <>
              <ResultRow label={label}              value={fmt(itpIva)} highlight />
              {tipo === 'nueva' && ajd > 0 && (
                <ResultRow label={`AJD (${com.ajd}%)`} value={fmt(ajd)} />
              )}
              <ResultRow label="Notaría (estimado)"  value={fmt(notaria)} />
              <ResultRow label="Registro (estimado)" value={fmt(registro)} />
              <ResultRow label="Gestoría (estimado)" value={fmt(gestoria)} />
              <div className="mt-3 pt-3 border-t border-stone-200">
                <ResultRow label="TOTAL GASTOS" value={fmt(total)} highlight />
                <ResultRow label="Precio total del activo" value={fmt(p + total)} />
                <div className="mt-3">
                  <ResultBlock label="Gastos sobre precio" value={fmtPct(pctTotal)} sub={`${fmt(total)} sobre ${fmt(p)}`} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] text-stone-300 text-sm font-inter text-center">
              Introduce el precio de compra
            </div>
          )}
        </div>
      </div>
      <div className="card bg-navy/5 border border-navy/10 flex gap-2.5 items-start">
        <Info size={14} className="text-navy mt-0.5 shrink-0" />
        <p className="text-stone-500 text-xs font-inter leading-relaxed">Notaría y registro son estimaciones basadas en aranceles habituales. Los importes exactos dependen del notario y del tipo de escritura. Los tipos impositivos pueden actualizarse; verifica siempre con tu gestoría.</p>
      </div>
    </div>
  )
}

// ─── Calculadora 3: Compra + Reforma + Venta ──────────────────────────────────
function CalcFlip() {
  const [precioCompra, setPrecioCompra] = useState('')
  const [pctGastos,    setPctGastos]    = useState('10')
  const [reforma,      setReforma]      = useState('')
  const [precioVenta,  setPrecioVenta]  = useState('')
  const [pctAgencia,   setPctAgencia]   = useState('3')
  const [anos,         setAnos]         = useState('1')
  const [valCatSuelo,  setValCatSuelo]  = useState('')  // valor catastral suelo
  const [ccaa,         setCcaa]         = useState('CAT')

  const pc  = parse(precioCompra)
  const gco = parse(pctGastos) / 100
  const rf  = parse(reforma)
  const pv  = parse(precioVenta)
  const pag = parse(pctAgencia) / 100
  const n   = Math.max(1, parseInt(anos) || 1)
  const vcs = parse(valCatSuelo)
  void CCAA[ccaa] // ccaa used for display only in this calc

  const gastosCompra    = pc * gco
  const costeTotal      = pc + gastosCompra + rf
  const gastosVenta     = pv * pag + 1000  // agencia + notaría/gestoría estimada
  const gananciaAntesTax = pv - costeTotal - gastosVenta
  const pctMargenBruto  = pv > 0 ? (gananciaAntesTax / pv) * 100 : 0

  // Plusvalía municipal (IIVTNU)
  // Método objetivo: valor catastral suelo × coeficiente × tipo IIVTNU
  // Usamos coeficiente estándar según años y tipo ~30%
  const coeficientes: Record<number, number> = { 1: 0.14, 2: 0.13, 3: 0.15, 4: 0.17, 5: 0.17, 6: 0.16, 7: 0.12, 8: 0.10, 9: 0.09, 10: 0.08 }
  const coef = coeficientes[Math.min(n, 10)] ?? 0.08
  const tipoIIVTNU = 0.30  // tipo máximo municipal estándar
  const plusvaliaMunicipal = vcs > 0 ? vcs * coef * tipoIIVTNU : null

  // Ganancia patrimonial IRPF (precio venta - precio compra - gastos compra - gastos venta - reforma)
  const gananciaIRPF   = Math.max(0, gananciaAntesTax)
  const irpf           = calcularIRPF(gananciaIRPF)
  const plusvMun       = plusvaliaMunicipal ?? 0
  const beneficioNeto  = gananciaAntesTax - irpf - plusvMun

  const ok = pc > 0 && pv > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="card space-y-4">
          <h3 className="font-inter font-semibold text-navy text-base border-b border-stone-100 pb-3">Datos de la operación</h3>
          <div>
            <label className="label-field">Precio de compra (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 180.000" value={precioCompra} onChange={e => setPrecioCompra(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Gastos de compra (%)</label>
            <input className="input" type="text" inputMode="decimal" placeholder="10" value={pctGastos} onChange={e => setPctGastos(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Coste de reforma (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 40.000" value={reforma} onChange={e => setReforma(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Precio de venta esperado (€)</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Ej: 290.000" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Honorarios agencia venta (%)</label>
            <input className="input" type="text" inputMode="decimal" placeholder="3" value={pctAgencia} onChange={e => setPctAgencia(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Tiempo tenencia (años)</label>
              <select className="input" value={anos} onChange={e => setAnos(e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10].map(y => <option key={y} value={y}>{y} {y === 1 ? 'año' : 'años'}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Comunidad Autónoma</label>
              <select className="input" value={ccaa} onChange={e => setCcaa(e.target.value)}>
                {Object.entries(CCAA).sort((a, b) => a[1].nombre.localeCompare(b[1].nombre)).map(([k, v]) => (
                  <option key={k} value={k}>{v.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Valor catastral del suelo (€) — para plusvalía municipal</label>
            <input className="input" type="text" inputMode="numeric" placeholder="Consultar en escritura / catastro" value={valCatSuelo} onChange={e => setValCatSuelo(e.target.value)} />
            <p className="text-stone-300 text-[11px] font-inter mt-1">Opcional. Si no lo introduces, la plusvalía municipal no se calcula.</p>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {ok ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultBlock label="Margen bruto" value={fmt(gananciaAntesTax)} sub={`${pctMargenBruto.toFixed(1)}% sobre venta`} />
                <ResultBlock label="Beneficio neto est." value={fmt(beneficioNeto)} sub="tras IRPF y plusvalía" />
              </div>
              <div className="card">
                <h4 className="font-inter font-semibold text-navy text-sm mb-3">Desglose</h4>
                <ResultRow label="Precio de compra"              value={fmt(pc)} />
                <ResultRow label={`Gastos de compra (${(gco*100).toFixed(0)}%)`} value={fmt(gastosCompra)} />
                <ResultRow label="Coste de reforma"             value={fmt(rf)} />
                <ResultRow label="COSTE TOTAL"                  value={fmt(costeTotal)} highlight />
                <div className="my-2 border-t border-stone-100" />
                <ResultRow label="Precio de venta"              value={fmt(pv)} />
                <ResultRow label="Gastos de venta (agencia + notaría)" value={fmt(gastosVenta)} />
                <ResultRow label="MARGEN BRUTO"                 value={fmt(gananciaAntesTax)} highlight />
                <div className="my-2 border-t border-stone-100" />
                <ResultRow label="IRPF sobre ganancia patrimonial" value={fmt(irpf)} />
                <ResultRow
                  label={plusvaliaMunicipal !== null ? `Plusvalía municipal (est. ${n} año/s)` : 'Plusvalía municipal'}
                  value={plusvaliaMunicipal !== null ? fmt(plusvaliaMunicipal) : 'Introduce val. cat. suelo'}
                />
                <div className="mt-3 pt-2 border-t border-stone-200">
                  <ResultRow label="BENEFICIO NETO ESTIMADO" value={fmt(beneficioNeto)} highlight />
                </div>
              </div>
              <div className="card space-y-1.5">
                <h4 className="font-inter font-semibold text-navy text-sm mb-2">Tramos IRPF aplicados</h4>
                {[
                  { desde: 0,      hasta: 6000,   tipo: '19%' },
                  { desde: 6000,   hasta: 50000,  tipo: '21%' },
                  { desde: 50000,  hasta: 200000, tipo: '23%' },
                  { desde: 200000, hasta: 300000, tipo: '27%' },
                  { desde: 300000, hasta: Infinity, tipo: '28%' },
                ].map((t, i) => {
                  const base = Math.max(0, Math.min(gananciaIRPF - t.desde, (t.hasta === Infinity ? gananciaIRPF : t.hasta) - t.desde))
                  if (base <= 0) return null
                  return (
                    <div key={i} className="flex justify-between text-xs font-inter">
                      <span className="text-stone-500">Tramo {t.tipo} (hasta {t.hasta === Infinity ? '∞' : fmt(t.hasta).replace(' €', '')}€)</span>
                      <span className="text-stone-700 tabular-nums">{fmt(base * parseFloat(t.tipo) / 100)}</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="card flex items-center justify-center h-full min-h-[200px] text-stone-300 text-sm font-inter text-center">
              Introduce precio de compra<br />y precio de venta
            </div>
          )}
        </div>
      </div>
      <div className="card bg-navy/5 border border-navy/10 flex gap-2.5 items-start">
        <Info size={14} className="text-navy mt-0.5 shrink-0" />
        <p className="text-stone-500 text-xs font-inter leading-relaxed">
          La plusvalía municipal se calcula con el método objetivo (RD-Ley 26/2021). El IRPF aplica los tramos de ahorro del ejercicio fiscal vigente.
          Estas estimaciones no sustituyen el asesoramiento fiscal profesional.
        </p>
      </div>
    </div>
  )
}

// ─── Guías PDF ────────────────────────────────────────────────────────────────
const GUIAS = [
  { title: 'Guía de inversión inmobiliaria', desc: 'Todo lo que debes saber antes de comprar tu primer activo de inversión.', pages: '18 páginas' },
  { title: 'Checklist de due diligence',     desc: 'Lista completa de verificaciones técnicas, jurídicas y urbanísticas.',           pages: '8 páginas' },
  { title: 'Gestión de cartera patrimonial', desc: 'Marco de referencia para estructurar y optimizar una cartera diversificada.',     pages: '24 páginas' },
]

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'alquiler', icon: Home,        label: 'Rentabilidad de alquiler' },
  { id: 'gastos',   icon: ShoppingCart, label: 'Gastos de compraventa' },
  { id: 'flip',     icon: Hammer,      label: 'Compra · Reforma · Venta' },
]

export default function Calculadoras() {
  const [tab, setTab] = useState<'alquiler' | 'gastos' | 'flip'>('alquiler')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-20 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy opacity-98" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label text-white/40 mb-4">Herramientas</p>
          <div className="w-10 h-[2px] bg-gold mb-8" />
          <h1 className="h1 text-white max-w-2xl mb-6">
            Calculadoras de<br />
            <span className="text-gold italic">inversión inmobiliaria</span>
          </h1>
          <p className="text-white/50 font-inter text-lg font-light leading-relaxed max-w-xl">
            Analiza cualquier operación antes de decidir. Rentabilidad, gastos de compraventa y margen en operaciones de compra-reforma-venta.
          </p>
        </div>
      </section>

      {/* ── CALCULADORAS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex-1">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-white rounded-2xl shadow-card w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-navy text-white shadow'
                  : 'text-stone-500 hover:text-navy'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'alquiler' && <CalcAlquiler />}
        {tab === 'gastos'   && <CalcGastosCompraventa />}
        {tab === 'flip'     && <CalcFlip />}
      </section>

      {/* ── GUÍAS PDF ── */}
      <section className="bg-stone-bg border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="label mb-4">Recursos</p>
            <div className="navy-accent mx-auto mb-6" />
            <h2 className="h2">Guías descargables</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GUIAS.map((g, i) => (
              <div key={i} className="card flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Download size={15} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-inter font-semibold text-navy text-sm mb-1">{g.title}</h3>
                  <p className="text-stone-500 text-xs font-inter leading-relaxed mb-2">{g.desc}</p>
                  <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-stone-300">{g.pages}</span>
                </div>
                <a href="mailto:info@qimmo.es?subject=Solicitud de guía — qimmo" className="btn-outline text-sm w-full justify-center mt-auto">
                  Solicitar guía
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
