import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Platillo, CategoriaPlatillo } from '../types';
import { Search, Trash2, Edit } from 'lucide-react';

export const PlatillosPanel: React.FC = () => {
  const { menu, agregarPlatillo, actualizarPlatillo, eliminarPlatillo } = useRestaurant();

  // Estados Formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number>(0);
  const [categoria, setCategoria] = useState<CategoriaPlatillo>('Platos Fuertes');
  const [disponible, setDisponible] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  // Estados visuales/Filtro
  const [buscar, setBuscar] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || precio <= 0) return;

    if (editId) {
      actualizarPlatillo(editId, { nombre, descripcion, precio, categoria, disponible });
      setEditId(null);
    } else {
      agregarPlatillo({ nombre, descripcion, precio, categoria, disponible });
    }

    // Reset Form
    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setCategoria('Platos Fuertes');
    setDisponible(true);
  };

  const iniciarEdicion = (p: Platillo) => {
    setEditId(p.id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setPrecio(p.precio);
    setCategoria(p.categoria);
    setDisponible(p.disponible);
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setCategoria('Platos Fuertes');
    setDisponible(true);
  };

  const toggleDisponibilidad = (id: string, disp: boolean) => {
    actualizarPlatillo(id, { disponible: !disp });
  };

  // Filtrado de Platillos
  const platillosFiltrados = menu.filter(p => {
    const cumpleBuscar = p.nombre.toLowerCase().includes(buscar.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(buscar.toLowerCase());
    const cumpleCat = categoriaSeleccionada === 'Todos' || p.categoria === categoriaSeleccionada;
    return cumpleBuscar && cumpleCat;
  });

  return (
    <div className="space-y-6" id="platillos-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            CARTA Y MENÚ
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Gestión del menú gastronómico, precios de venta y disponibilidad KDS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 mb-4 flex items-center">
            {editId ? 'Editar Item' : 'Ingresar Platillo'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Nombre Comercial</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej. Tacos al Pastor Deluxe"
                className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Precio de Venta ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={precio || ''}
                  onChange={e => setPrecio(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium animate-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Categoría</label>
                <select
                  value={categoria}
                  onChange={e => setCategoria(e.target.value as CategoriaPlatillo)}
                  className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                >
                  <option value="Entradas" className="bg-zinc-900">Entradas</option>
                  <option value="Platos Fuertes" className="bg-zinc-900">Platos Fuertes</option>
                  <option value="Postres" className="bg-zinc-900">Postres</option>
                  <option value="Bebidas" className="bg-zinc-900">Bebidas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Descripción gastronómica / Receta</label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Ej. Suprema salsa de chipotle con finas hierbas..."
                rows={3}
                className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="menu-disp"
                checked={disponible}
                onChange={e => setDisponible(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="menu-disp" className="text-xs font-semibold text-zinc-400 cursor-pointer select-none">
                Disponible para comanda inmediata
              </label>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-650 text-white py-2 text-xs rounded-lg font-bold hover:bg-emerald-550 transition shadow-md uppercase tracking-wide cursor-pointer"
              >
                {editId ? 'Guardar Cambios' : 'Ingresar'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-3.5 py-2 bg-zinc-800 text-zinc-305 rounded-lg font-semibold hover:bg-zinc-750 transition"
                >
                  Regresar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado de Platillos */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md lg:col-span-2 space-y-4">
          {/* Barra de Búsqueda y Filtro Rápido */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center pb-2 border-b border-zinc-805/50">
            {/* Buscador */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Buscar platillo..."
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                className="w-full pl-8 pr-3.5 py-1.2 text-xs bg-[#1A1A1A] border border-zinc-800/80 rounded-full text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap gap-1">
              {['Todos', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    categoriaSeleccionada === cat 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-9900/50 shadow-inner' 
                      : 'bg-zinc-805 text-zinc-450 border border-transparent hover:bg-zinc-750 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Platillos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {platillosFiltrados.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 col-span-2">
                <p className="text-xs font-semibold">No se encontraron productos en esta categoría.</p>
              </div>
            ) : (
              platillosFiltrados.map(p => (
                <div 
                  key={p.id} 
                  className={`p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                    p.disponible 
                      ? 'bg-[#121212] border-zinc-800 shadow-sm hover:border-zinc-700' 
                      : 'bg-zinc-950/50 border-zinc-900 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/50 tracking-wider">
                        {p.categoria}
                      </span>
                      <span className="text-xs font-black text-rose-400 font-mono">
                        ${p.precio.toFixed(2)}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-zinc-100 mt-2">{p.nombre}</h4>
                    {p.descripcion && (
                      <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2" title={p.descripcion}>
                        {p.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-850 mt-3 pt-3">
                    <button
                      onClick={() => toggleDisponibilidad(p.id, p.disponible)}
                      className={`text-[9px] font-bold tracking-wider uppercase flex items-center cursor-pointer ${
                        p.disponible ? 'text-emerald-400' : 'text-zinc-550'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${p.disponible ? 'bg-emerald-500' : 'bg-zinc-650'}`}></span>
                      {p.disponible ? 'Disponible' : 'Agotado'}
                    </button>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => iniciarEdicion(p)}
                        className="p-1 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800/80 rounded transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => eliminarPlatillo(p.id)}
                        className="p-1 text-zinc-505 hover:text-rose-450 hover:bg-zinc-800/80 rounded transition-all cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
