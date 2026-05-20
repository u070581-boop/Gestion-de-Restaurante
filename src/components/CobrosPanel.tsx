import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MetodoPago } from '../types';
import { DollarSign, CheckCircle, Percent, Printer, Landmark, CreditCard, Wallet, Receipt } from 'lucide-react';

export const CobrosPanel: React.FC = () => {
  const { mesas, comandas, procesarCobro } = useRestaurant();

  // Mesa seleccionada para cobrar
  const [mesaIdSel, setMesaIdSel] = useState('');
  const [propinaSel, setPropinaSel] = useState<number>(10); // Porcentaje de propina (10, 15, custom)
  const [propinaPersonalizada, setPropinaPersonalizada] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('Efectivo');
  const [ultimoCobro, setUltimoCobro] = useState<{ mesaNumero: number; subtotal: number; propina: number; total: number; metodo: string } | null>(null);

  // Mesas activas con comandas no cobradas
  const comandasCobrar = comandas.filter(c => c.estado !== 'Pagado' && c.estado !== 'Cancelado');

  // Comanda activa de la mesa elegida
  const activeComanda = comandasCobrar.find(c => c.mesaId === mesaIdSel);
  const activeMesa = mesas.find(m => m.id === mesaIdSel);

  // Totales
  const subtotal = activeComanda 
    ? activeComanda.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0)
    : 0;

  const propinaPorcentaje = propinaSel === -1
    ? (parseFloat(propinaPersonalizada) || 0)
    : propinaSel;

  const propinaMonto = (subtotal * propinaPorcentaje) / 100;
  const total = subtotal + propinaMonto;

  const handleCompletarCobro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaIdSel || !activeComanda || !activeMesa) return;

    procesarCobro(
      mesaIdSel,
      activeComanda.id,
      subtotal,
      propinaMonto,
      metodoPago
    );

    // Guardar para pantalla de recibo
    setUltimoCobro({
      mesaNumero: activeMesa.numero,
      subtotal,
      propina: propinaMonto,
      total,
      metodo: metodoPago
    });

    // Resetear
    setMesaIdSel('');
    setPropinaSel(10);
    setPropinaPersonalizada('');
    setMetodoPago('Efectivo');
  };

  return (
    <div className="space-y-6" id="cobros-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            CAJA Y FACTURACIÓN
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Líquida consumos parciales o totales de mesas en servicio y despacha comprobantes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lado izquierdo: Mesas con cuentas pendientes */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md xl:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-805/60">Cuentas por Cobrar</h3>

          {/* Recibo digital anterior si existe para dar feedback estético */}
          {ultimoCobro && (
            <div className="bg-[#121212] p-4 rounded-xl border border-emerald-900/40 text-xs text-emerald-450 space-y-2 animate-fade-in relative overflow-hidden">
              <div className="absolute right-2 top-2">
                <Receipt className="w-8 h-8 text-emerald-900/20 opacity-40 shrink-0" />
              </div>
              <h4 className="font-bold uppercase tracking-wider text-emerald-400">Último Pago Procesado</h4>
              <p className="font-mono text-[10.5px]">Mesa {ultimoCobro.mesaNumero} finalizada con éxito.</p>
              <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                <span>Subtotal: ${ultimoCobro.subtotal.toFixed(2)}</span>
                <span>Propina: ${ultimoCobro.propina.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-zinc-850 text-emerald-400">
                <span>Total Cobrado:</span>
                <span>${ultimoCobro.total.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => setUltimoCobro(null)}
                className="text-[9.5px] uppercase font-bold text-zinc-500 hover:text-zinc-300 underline mt-1.5 inline-block cursor-pointer"
              >
                Cerrar Comprobante
              </button>
            </div>
          )}

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {comandasCobrar.length === 0 ? (
              <div className="py-12 text-center text-zinc-555 text-xs font-mono">
                No hay mesas activas comandadas para cobrar en este turno.
              </div>
            ) : (
              comandasCobrar.map(c => {
                const mesa = mesas.find(m => m.id === c.mesaId);
                const mesaSubtotal = c.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
                
                return (
                  <div 
                    key={c.id}
                    onClick={() => {
                      setMesaIdSel(c.mesaId);
                      setUltimoCobro(null); // Quitar el recibo al elegir otra cuenta
                    }}
                    className={`p-4 border rounded-xl transition-all duration-150 cursor-pointer flex justify-between items-center ${
                      mesaIdSel === c.mesaId 
                        ? 'border-emerald-500 bg-zinc-800 shadow-sm' 
                        : 'border-zinc-800 hover:border-zinc-700 bg-[#121212]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          mesa?.estado === 'Cuenta Solicitada' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                        }`}></span>
                        <h4 className="font-bold text-xs text-zinc-150">
                          Mesa {mesa?.numero} &mdash; {c.clienteNombre}
                        </h4>
                      </div>
                      <p className="text-[10px] text-zinc-450 mt-1.5 font-medium">
                        {c.items.length} Items &bull; Estado: <span className="text-emerald-400">{mesa?.estado}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Subtotal:</span>
                      <span className="text-xs font-black text-rose-455 font-mono">${mesaSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Lado derecho: Boleta de calculo y cobro */}
        <div className="xl:col-span-7">
          {activeComanda && activeMesa ? (
            <form onSubmit={handleCompletarCobro} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-805/60 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center">
                  <Printer className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Ticket de Cobro: Mesa {activeMesa?.numero} ({activeComanda.clienteNombre})
                </h3>
                <span className="text-[9px] text-zinc-500 font-mono">Orden: {activeComanda.id.slice(0, 8)}</span>
              </div>

              {/* Detalle items */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Alimentos & Bebidas</span>
                <div className="divide-y divide-zinc-850 border-y border-zinc-850 max-h-[160px] overflow-y-auto pr-1">
                  {activeComanda.items.map((it, i) => (
                    <div key={i} className="py-2.5 flex justify-between text-xs text-zinc-400">
                      <span>{it.cantidad}x &bull; {it.nombre}</span>
                      <span className="font-bold text-zinc-300 font-mono">${(it.cantidad * it.precioUnitario).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Elección de Propina */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest flex items-center">
                  <Percent className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Propina de Servicio
                </label>
                
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15].map(porc => (
                    <button
                      type="button"
                      key={porc}
                      onClick={() => {
                        setPropinaSel(porc);
                        setPropinaPersonalizada('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        propinaSel === porc 
                          ? 'bg-emerald-900/60 text-emerald-400 border-emerald-800/65 shadow-inner' 
                          : 'bg-zinc-800 text-zinc-400 border-transparent hover:bg-zinc-750'
                      }`}
                    >
                      {porc}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPropinaSel(-1)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      propinaSel === -1
                        ? 'bg-emerald-940 text-emerald-400 border-emerald-805'
                        : 'bg-zinc-800 text-zinc-400 border-transparent hover:bg-zinc-750'
                    }`}
                  >
                    Otro %
                  </button>
                </div>

                {propinaSel === -1 && (
                  <div className="pt-2 animate-fade-in">
                    <input
                      type="number"
                      placeholder="Ingresa porcentaje personalizado..."
                      value={propinaPersonalizada}
                      onChange={e => setPropinaPersonalizada(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-850 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Elección de Método de Pago */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest">Método de Captura</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetodoPago('Efectivo')}
                    className={`py-2.5 text-xs font-bold rounded-lg border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                      metodoPago === 'Efectivo' 
                        ? 'bg-emerald-950/40 text-emerald-450 border-emerald-800' 
                        : 'bg-[#18181A] text-zinc-400 border-zinc-805 hover:bg-zinc-800'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="tracking-wider uppercase text-[9px]">Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('Tarjeta')}
                    className={`py-2.5 text-xs font-bold rounded-lg border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                      metodoPago === 'Tarjeta' 
                        ? 'bg-sky-955/30 text-sky-400 border-sky-850' 
                        : 'bg-[#18181A] text-zinc-400 border-zinc-805 hover:bg-zinc-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="tracking-wider uppercase text-[9px]">Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('Transferencia')}
                    className={`py-2.5 text-xs font-bold rounded-lg border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                      metodoPago === 'Transferencia' 
                        ? 'bg-amber-955/40 text-amber-400 border-amber-850' 
                        : 'bg-[#18181A] text-zinc-400 border-zinc-805 hover:bg-zinc-800'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span className="tracking-wider uppercase text-[9px]">Transf.</span>
                  </button>
                </div>
              </div>

              {/* Resumen Final de Cobro */}
              <div className="bg-[#121212] p-4 rounded-xl space-y-2.5 border border-zinc-850">
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>Subtotal Consumo:</span>
                  <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>Servicio / Propina ({propinaPorcentaje}%):</span>
                  <span className="font-mono font-semibold">${propinaMonto.toFixed(2)}</span>
                </div>
                <hr className="border-zinc-855" />
                <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                  <span>TOTAL CUENTA:</span>
                  <span className="text-sm font-extrabold text-rose-400 font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Boton Cobrar */}
              <button
                type="submit"
                className="w-full bg-emerald-650 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-550 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/20 uppercase tracking-wider"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Cerrar Cuenta y Archivar</span>
              </button>
            </form>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 flex flex-col items-center justify-center space-y-2 p-12 text-center text-zinc-500 animate-fade-in-slow">
              <Receipt className="w-9 h-9 opacity-30 text-zinc-550 mb-2" />
              <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest">Liquidación y Boleta</h3>
              <p className="text-xs text-zinc-550 max-w-xs mt-1 font-medium">Elige una mesa con cuenta activa de la lista izquierda para procesar el desglose de su ticket.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
