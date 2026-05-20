import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { DashboardOverview } from './components/DashboardOverview';
import { PersonalPanel } from './components/PersonalPanel';
import { ClientesPanel } from './components/ClientesPanel';
import { PlatillosPanel } from './components/PlatillosPanel';
import { ComandasPanel } from './components/ComandasPanel';
import { ChefsPanel } from './components/ChefsPanel';
import { CobrosPanel } from './components/CobrosPanel';
import { VentasPanel } from './components/VentasPanel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  UtensilsCrossed, 
  MenuSquare, 
  BookOpen, 
  Clock, 
  DollarSign, 
  UserSquare2,
  ChefHat,
  Monitor
} from 'lucide-react';

type TabActivo = 'resumen' | 'personal' | 'mesas' | 'menu' | 'comanda' | 'cocina' | 'cobro' | 'ventas';

function LoginScreen() {
  const { login } = useRestaurant();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!usuario.trim() || !password.trim()) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    const res = login(usuario.trim(), password.trim());
    if (!res.success) {
      setError(res.error || 'Credenciales incorrectas');
    }
  };

  const loginDirecto = (usr: string, pass: string) => {
    setError(null);
    const res = login(usr, pass);
    if (!res.success) {
      setError(res.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] px-4 font-sans select-none" id="login-screen">
      <div className="max-w-md w-full space-y-6 bg-[#121212] border border-zinc-800 p-8 rounded-2xl shadow-xl transition-all duration-300">
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-950/25">
            L
          </div>
          <h2 className="text-lg font-black tracking-tight text-zinc-100 uppercase">L'ESSENCE BISTRÓ</h2>
          <p className="text-[10.5px] text-zinc-500 font-bold uppercase tracking-widest">Control Operativo de Personal</p>
        </div>

        {error && (
          <div className="p-3 text-xs font-bold text-rose-400 bg-rose-955/20 border border-rose-900/45 rounded-lg text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Usuario de Acceso</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Ej. carlos"
              className="w-full px-3.5 py-2.5 bg-[#171717] border border-zinc-800 text-zinc-150 rounded-lg text-xs font-medium placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-1.5">Contraseña / PIN</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 bg-[#171717] border border-zinc-800 text-zinc-150 rounded-lg text-xs font-medium placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-650 hover:bg-emerald-555 text-white font-bold py-2.5 text-xs rounded-lg transition-all shadow-md shadow-emerald-950/40 uppercase tracking-wider cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="border-t border-zinc-850 pt-5 space-y-3">
          <h4 className="text-[10px] text-center font-bold text-zinc-500 uppercase tracking-widest">Acceso Rápido (Pruebas)</h4>
          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
            <button
              onClick={() => loginDirecto('admin', '123')}
              className="p-2.5 bg-[#161616]/70 text-zinc-300 rounded-lg border border-zinc-800 hover:border-amber-900/40 hover:bg-zinc-800 hover:text-white transition text-left space-y-0.5 cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-amber-500 font-sans text-[10px] uppercase tracking-wider">Administrador</span>
              <span className="text-[9.5px] text-zinc-500 font-mono">admin / 123</span>
            </button>
            <button
              onClick={() => loginDirecto('carlos', '123')}
              className="p-2.5 bg-[#161616]/70 text-zinc-300 rounded-lg border border-zinc-800 hover:border-emerald-900/40 hover:bg-zinc-800 hover:text-white transition text-left space-y-0.5 cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-emerald-400 font-sans text-[10px] uppercase tracking-wider">Mesero (Carlos)</span>
              <span className="text-[9.5px] text-zinc-500 font-mono">carlos / 123</span>
            </button>
            <button
              onClick={() => loginDirecto('sofia', '123')}
              className="p-2.5 bg-[#161616]/70 text-zinc-300 rounded-lg border border-zinc-800 hover:border-[#38bdf8]/40 hover:bg-zinc-800 hover:text-white transition text-left space-y-0.5 cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-[#38bdf8] font-sans text-[10px] uppercase tracking-wider">Mesera (Sofía)</span>
              <span className="text-[9.5px] text-zinc-500 font-mono">sofia / 123</span>
            </button>
            <button
              onClick={() => loginDirecto('alejandro', '123')}
              className="p-2.5 bg-[#161616]/70 text-zinc-300 rounded-lg border border-zinc-800 hover:border-purple-900/40 hover:bg-zinc-800 hover:text-white transition text-left space-y-0.5 cursor-pointer flex flex-col justify-between"
            >
              <span className="font-bold text-purple-400 font-sans text-[10px] uppercase tracking-wider">Cocinero (Alejandro)</span>
              <span className="text-[9.5px] text-zinc-500 font-mono">alejandro / 123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { usuarioActual, logout } = useRestaurant();
  const [tab, setTab] = useState<TabActivo>('resumen');

  const menuNavItems = [
    { id: 'resumen', label: 'Resumen Diario', icon: Monitor, roles: ['Administrador', 'Cajero'] },
    { id: 'personal', label: 'Personal', icon: Users, roles: ['Administrador'] },
    { id: 'mesas', label: 'Salón y Mesas', icon: UtensilsCrossed, roles: ['Administrador', 'Mesero'] },
    { id: 'menu', label: 'Carta / Menú', icon: MenuSquare, roles: ['Administrador'] },
    { id: 'comanda', label: 'Tomar Pedido', icon: BookOpen, roles: ['Administrador', 'Mesero'] },
    { id: 'cocina', label: 'Cocina & KDS', icon: ChefHat, roles: ['Administrador', 'Chef'] },
    { id: 'cobro', label: 'Cerrar Cuenta', icon: DollarSign, roles: ['Administrador', 'Mesero', 'Cajero'] },
    { id: 'ventas', label: 'Historial Ventas', icon: BarChart3, roles: ['Administrador', 'Cajero'] },
  ] as const;

  // Filtrar pestañas autorizadas según el rol del usuario autenticado
  const visibleNavItems = menuNavItems.filter(item => {
    if (!usuarioActual) return false;
    return item.roles.includes(usuarioActual.rol);
  });

  // Asegurar que comience en una pestaña autorizada al iniciar sesión
  useEffect(() => {
    if (usuarioActual) {
      if (usuarioActual.rol === 'Mesero') {
        setTab('comanda');
      } else if (usuarioActual.rol === 'Chef') {
        setTab('cocina');
      } else if (visibleNavItems.length > 0) {
        setTab(visibleNavItems[0].id);
      }
    }
  }, [usuarioActual]);

  if (!usuarioActual) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col md:flex-row font-sans" id="app-container">
      {/* Sidebar de navegación */}
      <aside className="w-full md:w-64 bg-[#141414] text-zinc-300 flex flex-col justify-between border-r border-zinc-800" id="sidebar-aside">
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
              L
            </div>
            <div>
              <h1 className="font-extrabold text-xs text-zinc-100 tracking-wider uppercase">L'ESSENCE BISTRÓ</h1>
              <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">SISTEMA CONTROL</p>
            </div>
          </div>

          {/* Menú de pestañas */}
          <nav className="p-3 space-y-1">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const activo = tab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                    activo 
                      ? 'bg-zinc-800 text-emerald-400 shadow-inner' 
                      : 'text-zinc-400 hover:bg-gradient-to-r hover:from-zinc-800/40 hover:to-transparent hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activo ? 'text-emerald-450' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info de sesión */}
        <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-2.5">
          <div className="space-y-0.5">
            <p className="flex items-center">
              <UserSquare2 className="w-3.5 h-3.5 mr-1.5 opacity-60 text-emerald-500" />
              Usuario: <strong className="ml-1 text-zinc-350 truncate">{usuarioActual.nombre}</strong>
            </p>
            <p className="text-[9px] text-emerald-500 font-black tracking-wider uppercase ml-5">{usuarioActual.rol}</p>
          </div>
          
          <button
            onClick={logout}
            className="w-full bg-zinc-800 hover:bg-rose-955/30 hover:text-rose-400 hover:border-rose-900/40 text-zinc-400 py-1.5 px-2 rounded-md text-[9px] uppercase font-bold tracking-widest border border-transparent transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Cerrar Sesión
          </button>
          
          <p className="tracking-widest text-[8.5px] text-zinc-650 pt-1 border-t border-zinc-850/60">L'ESSENCE S.C. v2.1.0-A</p>
        </div>
      </aside>

      {/* Contenido Principal con animación */}
      <main className="flex-1 p-6 overflow-hidden md:max-h-screen md:overflow-y-auto" id="main-content">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              {tab === 'resumen' && <DashboardOverview />}
              {tab === 'personal' && <PersonalPanel />}
              {tab === 'mesas' && <ClientesPanel />}
              {tab === 'menu' && <PlatillosPanel />}
              {tab === 'comanda' && <ComandasPanel />}
              {tab === 'cocina' && <ChefsPanel />}
              {tab === 'cobro' && <CobrosPanel />}
              {tab === 'ventas' && <VentasPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainApp />
    </RestaurantProvider>
  );
}
