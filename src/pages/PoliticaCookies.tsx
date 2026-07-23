import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="label mb-3">Legal</p>
          <h1 className="h1 text-navy mb-2">Política de Cookies</h1>
          <p className="font-inter text-sm mb-10" style={{ color: '#9CA3AF' }}>Última actualización: julio 2025</p>

          <div className="space-y-8 font-inter text-base leading-relaxed" style={{ color: '#4B5563' }}>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web guardan en su dispositivo para recordar preferencias, analizar el uso y mejorar la experiencia de navegación. Este sitio usa un número mínimo de cookies, todas orientadas a mejorar el servicio.
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">Cookies que utilizamos</h2>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: '#F0F4FA' }}>
                      <th className="text-left px-4 py-3 font-jakarta font-bold text-navy rounded-tl-lg">Nombre</th>
                      <th className="text-left px-4 py-3 font-jakarta font-bold text-navy">Tipo</th>
                      <th className="text-left px-4 py-3 font-jakarta font-bold text-navy">Finalidad</th>
                      <th className="text-left px-4 py-3 font-jakarta font-bold text-navy rounded-tr-lg">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E0DA' }}>
                      <td className="px-4 py-3 font-mono text-xs">qimmo_cookie_consent</td>
                      <td className="px-4 py-3">Técnica</td>
                      <td className="px-4 py-3">Guardar su preferencia sobre cookies</td>
                      <td className="px-4 py-3">1 año</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E0DA' }}>
                      <td className="px-4 py-3 font-mono text-xs">_ga, _ga_*</td>
                      <td className="px-4 py-3">Analítica</td>
                      <td className="px-4 py-3">Google Analytics — estadísticas de visitas anónimas</td>
                      <td className="px-4 py-3">2 años</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl" style={{ background: '#F0F4FA', border: '1px solid #E2E0DA' }}>
                  <p className="font-jakarta font-bold text-navy text-sm mb-1">Cookies técnicas (necesarias)</p>
                  <p className="text-sm">Imprescindibles para el funcionamiento del sitio. No requieren consentimiento. Se activan solo en respuesta a acciones del usuario (como guardar su preferencia de cookies).</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#F0F4FA', border: '1px solid #E2E0DA' }}>
                  <p className="font-jakarta font-bold text-navy text-sm mb-1">Cookies analíticas (opcionales)</p>
                  <p className="text-sm">Nos permiten contar visitas y conocer el origen del tráfico para mejorar el rendimiento del sitio. Toda la información es anónima. Se activan solo si acepta las cookies analíticas.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">Cómo gestionar las cookies</h2>
              <p>Puede gestionar o eliminar cookies desde la configuración de su navegador:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad</li>
                <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios</li>
              </ul>
              <p className="mt-3">
                Tenga en cuenta que deshabilitar ciertas cookies puede afectar al correcto funcionamiento del sitio.
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">Más información</h2>
              <p>
                Para cualquier consulta sobre nuestra política de cookies, contáctenos en{' '}
                <a href="mailto:info@qimmo.es" className="text-navy underline">info@qimmo.es</a>.
                Para más información sobre protección de datos, consulte nuestra{' '}
                <a href="/politica-privacidad" className="text-navy underline">Política de Privacidad</a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
