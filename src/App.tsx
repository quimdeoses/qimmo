import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WhatsAppButton from './components/WhatsAppButton'
import CookieBanner from './components/CookieBanner'
import Inicio              from './pages/Inicio'
import Propiedades         from './pages/Propiedades'
import PropiedadDetalle    from './pages/PropiedadDetalle'
import Vender              from './pages/Vender'
import VenderVivienda      from './pages/VenderVivienda'
import VenderLocal         from './pages/VenderLocal'
import Alquilar            from './pages/Alquilar'
import AlquilarPiso        from './pages/AlquilarPiso'
import AlquilarTemporal    from './pages/AlquilarTemporal'
import AlquilarLocalOficina from './pages/AlquilarLocalOficina'
import Financiacion        from './pages/Hipotecas'
import Inversion           from './pages/Inversion'
import Calculadoras        from './pages/Calculadoras'
import Contacto            from './pages/Contacto'
import AreaPropietarios   from './pages/AreaPropietarios'
import AreaClientes        from './pages/AreaClientes'
import Equipo              from './pages/Equipo'
import Documentacion       from './pages/Documentacion'
import PoliticaPrivacidad  from './pages/PoliticaPrivacidad'
import PoliticaCookies     from './pages/PoliticaCookies'

export default function App() {
  return (
    <BrowserRouter>
      <WhatsAppButton />
      <CookieBanner />
      <Routes>
        <Route path="/"                      element={<Inicio />} />
        <Route path="/buscar"                element={<Propiedades />} />
        <Route path="/buscar/:ref"           element={<PropiedadDetalle />} />
        <Route path="/propiedades"           element={<Propiedades />} />
        <Route path="/propiedades/:ref"      element={<PropiedadDetalle />} />
        <Route path="/vender"                element={<Vender />} />
        <Route path="/vender/vivienda"       element={<VenderVivienda />} />
        <Route path="/vender/local"          element={<VenderLocal />} />
        <Route path="/alquilar"              element={<Alquilar />} />
        <Route path="/alquilar/piso"         element={<AlquilarPiso />} />
        <Route path="/alquilar/temporal"     element={<AlquilarTemporal />} />
        <Route path="/alquilar/local"        element={<AlquilarLocalOficina />} />
        <Route path="/financiacion"          element={<Financiacion />} />
        <Route path="/gestion-patrimonial"   element={<Inversion />} />
        <Route path="/inversion"             element={<Inversion />} />
        <Route path="/calculadoras"          element={<Calculadoras />} />
        <Route path="/contacto"             element={<Contacto />} />
        <Route path="/area-propietarios"    element={<AreaPropietarios />} />
        <Route path="/area-clientes"        element={<AreaClientes />} />
        <Route path="/equipo"               element={<Equipo />} />
        <Route path="/documentacion"        element={<Documentacion />} />
        <Route path="/politica-privacidad"  element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies"     element={<PoliticaCookies />} />
      </Routes>
    </BrowserRouter>
  )
}
