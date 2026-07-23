import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="label mb-3">Legal</p>
          <h1 className="h1 text-navy mb-2">Política de Privacidad</h1>
          <p className="font-inter text-sm mb-10" style={{ color: '#9CA3AF' }}>Última actualización: julio 2025</p>

          <div className="space-y-8 font-inter text-base leading-relaxed" style={{ color: '#4B5563' }}>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">1. Responsable del tratamiento</h2>
              <p>
                <strong>Joaquín de Oses</strong> — qimmo<br />
                Actividad: Consultoría inmobiliaria<br />
                Dirección: C/ Balmes 188, 6º 2ª — 08006 Barcelona<br />
                Email: <a href="mailto:info@qimmo.es" className="text-navy underline">info@qimmo.es</a><br />
                Teléfono: <a href="tel:+34609019160" className="text-navy underline">+34 609 019 160</a>
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">2. Datos que recogemos</h2>
              <p>Recogemos los datos que usted nos facilita voluntariamente a través de:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>El formulario de solicitud de valoración (nombre, teléfono, email, dirección del inmueble)</li>
                <li>El formulario de contacto (nombre, email, mensaje)</li>
                <li>Comunicaciones directas por email o teléfono</li>
              </ul>
              <p className="mt-3">También recogemos datos técnicos de navegación de forma anónima (véase Política de Cookies).</p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">3. Finalidad del tratamiento</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Atender su solicitud de información o valoración inmobiliaria</li>
                <li>Gestionar la relación contractual cuando proceda</li>
                <li>Enviar comunicaciones relacionadas con sus solicitudes</li>
                <li>Cumplir con obligaciones legales aplicables</li>
              </ul>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">4. Base legal</h2>
              <p>
                El tratamiento de sus datos se basa en: (a) su consentimiento expreso al enviar el formulario, (b) la ejecución de un contrato o precontrato a su solicitud, y (c) el interés legítimo para atender consultas.
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">5. Conservación de los datos</h2>
              <p>
                Sus datos se conservarán mientras sean necesarios para la finalidad para la que se recogieron y, posteriormente, durante los plazos legales de prescripción aplicables (máximo 5 años para relaciones comerciales).
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">6. Destinatarios</h2>
              <p>
                Sus datos no se ceden a terceros salvo obligación legal. Utilizamos proveedores de servicios técnicos (alojamiento web, envío de formularios) que actúan como encargados del tratamiento bajo las garantías del RGPD. No realizamos transferencias internacionales de datos fuera del EEE sin las garantías adecuadas.
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">7. Sus derechos</h2>
              <p>Puede ejercer en cualquier momento los siguientes derechos:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos</li>
                <li><strong>Supresión:</strong> solicitar el borrado de sus datos</li>
                <li><strong>Oposición y limitación:</strong> oponerse o limitar el tratamiento</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado</li>
              </ul>
              <p className="mt-3">
                Para ejercer sus derechos, escríbanos a{' '}
                <a href="mailto:info@qimmo.es" className="text-navy underline">info@qimmo.es</a>.
                También puede reclamar ante la <strong>Agencia Española de Protección de Datos</strong> (aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">8. Seguridad</h2>
              <p>
                Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos frente a accesos no autorizados, pérdida o destrucción, de conformidad con el RGPD (UE) 2016/679 y la LOPDGDD.
              </p>
            </section>

            <section>
              <h2 className="font-jakarta font-bold text-navy text-lg mb-3">9. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de actualizar esta política. Cualquier cambio relevante se comunicará mediante aviso en el sitio web. La versión vigente siempre estará disponible en esta página.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
