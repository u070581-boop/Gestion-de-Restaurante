import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ChefHat, Clock, Check, ArrowRight, BookOpen } from 'lucide-react';

export const ChefsPanel: React.FC = () => {
  const { comandas, mesas, personal, actualizarEstadoComanda, usuarioActual } = useRestaurant();

  // Cocineros activos
  const chefs = personal.filter(p => p.rol === 'Chef' && p.estado === 'En Turno');

  // Comandas que deben ir o están en la cocina
  const filasCocina = comandas.filter(c => 
    c.estado === 'Pendiente' || 
    c.estado === 'En Cocina' || 
    c.estado === 'Preparado'
  );

  const handleEmpezarPreparar = (comandaId: string, chefId: string) => {
    actualizarEstadoComanda(comandaId, 'En Cocina', chefId);
  };

  const handleMarcarListo = (comandaId: string) => {
    actualizarEstadoComanda(comandaId, 'Preparado');
  };

  const handleEntregarMesero = (comandaId: string) => {
    actualizarEstadoComanda(comandaId, 'Entregado');
  };

  return (
    <div className="space-y-6" id="chefs-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-850 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            PANTALLA KDS / COCINA
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-sans">Kitchen Display System en tiempo real. Gestión y cronómetro de tickets gastronómicos.</p>
        </div>

        {/* Info Chefs */}
        <div className="bg-[#141414] border border-zinc-800 px-3.5 py-1.8 rounded-lg flex items-center space-x-2.5 text-xs text-zinc-400">
          <ChefHat className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-[10.5px]">
            Chefs Activos: <strong className="text-zinc-100">{chefs.length > 0 ? chefs.map(c => c.nombre.split(' ')[0]).join(', ') : 'S/N'}</strong>
          </span>
        </div>
      </div>

      {filasCocina.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-16 text-center text-zinc-500">
          <ChefHat className="w-10 h-10 mx-auto opacity-30 text-zinc-400 mb-4" />
          <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest">¡Despachado en orden!</h3>
          <p className="text-xs text-zinc-550 mt-1.5 font-medium">No existen comandas pendientes de preparación en este turno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filasCocina.map(comanda => {
            const mesaObj = mesas.find(m => m.id === comanda.mesaId);
            const chefAsignado = personal.find(p => p.id === comanda.chefId);
            const meseroAtendiendo = personal.find(p => p.id === comanda.meseroId);

            // Calcular tiempo transcurrido
            const minutosTranscurridos = Math.round(
              (new Date().getTime() - new Date(comanda.timestamp).getTime()) / 60000
            );

            return (
              <div 
                key={comanda.id}
                className={`border rounded-xl bg-zinc-900 shadow-md flex flex-col justify-between h-[390px] transition-all duration-150 ${
                  comanda.estado === 'Pendiente' ? 'border-amber-805/90 ring-1 ring-amber-950/20 shadow-sm shadow-amber-955/5' :
                  comanda.estado === 'En Cocina' ? 'border-sky-805/90 ring-1 ring-sky-950/20' :
                  'border-zinc-800'
                }`}
              >
                {/* Cabecera del ticket de cocina */}
                <div className="p-4 border-b border-zinc-850 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 font-black tracking-widest">MESA {mesaObj?.numero || '?' }</span>
                      <h4 className="text-xs font-bold text-zinc-100 leading-tight truncate mt-0.5">Cliente: {comanda.clienteNombre}</h4>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded ${
                        comanda.estado === 'Pendiente' ? 'bg-amber-950/20 text-amber-400 border-amber-900/40' :
                        comanda.estado === 'En Cocina' ? 'bg-sky-950/20 text-sky-400 border-sky-900/40' :
                        'bg-emerald-955/20 text-emerald-400 border-emerald-900/40'
                      }`}>
                        {comanda.estado === 'Pendiente' ? 'PENDIENTE' : 
                         comanda.estado === 'En Cocina' ? 'COCINA' : 'PREPARADO'}
                      </span>
                      
                      <span className="text-[9.5px] font-mono text-zinc-500 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-zinc-550" />
                        Hace {minutosTranscurridos} min
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-450 flex justify-between pt-1 border-t border-zinc-850">
                    <span>Mesero: <strong className="text-zinc-350">{meseroAtendiendo?.nombre || 'General'}</strong></span>
                    {chefAsignado && <span className="text-emerald-400 font-bold bg-zinc-800 px-1.5 rounded text-[9px] border border-zinc-700/50">Chef: {chefAsignado.nombre.split(' ')[0]}</span>}
                  </div>
                </div>

                {/* Lista de alimentos del ticket */}
                <div className="p-4 flex-1 overflow-y-auto space-y-2 divide-y divide-zinc-850 pr-1">
                  {comanda.items.map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-start first:pt-0">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-zinc-150">
                          {item.cantidad}x &mdash; <span className="font-bold text-zinc-200">{item.nombre}</span>
                        </span>
                        {item.notas && (
                          <p className="text-[9.5px] text-amber-400 font-bold bg-amber-955/20 border border-amber-900/30 px-2 py-0.5 rounded flex items-center mt-1">
                            <BookOpen className="w-3 h-3 mr-1 shrink-0" />
                            Nota: {item.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {comanda.notasOpcionales && (
                    <div className="pt-2 text-[10px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded border border-zinc-850 italic mt-2.5">
                      💡 Comentario General: {comanda.notasOpcionales}
                    </div>
                  )}
                </div>

                {/* Acciones de Cocinero / Chef */}
                <div className="p-4 bg-[#111] border-t border-zinc-850 rounded-b-xl">
                  {comanda.estado === 'Pendiente' && (
                    <div className="space-y-2">
                      {usuarioActual?.rol === 'Chef' ? (
                        <button
                          type="button"
                          onClick={() => handleEmpezarPreparar(comanda.id, usuarioActual.id)}
                          className="w-full bg-amber-600 hover:bg-amber-550 text-white font-bold py-2 text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-amber-950/20"
                        >
                          <span>Tomar Pedido (Empezar Cocina)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <>
                          <span className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest text-center">Asignar Elaboración</span>
                          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                            {chefs.length === 0 ? (
                              <p className="text-[10px] text-amber-550 font-semibold text-center w-full leading-relaxed">
                                Tip: Registra chefs con estado 'En Turno' para asignarlos.
                              </p>
                            ) : (
                              chefs.map(chef => (
                                <button
                                  key={chef.id}
                                  onClick={() => handleEmpezarPreparar(comanda.id, chef.id)}
                                  className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-700 text-[10px] py-1.5 px-2 rounded-md transition cursor-pointer text-center whitespace-nowrap"
                                >
                                  {chef.nombre.split(' ')[0]}
                                </button>
                              ))
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {comanda.estado === 'En Cocina' && (
                    <button
                      onClick={() => handleMarcarListo(comanda.id)}
                      className="w-full bg-[#1e2e35]/30 border border-sky-800 text-sky-400 font-bold py-2 text-xs rounded-lg hover:bg-[#1a2e35]/65 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Terminar Elaboración (Listo)</span>
                    </button>
                  )}

                  {comanda.estado === 'Preparado' && (
                    <button
                      onClick={() => handleEntregarMesero(comanda.id)}
                      className="w-full bg-emerald-650 text-white font-bold py-2 text-xs rounded-lg hover:bg-emerald-550 transition flex items-center justify-center space-x-1.5 cursor-pointer animate-pulse"
                    >
                      <span>Entregar Comanda a Mesero</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
