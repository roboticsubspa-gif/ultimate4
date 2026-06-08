import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Wrench, Users, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    ganancias: 0,
    ordenesAbiertas: 0,
    clientes: 0,
    vehiculos: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      // Ganancias (suma de ganancias en reportes)
      const { data: reportes } = await supabase.from('reportes_trabajo').select('ganancia');
      const totalGanancias = reportes?.reduce((acc, curr) => acc + Number(curr.ganancia), 0) || 0;

      // OTs Abiertas/En Progreso
      const { count: otCount } = await supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).neq('estado', 'Cerrada');
      
      // Total Clientes
      const { count: clCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true });

      // Total Vehiculos
      const { count: vhCount } = await supabase.from('vehiculos').select('*', { count: 'exact', head: true });

      setStats({
        ganancias: totalGanancias,
        ordenesAbiertas: otCount || 0,
        clientes: clCount || 0,
        vehiculos: vhCount || 0
      });
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const cards = [
    { title: 'Ganancias Totales', value: formatMoney(stats.ganancias), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Órdenes Activas', value: stats.ordenesAbiertas, icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Clientes Registrados', value: stats.clientes, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Vehículos Atendidos', value: stats.vehiculos, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen del rendimiento del taller.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                {loading ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
          <p className="text-muted-foreground text-sm">Próximamente: Gráfico de ganancias mensuales.</p>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Órdenes Pendientes</h3>
          <p className="text-muted-foreground text-sm">Próximamente: Lista de OTs que requieren atención.</p>
        </div>
      </div>
    </div>
  );
};
