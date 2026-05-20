import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Bookmark, TrendingUp, Calendar, ShoppingBag } from 'lucide-react';

export const VentasPanel: React.FC = () => {
  const { ventas } = useRestaurant();

  // Estados visuales
  const [buscarCliente, setBuscarCliente] = useState('');

  // Análisis de Datos de Venta
  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const totalSubtotal = ventas.reduce((sum, v) => sum + v.subtotal, 0);
  const totalPropina = ventas.reduce((sum, v) => sum + v.propina, 0);
  const cantidadTransacciones = ventas.length;
  const ticketPromedio = cantidadTransacciones > 0 ? (totalSubtotal / cantidadTransacciones) : 0;

  // Ventas por método de pago
  const ventasEfectivo = ventas.filter(v => v.metodoPago === 'Efectivo').length;
  const ventasTarjeta = ventas.filter(v => v.metodoPago === 'Tarjeta').length;
  const ventasTraspaso = ventas.filter(v => v.metodoPago === 'Transferencia').length;

  // Desglosar platillos comprados para obtener los más populares
  const contadorPlatillos: { [nombre: string]: number } = {};
  ventas.forEach(v => {
    v.items.forEach(item => {
      contadorPlatillos[item.nombre] = (contadorPlatillos[item.nombre] || 0) + item.cantidad;
    });
  });

  const platillosMasPopulares = Object.entries(contadorPlatillos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5 mas vendidos

  const maxVendidoContador = platillosMasPopulares.length > 0 ? platillosMasPopulares[0][1] : 1;

  // Filtrado de Ventas en Tabla
  const ventasFiltradas = ventas.filter(v => 
    v.clienteNombre.toLowerCase().includes(buscarCliente.toLowerCase())
  );

  return (
    <div className="space-y-6" id="ventas-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            HISTORIAL DE VENTAS Y CAJA
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Auditoría financiera, ticket de ventas históricas y métricas de popularidad del menú.</p>
        </div>
      </div>

      {/* Tarjetas de Métricas de Venta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-805 shadow-md">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Caja Recaudada</span>
            <TrendingUp className="w-4 h-4 text-emerald-450" />
          </div>
          <h3 className="text-lg font-black text-zinc-100 mt-2 font-mono">${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Consumo total + propina</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-805 shadow-md">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ventas Netas</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <h3 className="text-lg font-black text-zinc-100 mt-2 font-mono">${totalSubtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Consumo neto de comensales</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-805 shadow-md">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ticket Promedio</span>
            <Bookmark className="w-4 h-4 text-zinc-400" />
          </div>
          <h3 className="text-lg font-black text-zinc-100 mt-2 font-mono">${ticketPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Suma neta por transacción</p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-805 shadow-md">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Transacciones</span>
            <Calendar className="w-4 h-4 text-zinc-400" />
          </div>
          <h3 className="text-lg font-black text-zinc-100 mt-2 font-mono">{cantidadTransacciones} Órdenes</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Cierres de cuentas exitosos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico/Histograma del Menú Popular (4 cols) */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-5 pb-2 border-b border-zinc-805/60">Platillos más Vendidos</h3>
            
            <div className="space-y-4">
              {platillosMasPopulares.length === 0 ? (
                <p className="text-center text-xs text-zinc-500 py-12 font-mono">Sin suficientes datos histórico de despachos.</p>
              ) : (
                platillosMasPopulares.map(([nombre, cantidad], index) => {
                  const anchoPorc = Math.max(10, Math.min(100, (cantidad / maxVendidoContador) * 100));
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-zinc-300 truncate max-w-[80%] font-bold">{nombre}</span>
                        <span className="text-zinc-500 font-bold font-mono">{cantidad} u.</span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${anchoPorc}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Glosario de caja */}
          <div className="border-t border-zinc-800/80 pt-4 mt-6">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Métodos de Cobro</h4>
            <div className="flex justify-between text-center divide-x divide-zinc-850">
              <div className="flex-1">
                <span className="text-sm font-black text-zinc-200 block font-mono">{ventasEfectivo}</span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Efectivo</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-black text-zinc-200 block font-mono">{ventasTarjeta}</span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Tarjeta</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-black text-zinc-200 block font-mono">{ventasTraspaso}</span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Transf.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Ventas Detalladas (8 cols) */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-2 border-b border-zinc-805/60 gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Cierre de Caja Diario</h3>
              <input
                type="text"
                placeholder="Buscar por cliente/comensal..."
                value={buscarCliente}
                onChange={e => setBuscarCliente(e.target.value)}
                className="px-3.5 py-1 text-xs bg-[#1A1A1A] text-zinc-100 rounded-full border border-zinc-800 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48 font-medium"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2.5">Código Único</th>
                    <th className="py-2.5">Cliente</th>
                    <th className="py-2.5">Mesa</th>
                    <th className="py-2.5">Método</th>
                    <th className="py-2.5">Subtotal</th>
                    <th className="py-2.5 text-right">Monto Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {ventasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-550 font-mono">Sin historial de boletas correspondientes en la búsqueda.</td>
                    </tr>
                  ) : (
                    ventasFiltradas.map(venta => (
                      <tr key={venta.id} className="hover:bg-zinc-850/15 transition-colors">
                        <td className="py-3 text-zinc-500 font-mono text-[9px]">{venta.id.slice(0, 8)}</td>
                        <td className="py-3 font-bold text-zinc-200">{venta.clienteNombre}</td>
                        <td className="py-3 text-zinc-400 font-medium">Mesa {venta.mesaNumero}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                            venta.metodoPago === 'Efectivo' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                            venta.metodoPago === 'Tarjeta' ? 'bg-sky-955/20 text-sky-400 border-sky-900/30' : 
                            'bg-amber-955/20 text-amber-400 border-amber-900/30'
                          }`}>
                            {venta.metodoPago}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-450 font-mono font-semibold">${venta.subtotal.toFixed(2)}</td>
                        <td className="py-3 text-right font-black text-rose-400 font-mono">${venta.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
