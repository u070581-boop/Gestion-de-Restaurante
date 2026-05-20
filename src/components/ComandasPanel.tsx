import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CategoriaPlatillo, Platillo } from '../types';
import { Plus, Minus, FileText, ShoppingCart, AlertCircle, Trash2, CheckCircle } from 'lucide-react';

export const ComandasPanel: React.FC = () => {
  const { mesas, menu, personal, crearComanda, usuarioActual } = useRestaurant();

  // Estados del Constructor de Comanda
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [meseroSeleccionado, setMeseroSeleccionado] = useState(() => (
    usuarioActual && usuarioActual.rol === 'Mesero' ? usuarioActual.id : ''
  ));
  const [notasGenerales, setNotasGenerales] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Cart de Items
  const [cart, setCart] = useState<{ platilloId: string; cantidad: number; notas?: string }[]>([]);

  // Filtro de Menú
  const [categoriaSel, setCategoriaSel] = useState<CategoriaPlatillo>('Entradas');

  // Meseros en turno
  const meserosEnTurno = personal.filter(p => p.rol === 'Mesero' && p.estado === 'En Turno');

  // Mesas disponibles (libres o que ya se les asignó cliente pero aún no tienen comanda activa)
  const mesasDisponibles = mesas.filter(m => m.estado !== 'Cuenta Solicitada');

  // Al seleccionar una mesa, auto-llenar el cliente y el mesero si ya está ocupada
  const handleSeleccionarMesa = (mesaId: string) => {
    setMesaSeleccionada(mesaId);
    const mesa = mesas.find(m => m.id === mesaId);
    if (mesa && mesa.estado !== 'Libre') {
      setClienteNombre(mesa.clienteNombre || '');
      setMeseroSeleccionado(mesa.meseroId || (usuarioActual && usuarioActual.rol === 'Mesero' ? usuarioActual.id : ''));
    } else {
      setClienteNombre('');
      setMeseroSeleccionado(usuarioActual && usuarioActual.rol === 'Mesero' ? usuarioActual.id : '');
    }
  };

  const agregarAlCart = (p: Platillo) => {
    setCart(prev => {
      const exist = prev.find(item => item.platilloId === p.id);
      if (exist) {
        return prev.map(item => item.platilloId === p.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      } else {
        return [...prev, { platilloId: p.id, cantidad: 1, notas: '' }];
      }
    });
  };

  const cambiarCantidad = (platilloId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.platilloId === platilloId) {
          const nuevaCant = item.cantidad + delta;
          return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const actualizarNotaItem = (platilloId: string, notas: string) => {
    setCart(prev => prev.map(item => item.platilloId === platilloId ? { ...item, notas } : item));
  };

  const eliminarDelCart = (platilloId: string) => {
    setCart(prev => prev.filter(item => item.platilloId !== platilloId));
  };

  const calcularTotalCart = () => {
    return cart.reduce((total, item) => {
      const p = menu.find(x => x.id === item.platilloId);
      return total + (p ? p.precio * item.cantidad : 0);
    }, 0);
  };

  const handleSubmitComanda = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!mesaSeleccionada) {
      setErrorText('Por favor selecciona una mesa activa.');
      return;
    }
    if (!clienteNombre.trim()) {
      setErrorText('Ingresa el nombre del comensal.');
      return;
    }
    if (!meseroSeleccionado) {
      setErrorText('Selecciona un mesero responsable.');
      return;
    }
    if (cart.length === 0) {
      setErrorText('Agrega al menos un platillo al pedido.');
      return;
    }

    crearComanda(
      mesaSeleccionada,
      clienteNombre,
      meseroSeleccionado,
      cart,
      notasGenerales
    );

    // Reset Formulario
    setMesaSeleccionada('');
    setClienteNombre('');
    setMeseroSeleccionado(usuarioActual && usuarioActual.rol === 'Mesero' ? usuarioActual.id : '');
    setNotasGenerales('');
    setCart([]);
    setSuccessText('¡Comanda enviada a KDS Cocina exitosamente!');
    setTimeout(() => setSuccessText(null), 4000);
  };

  const platillosDisponibles = menu.filter(p => p.categoria === categoriaSel && p.disponible);

  return (
    <div className="space-y-6" id="comandas-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            CONSTRUCTOR DE COMANDAS
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Terminal móvil para levantar pedidos, agregar especificaciones y despachar a cocina.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lado Izquierdo: Visualizador de Menu para agregar (7 cols) */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md xl:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-805/65 pb-3 gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350">Carta Disponible</h3>
            
            {/* Categorias del Menu */}
            <div className="flex flex-wrap gap-1">
              {(['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'] as CategoriaPlatillo[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSel(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all cursor-pointer uppercase ${
                    categoriaSel === cat 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 shadow-inner' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750 hover:text-zinc-200'
                  }`}
                >
                  {cat === 'Platos Fuertes' ? 'Fuertes' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {platillosDisponibles.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-zinc-550 text-xs font-mono">
                No hay platillos disponibles o activos en {categoriaSel}.
              </div>
            ) : (
              platillosDisponibles.map(p => (
                <div 
                  key={p.id}
                  onClick={() => agregarAlCart(p)}
                  className="p-3 bg-[#111] border border-zinc-805 rounded-lg hover:border-zinc-700 hover:bg-zinc-805/10 cursor-pointer flex justify-between items-start transition-all duration-150"
                >
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="font-bold text-xs text-zinc-150">{p.nombre}</h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{p.descripcion}</p>
                    <span className="text-xs font-extrabold text-emerald-400 block mt-1">${p.precio.toFixed(2)}</span>
                  </div>
                  <button className="p-1 bg-zinc-800 hover:bg-emerald-650 hover:text-white rounded-full transition-colors text-zinc-400 text-xs cursor-pointer">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lado Derecho: Carrito de la Comanda (5 cols) */}
        <div className="xl:col-span-5 flex flex-col space-y-4">
          <form onSubmit={handleSubmitComanda} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md flex flex-col justify-between h-full min-h-[500px]">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center border-b border-zinc-805/60 pb-3">
                <ShoppingCart className="w-4 h-4 mr-1.5 text-emerald-400" />
                Detalle del Pedido
                {cart.length > 0 && (
                  <span className="ml-2 bg-emerald-950/80 text-emerald-400 border border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cart.reduce((s, i) => s + i.cantidad, 0)} items
                  </span>
                )}
              </h3>

              {errorText && (
                <div className="p-2.5 bg-rose-955/30 border border-rose-900/50 text-rose-400 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {successText && (
                <div className="p-2.5 bg-emerald-955/40 border border-emerald-900/50 text-emerald-400 rounded-lg text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successText}</span>
                </div>
              )}

              {/* Informacion de Mesa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Mesa Servida</label>
                  <select
                    value={mesaSeleccionada}
                    onChange={e => handleSeleccionarMesa(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
                    required
                  >
                    <option value="" className="bg-zinc-900">Seleccionar...</option>
                    {mesasDisponibles.map(m => (
                      <option key={m.id} value={m.id} className="bg-zinc-900">Mesa {m.numero} ({m.estado})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Mesero Responsable</label>
                  <select
                    value={meseroSeleccionado}
                    onChange={e => setMeseroSeleccionado(e.target.value)}
                    disabled={usuarioActual?.rol === 'Mesero'}
                    className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="" className="bg-zinc-900">Seleccionar...</option>
                    {meserosEnTurno.map(m => (
                      <option key={m.id} value={m.id} className="bg-zinc-900">{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Identificador de Comensal</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={e => setClienteNombre(e.target.value)}
                    placeholder="Escribe el nombre identificador"
                    className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Items Seleccionados */}
              <div className="border-t border-zinc-800/85 pt-3">
                <span className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider mb-2">Platillos Ordenados</span>
                
                <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-650 flex flex-col items-center justify-center space-y-1 font-medium">
                      <AlertCircle className="w-5 h-5 opacity-40 text-zinc-500" />
                      <p>Selecciona platillos de la carta izquierda</p>
                    </div>
                  ) : (
                    cart.map(item => {
                      const p = menu.find(x => x.id === item.platilloId);
                      return (
                        <div key={item.platilloId} className="p-2.5 bg-[#121212] border border-zinc-805 rounded-lg flex flex-col space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-200">{p?.nombre}</span>
                            <span className="font-extrabold text-emerald-400 font-mono">${((p?.precio || 0) * item.cantidad).toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            {/* Notas especificas de cocina */}
                            <input
                              type="text"
                              value={item.notas || ''}
                              onChange={e => actualizarNotaItem(item.platilloId, e.target.value)}
                              placeholder="Notas: sin salsa, asados..."
                              className="text-[10px] text-zinc-300 bg-transparent border-b border-zinc-800 hover:border-zinc-700 focus:border-emerald-500 focus:outline-none w-1/2 py-0.5"
                            />

                            {/* Controles de cantidad */}
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => cambiarCantidad(item.platilloId, -1)}
                                className="p-0.5 bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-zinc-200">{item.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => cambiarCantidad(item.platilloId, 1)}
                                className="p-0.5 bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarDelCart(item.platilloId)}
                                className="p-1 text-zinc-550 hover:text-rose-450 ml-1 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Observaciones generales de cocina */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Notas Generales / Alérgenos</label>
                <textarea
                  value={notasGenerales}
                  onChange={e => setNotasGenerales(e.target.value)}
                  placeholder="Ej. Llevar platos calientes, comensal alérgico al cacahuate..."
                  className="w-full p-2 text-xs bg-[#1A1A1A] border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Total / Botón */}
            <div className="border-t border-zinc-800/85 pt-3.5 mt-3 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-wider">Monto Total:</span>
                <span className="font-black text-rose-400 text-lg font-mono">
                  ${calcularTotalCart().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-650 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-550 cursor-pointer transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20 uppercase tracking-wider"
              >
                <FileText className="w-4 h-4" />
                <span>Despachar Comanda</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
