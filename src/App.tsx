import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Clientes } from './pages/Clientes';
import { Vehiculos } from './pages/Vehiculos';
import { Inventario } from './pages/Inventario';
import { OrdenesTrabajo } from './pages/OrdenesTrabajo';
import { ReportesTrabajo } from './pages/ReportesTrabajo';
import { NuevoReporte } from './pages/NuevoReporte';
import { Dashboard } from './pages/Dashboard';
import { Cotizaciones } from './pages/Cotizaciones';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-white">Cargando...</div>;
  if (!session) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/ordenes" element={<OrdenesTrabajo />} />
            <Route path="/reportes" element={<ReportesTrabajo />} />
            <Route path="/reportes/nuevo" element={<NuevoReporte />} />
            <Route path="/cotizaciones" element={<Cotizaciones />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
