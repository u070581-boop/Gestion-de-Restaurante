import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Mesa, EstadoMesa } from '../types';
import { PlusCircle, Trash2, ShieldAlert } from 'lucide-react';

export const ClientesPanel: React.FC = () => {
  const { mesas, personal, agregarMesa, actualizarMesa, liberarMesa, asignarClienteMesa } = useRestaurant();

  // Estado para nueva mesa
  const [numero, setNumero] = useState<number>(() => {
    const existentes = mesas.map(m => m.numero);
    return existentes.length > 0 ? Math.max(...existentes) + 1 : 1;
  });
  const [capacidad, setCapacidad] = useState<number>(4);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Estado para asignar mesa ocupada
  const [mesaAAsignar, setMesaAAsignar] = useState<Mesa | null>(null);
  const [clienteNombre, setClienteNombre] = useState('');
  const [meseroId, setMeseroId] = useState('');

  // Meseros activos para asignar
  const meserosDisponibles = personal.filter(p => p.rol === 'Mesero' && p.estado === 'En Turno');

  const handleCrearMesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (numero <= 0 || capacidad <= 0) return;
    
    // Validar duplicado
    if (mesas.some(m => m.numero === numero)) {
      setErrorText(`La Mesa ${numero} ya existe en el plano.`);
      setTimeout(() => setErrorText(null), 3000);
      return;
    }

    agregarMesa({ numero, capacidad });
    setNumero(prev => prev + 1);
  };

  const abrirAsignacion = (mesa: Mesa) => {
    setMesaAAsignar(mesa);
    setClienteNombre('');
    if (meserosDisponibles.length > 0) {
      setMeseroId(meserosDisponibles[0].id);
    } else {
      setMeseroId('');
    }
  };

  const handleAsignarMesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaAAsignar || !clienteNombre.trim() || !meseroId) return;

    asignarClienteMesa(mesaAAsignar.id, clienteNombre, meseroId);
    setMesaAAsignar(null);
    setClienteNombre('');
    setMeseroId('');
  };

  const handleLiberarMesa = (id: string) => {
    liberarMesa(id);
  };

  const cambiarEstadoMesa = (id: string, nuevoEstado: EstadoMesa) => {
    actualizarMesa(id, { estado: nuevoEstado });
  };

  return (
    <div className="space-y-6" id="clientes-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            SALÓN Y MESAS
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Supervisión en tiempo real de la sala, ocupación y estados de servicio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Registro de Nuevas Mesas */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md h-fit space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Nueva Mesa
            </h3>
            <form onSubmit={handleCrearMesa} className="space-y-3">
              {errorText && (
                <div className="p-2 bg-rose-950/40 text-rose-450 border border-rose-900/30 rounded text-[10px] flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{errorText}</span>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Mesa Número</label>
                <input
                  type="number"
                  value={numero}
                  onChange={e => setNumero(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Capacidad (Pax)</label>
                <input
                  type="number"
                  value={capacidad}
                  onChange={e => setCapacidad(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-650 text-white py-2 text-xs rounded-lg font-bold hover:bg-emerald-550 transition-all cursor-pointer shadow-md uppercase tracking-wide"
              >
                Agregar al Plano
              </button>
            </form>
          </div>

          {/* Asignar Cliente a Mesa */}
          {mesaAAsignar && (
            <div className="border-t border-zinc-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                Ocupar Mesa {mesaAAsignar.numero}
              </h3>
              <form onSubmit={handleAsignarMesa} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Nombre Comensal</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={e => setClienteNombre(e.target.value)}
                    placeholder="Ej. Familia Pérez / Juan M."
                    className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Mesero Responsable</label>
                  <select
                    value={meseroId}
                    onChange={e => setMeseroId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                    required
                  >
                    <option value="" className="bg-zinc-900">Seleccionar...</option>
                    {meserosDisponibles.map(m => (
                      <option key={m.id} value={m.id} className="bg-zinc-900">{m.nombre}</option>
                    ))}
                  </select>
                  {meserosDisponibles.length === 0 && (
                    <p className="text-[9px] text-amber-500 mt-1.5 leading-relaxed font-semibold">
                      Tips: Cambia el estado de un mesero a 'En Turno' en la pestaña Personal para poder asignarlo.
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 text-xs rounded-lg font-bold hover:bg-emerald-500 transition shadow-inner"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMesaAAsignar(null)}
                    className="px-2.5 py-2 text-xs bg-zinc-800 text-zinc-300 rounded-lg font-semibold hover:bg-zinc-750 transition"
                  >
                    Salir
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mosaico de mesas */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-2 border-b border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-305">Mapa de Servicio</h3>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-zinc-450">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-800 mr-1 inline-block"></span> Libre</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-emerald-950/30 border border-emerald-900 mr-1 inline-block"></span> Ocupada</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-amber-950/30 border border-amber-900 mr-1 inline-block"></span> Cocina</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-[#1a2e35]/30 border border-sky-900 mr-1 inline-block"></span> Comiendo</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-rose-950/30 border border-rose-900 mr-1 inline-block"></span> Cuenta</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesas.map(m => {
              const meseroAsignado = personal.find(p => p.id === m.meseroId);
              return (
                <div 
                  key={m.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between h-44 transition-all duration-150 ${
                    m.estado === 'Libre' ? 'bg-[#0E0E0E] border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-850/10' :
                    m.estado === 'Ocupada' ? 'bg-emerald-950/20 border-emerald-800' :
                    m.estado === 'Esperando' ? 'bg-amber-950/15 border-amber-800' :
                    m.estado === 'Comiendo' ? 'bg-[#1a2e35]/15 border-sky-850' :
                    'bg-rose-950/20 border-rose-800 animate-pulse'
                  }`}
                >
                  <div>
                    {/* Header de la tarjeta de mesa */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Módulo</span>
                        <h4 className="text-lg font-black text-zinc-100 mt-0.5">Mesa {m.numero}</h4>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                        m.estado === 'Libre' ? 'bg-zinc-850 text-zinc-400 border-zinc-800' :
                        m.estado === 'Ocupada' ? 'bg-emerald-955/20 text-emerald-400 border-emerald-900/40' :
                        m.estado === 'Esperando' ? 'bg-amber-955/20 text-amber-400 border-amber-900/40' :
                        m.estado === 'Comiendo' ? 'bg-[#1a2e35]/30 text-sky-400 border-sky-900/40' :
                        'bg-rose-955/20 text-rose-450 border-rose-900/40'
                      }`}>
                        {m.estado}
                      </span>
                    </div>

                    {/* Contenido / Info del Cliente */}
                    {m.estado !== 'Libre' ? (
                      <div className="mt-2.5 space-y-1">
                        <p className="text-xs font-bold text-zinc-200 truncate">
                          Comensal: <span className="text-emerald-400">{m.clienteNombre}</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          Servido por: <span className="text-zinc-350">{meseroAsignado?.nombre || 'General'}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 text-[10px] text-zinc-500 leading-relaxed font-mono">
                        Mesa liberada. Disponible para asignar inmediato.
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center text-[10px] font-semibold text-zinc-450">
                    <span>Espacios: {m.capacidad} pax</span>
                    
                    <div className="flex space-x-1">
                      {m.estado === 'Libre' ? (
                        <button
                          onClick={() => abrirAsignacion(m)}
                          className="px-2.5 py-1.2 bg-emerald-650 text-white rounded text-[10px] font-bold hover:bg-emerald-550 transition-all cursor-pointer uppercase tracking-wider"
                        >
                          Asignar
                        </button>
                      ) : (
                        <div className="flex space-x-1.5 items-center">
                          {/* Cambiar estados rapidos */}
                          <select
                            value={m.estado}
                            onChange={(e) => cambiarEstadoMesa(m.id, e.target.value as EstadoMesa)}
                            className="text-[10px] px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value="Ocupada" className="bg-zinc-900">Ocupada</option>
                            <option value="Esperando" className="bg-zinc-900">En Cocina</option>
                            <option value="Comiendo" className="bg-zinc-900">Comiendo</option>
                            <option value="Cuenta Solicitada" className="bg-zinc-900">Cuenta</option>
                          </select>
                          <button
                            onClick={() => handleLiberarMesa(m.id)}
                            className="p-1 text-zinc-500 hover:text-rose-450 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Liberar Mesa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
