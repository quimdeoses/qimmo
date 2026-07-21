const ITEMS = [
  { label: 'Barcelona residencial', value: '+4.2%', suffix: 'YoY' },
  { label: 'Precio medio Eixample', value: '5.200€', suffix: '/m²' },
  { label: 'Rentabilidad bruta media', value: '4.8%', suffix: 'anual' },
  { label: 'Demanda alquiler temporal', value: '+38%', suffix: 'vs 2023' },
  { label: 'Operaciones cerradas', value: '150+', suffix: 'en cartera' },
  { label: 'Tipos hipotecarios', value: '3.15%', suffix: 'TAE' },
  { label: 'Alquiler Barcelona', value: '+11%', suffix: 'YoY' },
  { label: 'Activos asesorados', value: '200M€', suffix: 'gestionados' },
]

// Duplicate for seamless loop
const TICKER = [...ITEMS, ...ITEMS]

export default function MarketTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06]"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(4px)' }}>
      <div className="ticker-track flex items-center gap-0 py-2.5">
        {TICKER.map((item, i) => (
          <div key={i} className="flex items-center gap-6 shrink-0 px-8">
            <div className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
              <span className="font-inter text-[10px] text-white/35 uppercase tracking-[0.15em] whitespace-nowrap">
                {item.label}
              </span>
              <span className="font-inter font-bold text-[11px] text-gold/80 whitespace-nowrap">
                {item.value}
              </span>
              <span className="font-inter text-[10px] text-white/25 whitespace-nowrap">
                {item.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
