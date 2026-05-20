import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { RolPersonal, EstadoPersonal, Personal } from '../types';
import { UserPlus, Edit2, Trash2, Phone, Shield, Power } from 'lucide-react';

export const PersonalPanel: React.FC = () => {
  const { personal, agregarPersonal, actualizarPersonal, eliminarPersonal } = useRestaurant();
  
  // Estado para el formulario de nuevo personal
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<RolPersonal>('Mesero');
  const [estado, setEstado] = useState<EstadoPersonal>('Activo');
  const [telefono, setTelefono] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // Estados de filtro
  const [filtroRol, setFiltroRol] = useState<string>('Todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editId) {
      actualizarPersonal(editId, { nombre, rol, estado, telefono, usuario: usuario.trim(), password: password.trim() });
      setEditId(null);
    } else {
      agregarPersonal({ nombre, rol, estado, telefono, usuario: usuario.trim(), password: password.trim() });
    }

    // Resetear formulario
    setNombre('');
    setRol('Mesero');
    setEstado('Activo');
    setTelefono('');
    setUsuario('');
    setPassword('');
  };

  const handleEdit = (p: Personal) => {
    setEditId(p.id);
    setNombre(p.nombre);
    setRol(p.rol);
    setEstado(p.estado);
    setTelefono(p.telefono);
    setUsuario(p.usuario || '');
    setPassword(p.password || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setNombre('');
    setRol('Mesero');
    setEstado('Activo');
    setTelefono('');
    setUsuario('');
    setPassword('');
  };

  const toggleEstadoRapido = (id: string, estadoActual: EstadoPersonal) => {
    const nuevoEstado: EstadoPersonal = 
      estadoActual === 'En Turno' ? 'Activo' : 
      estadoActual === 'Activo' ? 'Inactivo' : 'En Turno';
    actualizarPersonal(id, { estado: nuevoEstado });
  };

  const filtrados = personal.filter(p => filtroRol === 'Todos' || p.rol === filtroRol);

  return (
    <div className="space-y-6" id="personal-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-850">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
            PLANTILLA DE PERSONAL
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Gobernanza de meseros, chefs, cajeros y personal administrativo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Registro / Edicion */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-md h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-450" />
            {editId ? 'Editar Colaborador' : 'Registrar Colaborador'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Nombre Completo</label>
              <input
                id="staff-name-input"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Rol / Puesto</label>
                <select
                  id="staff-role-select"
                  value={rol}
                  onChange={e => setRol(e.target.value as RolPersonal)}
                  className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Mesero" className="bg-zinc-900">Mesero</option>
                  <option value="Chef" className="bg-zinc-900">Chef / Cocina</option>
                  <option value="Cajero" className="bg-zinc-900">Cajero</option>
                  <option value="Administrador" className="bg-zinc-900">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Estado Inicial</label>
                <select
                  id="staff-status-select"
                  value={estado}
                  onChange={e => setEstado(e.target.value as EstadoPersonal)}
                  className="w-full px-3 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
                >
                  <option value="Activo" className="bg-zinc-900">Activo</option>
                  <option value="En Turno" className="bg-zinc-900">En Turno</option>
                  <option value="Inactivo" className="bg-zinc-900">Inactivo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Teléfono de Contacto</label>
              <input
                id="staff-phone-input"
                type="tel"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                placeholder="Ej. 55 1234 5678"
                className="w-full px-3.5 py-2 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div className="border-t border-zinc-800/85 pt-3.5 mt-2 space-y-3">
              <span className="block text-[10px] font-bold text-emerald-550 uppercase tracking-widest">Acceso al Sistema</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Nombre de Usuario</label>
                  <input
                    id="staff-username-input"
                    type="text"
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)}
                    placeholder="Ej. carlos.m"
                    className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Contraseña o PIN</label>
                  <input
                    id="staff-password-input"
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Ej. 1234"
                    className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-zinc-100 rounded-lg border border-zinc-800 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                id="staff-submit-btn"
                type="submit"
                className="flex-1 bg-emerald-650 text-white py-2 text-xs rounded-lg font-bold hover:bg-emerald-550 transition-all cursor-pointer shadow-lg shadow-emerald-950/20 uppercase tracking-wider"
              >
                {editId ? 'Guardar Cambios' : 'Registrar'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-3 py-2 text-xs bg-zinc-800 text-zinc-300 rounded-lg font-semibold hover:bg-zinc-755 transition-all"
                >
                  Regresar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Colaboradores */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-md lg:col-span-2">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-2 border-b border-zinc-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Directorio de Empleados</h3>
            <div className="flex flex-wrap gap-1">
              {['Todos', 'Mesero', 'Chef', 'Cajero', 'Administrador'].map(r => (
                <button
                  key={r}
                  onClick={() => setFiltroRol(r)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                    filtroRol === r 
                      ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-800/50 shadow-inner' 
                      : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-750 hover:text-zinc-200'
                  }`}
                >
                  {r === 'Chef' ? 'Chefs' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-850 max-h-[480px] overflow-y-auto pr-1">
            {filtrados.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <p className="text-xs font-medium">No se encontraron colaboradores en este rol.</p>
              </div>
            ) : (
              filtrados.map(p => (
                <div key={p.id} className="py-3.5 flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-full border ${
                      p.role === 'Admin' || p.rol === 'Administrador' ? 'bg-amber-950/10 text-amber-400 border-amber-900/40' :
                      p.rol === 'Chef' ? 'bg-sky-950/10 text-sky-400 border-sky-900/40' :
                      p.rol === 'Mesero' ? 'bg-teal-950/10 text-teal-400 border-teal-900/40' :
                      'bg-emerald-950/10 text-emerald-400 border-emerald-900/40'
                    }`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-100">{p.nombre}</h4>
                      <div className="flex items-center flex-wrap gap-2 mt-1.5 text-[10px] text-zinc-500">
                        <span className="font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                          {p.rol}
                        </span>
                        {p.telefono && (
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-emerald-500/80" />
                            {p.telefono}
                          </span>
                        )}
                        {p.usuario && (
                          <span className="inline-flex items-center text-[9px] font-mono text-emerald-400 bg-emerald-950/25 px-2 py-0.5 rounded border border-emerald-900/35">
                            Usuario: {p.usuario} ({p.password})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Boton estado rápido */}
                    <button
                      onClick={() => toggleEstadoRapido(p.id, p.estado)}
                      className={`inline-flex items-center px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full cursor-pointer border transition-all ${
                        p.estado === 'En Turno' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-905/70' :
                        p.estado === 'Activo' ? 'bg-zinc-800 text-zinc-300 border-zinc-700/60' :
                        'bg-zinc-900/50 text-zinc-505 border-zinc-805/50 opacity-60'
                      }`}
                      title="Haz clic para cambiar estado de turno"
                    >
                      <Power className="w-2.5 h-2.5 mr-1" />
                      {p.estado}
                    </button>

                    <div className="flex space-x-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1 text-zinc-400 hover:text-emerald-400 rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => eliminarPersonal(p.id)}
                        className="p-1 text-zinc-404 hover:text-rose-455 rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
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
