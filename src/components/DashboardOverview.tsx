import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Users, Utensils, ClipboardList, DollarSign, Clock } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { mesas, comandas, ventas, personal } = useRestaurant();

  // Calcular métricas
  const totalMesas = mesas.length;
  const mesasOcupadas = mesas.filter(m => m.estado !== 'Libre').length;
  const ocupacionPorcentaje = totalMesas > 0 ? Math.round((mesasOcupadas / totalMesas) * 100) : 0;

  const totalComandasEnCocina = comandas.filter(c => c.estado === 'Pendiente' || c.estado === 'En Cocina').length;
  const comandasListas = comandas.filter(c => c.estado === 'Preparado').length;

  const staffActivo = personal.filter(p => p.estado === 'En Turno').length;

  const ventasHoy = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalPropinas = ventas.reduce((acc, v) => acc + v.propina, 0);

  // Comandas activas recientes
  const comandasActivas = comandas.filter(c => c.estado !== 'Pagado' && c.estado !== 'Cancelado');

  return (
    <div className="space-y-6" id="dashboard-overview">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            CONSOLA DE ESTADO
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50 tracking-widest">
              GUSTO ACTIVO
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Gobernanza general y flujo operativo del turno actual.</p>
        </div>
        <div className="mt-3 md:mt-0 text-left md:text-right font-mono text-[11px] text-zinc-500">
          <div>Consola: <span className="text-emerald-450 font-bold">● En Línea</span></div>
          <div>Último Cierre: <span className="text-zinc-400">Ayer 23:55</span></div>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventas */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md flex items-center space-x-4">
          <div className="bg-emerald-950/50 text-emerald-400 p-3 rounded-lg border border-emerald-900/50">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ventas Turno</p>
            <p className="text-lg font-black text-zinc-100">${ventasHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] text-emerald-500 font-mono mt-0.5">Propina: ${totalPropinas.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Mesas */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md flex items-center space-x-4">
          <div className="bg-zinc-850 text-emerald-400 p-3 rounded-lg border border-zinc-700/50">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ocupación</p>
            <p className="text-lg font-black text-zinc-100">{mesasOcupadas} / {totalMesas} Mesas</p>
            <div className="w-32 bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-550 h-full rounded-full transition-all duration-500 shadow-xs" 
                style={{ width: `${ocupacionPorcentaje}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Cocina Queue */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md flex items-center space-x-4">
          <div className="bg-amber-950/40 text-amber-400 p-3 rounded-lg border border-amber-900/50">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">En Cocina</p>
            <p className="text-lg font-black text-zinc-100">{totalComandasEnCocina} Comandas</p>
            <span className="inline-flex items-center text-[9px] font-mono text-amber-400 mt-1">
              • {comandasListas} platillos listos
            </span>
          </div>
        </div>

        {/* Staff */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md flex items-center space-x-4">
          <div className="bg-zinc-850 text-zinc-300 p-3 rounded-lg border border-zinc-700/50">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Staff Activo</p>
            <p className="text-lg font-black text-zinc-100">{staffActivo} Activos</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Registrados: {personal.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comandas Activas */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center">
              <ClipboardList className="w-4 h-4 mr-1.5 text-emerald-405" />
              Comandas Activas en Servicio
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-zinc-805 text-zinc-305 border border-zinc-700/50 rounded-full">
              {comandasActivas.length} activas
            </span>
          </div>

          <div className="divide-y divide-zinc-800/80 max-h-[350px] overflow-y-auto pr-1">
            {comandasActivas.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <p className="text-sm font-semibold text-zinc-400">No hay comandas activas en la sala.</p>
                <p className="text-xs mt-1">Crea pedidos ingresando en el panel de Tomas de Pedido o Mesas.</p>
              </div>
            ) : (
              comandasActivas.map(c => {
                const mesa = mesas.find(m => m.id === c.mesaId);
                const mesero = personal.find(p => p.id === c.meseroId);
                return (
                  <div key={c.id} className="py-3.5 flex justify-between items-center hover:bg-zinc-805/30 transition-colors rounded px-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-zinc-200 text-xs">
                          Mesa {mesa?.numero || '?'} &mdash; {c.clienteNombre}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          c.estado === 'Pendiente' ? 'bg-rose-950/40 text-rose-400 border-rose-900/40' :
                          c.estado === 'En Cocina' ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' :
                          c.estado === 'Preparado' ? 'bg-sky-950/40 text-sky-400 border-sky-900/40' :
                          'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                        }`}>
                          {c.estado}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {c.items.reduce((sum, item) => sum + item.cantidad, 0)} items &bull; Atendido por {mesero?.nombre || 'General'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-200">
                        ${c.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Estado Rápido de Mesas */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4 pb-2 border-b border-zinc-800/60 flex items-center">
              <Utensils className="w-4 h-4 mr-1.5 text-emerald-400" />
              Estado de Mesas
            </h3>
            
            <div className="grid grid-cols-4 gap-2">
              {mesas.map(m => (
                <div 
                  key={m.id} 
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border text-center transition-all duration-150 hover:scale-102 ${
                    m.estado === 'Libre' ? 'bg-[#0F0F0F] border-zinc-800 text-zinc-500 hover:bg-zinc-850/30' :
                    m.estado === 'Ocupada' ? 'bg-emerald-950/30 border-emerald-850 text-emerald-400 font-bold' :
                    m.estado === 'Esperando' ? 'bg-amber-950/30 border-amber-850 text-amber-400' :
                    m.estado === 'Comiendo' ? 'bg-[#1a2e35]/30 border-sky-850 text-sky-400' :
                    'bg-rose-950/30 border-rose-850 text-rose-400 animate-pulse'
                  }`}
                  title={`${m.clienteNombre || 'Sin cliente'}`}
                >
                  <span className="text-[10px] font-bold">M{m.numero}</span>
                  <span className="text-[8px] mt-0.5 opacity-90 leading-none">
                    {m.estado === 'Libre' ? 'Libre' : 
                     m.estado === 'Ocupada' ? 'Ocup' :
                     m.estado === 'Esperando' ? 'Cocina' :
                     m.estado === 'Comiendo' ? 'Come' : 'Cerrar'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800/80 mt-4 pt-4 space-y-2 text-[10px] text-zinc-500">
            <div className="grid grid-cols-2 gap-2 font-semibold">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 inline-block mr-1.5"></span> Libre</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1.5"></span> Ocupada</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1.5"></span> Esperando</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block mr-1.5"></span> Comiendo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
