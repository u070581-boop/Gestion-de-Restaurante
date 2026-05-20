import React, { createContext, useContext, useState, useEffect } from 'react';
import { Personal, Mesa, Platillo, Comanda, Venta, EstadoComanda, EstadoMesa, MetodoPago, RolPersonal } from '../types';

interface RestaurantContextType {
  personal: Personal[];
  mesas: Mesa[];
  menu: Platillo[];
  comandas: Comanda[];
  ventas: Venta[];
  usuarioActual: Personal | null;

  // Auth Actions
  login: (usuario: string, contrasena: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Personal Actions
  agregarPersonal: (empleado: Omit<Personal, 'id'>) => void;
  actualizarPersonal: (id: string, empleado: Partial<Personal>) => void;
  eliminarPersonal: (id: string) => void;

  // Mesas Actions
  agregarMesa: (mesa: Omit<Mesa, 'id' | 'estado'>) => void;
  actualizarMesa: (id: string, mesa: Partial<Mesa>) => void;
  liberarMesa: (id: string) => void;
  asignarClienteMesa: (id: string, clienteNombre: string, meseroId: string) => void;

  // Menu Actions
  agregarPlatillo: (platillo: Omit<Platillo, 'id'>) => void;
  actualizarPlatillo: (id: string, platillo: Partial<Platillo>) => void;
  eliminarPlatillo: (id: string) => void;

  // Comandas Actions
  crearComanda: (mesaId: string, clienteNombre: string, meseroId: string, items: { platilloId: string; cantidad: number; notas?: string }[], notasOpcionales?: string) => string;
  actualizarEstadoComanda: (id: string, estado: EstadoComanda, chefId?: string) => void;
  eliminarComanda: (id: string) => void;

  // Cobros / Ventas Actions
  procesarCobro: (mesaId: string, comandaId: string, subtotal: number, propina: number, metodoPago: MetodoPago) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const INITIAL_PERSONAL: Personal[] = [
  { id: 'admin', nombre: 'Admin Luis', rol: 'Administrador', estado: 'En Turno', telefono: '55 9999 9999', usuario: 'admin', password: '123' },
  { id: 'p1', nombre: 'Carlos Mendoza', rol: 'Mesero', estado: 'En Turno', telefono: '55 1234 5678', usuario: 'carlos', password: '123' },
  { id: 'p2', nombre: 'Sofía Ramos', rol: 'Mesero', estado: 'En Turno', telefono: '55 2345 6789', usuario: 'sofia', password: '123' },
  { id: 'p3', nombre: 'Chef Alejandro Ruíz', rol: 'Chef', estado: 'En Turno', telefono: '55 3456 7890', usuario: 'alejandro', password: '123' },
  { id: 'p4', nombre: 'Elena Gómez (Ayudante)', rol: 'Chef', estado: 'Activo', telefono: '55 4567 8901' },
  { id: 'p5', nombre: 'Mateo López', rol: 'Cajero', estado: 'En Turno', telefono: '55 5678 9012' }
];

const INITIAL_MESAS: Mesa[] = [
  { id: 'm1', numero: 1, capacidad: 4, estado: 'Ocupada', clienteNombre: 'Familia Ramírez', meseroId: 'p1' },
  { id: 'm2', numero: 2, capacidad: 2, estado: 'Libre' },
  { id: 'm3', numero: 3, capacidad: 6, estado: 'Cuenta Solicitada', clienteNombre: 'Grupo Lic. Valenzuela', meseroId: 'p2' },
  { id: 'm4', numero: 4, capacidad: 2, estado: 'Libre' },
  { id: 'm5', numero: 5, capacidad: 8, estado: 'Esperando', clienteNombre: 'Cumpleaños Laura', meseroId: 'p1' },
  { id: 'm6', numero: 6, capacidad: 4, estado: 'Libre' },
  { id: 'm7', numero: 7, capacidad: 4, estado: 'Libre' },
  { id: 'm8', numero: 8, capacidad: 10, estado: 'Libre' }
];

const INITIAL_MENU: Platillo[] = [
  { id: 'd1', nombre: 'Chilaquiles con Pollo', descripcion: 'Totopos bañados en salsa verde o roja, crema, queso fresco y pechuga deshebrada.', precio: 145.00, categoria: 'Platos Fuertes', disponible: true },
  { id: 'd2', nombre: 'Tacos de Arrachera (3 pzs)', descripcion: 'Jugosa arrachera de res en tortilla de maíz, acompañados de cebolla asada y chiles.', precio: 180.00, categoria: 'Platos Fuertes', disponible: true },
  { id: 'd3', nombre: 'Hamburguesa de la Casa', descripcion: 'Carne Angus (180g), queso cheddar, tocino, lechuga, jitomate y aderezo especial de chipotle + papas fritas.', precio: 165.00, categoria: 'Platos Fuertes', disponible: true },
  { id: 'd4', nombre: 'Flautas de Pollo (4 pzs)', descripcion: 'Doraditas de pollo sobre lechuga, con crema, queso fresco y salsa verde cruda.', precio: 120.00, categoria: 'Platos Fuertes', disponible: true },
  { id: 'd5', nombre: 'Sopa Azteca', descripcion: 'Caldo de jitomate con tiras de tortilla frita, aguacate, queso panela, crema y chile pasilla.', precio: 95.00, categoria: 'Entradas', disponible: true },
  { id: 'd6', nombre: 'Guacamole Tradicional', descripcion: 'Aguacate machacado con pico de gallo, cilantro y totopos crujientes de maíz.', precio: 110.00, categoria: 'Entradas', disponible: true },
  { id: 'd7', nombre: 'Flan Napolitano', descripcion: 'Clásico flan cremoso horneado bañado en caramelo casero.', precio: 75.00, categoria: 'Postres', disponible: true },
  { id: 'd8', nombre: 'Pastel de Tres Leches', descripcion: 'Pastel esponjado bañado con nuestra mezcla secreta de cinco leches y frutas de temporada.', precio: 85.00, categoria: 'Postres', disponible: true },
  { id: 'd9', nombre: 'Margarita Clásica', descripcion: 'Coctel icónico de tequila, licor de naranja y jugo de limón fresco escarchado con sal.', precio: 120.00, categoria: 'Bebidas', disponible: true },
  { id: 'd10', nombre: 'Agua Fresca de Horchata (Grande)', descripcion: 'Bebida artesanal de arroz con canela y un toque de vainilla dulce.', precio: 45.00, categoria: 'Bebidas', disponible: true },
  { id: 'd11', nombre: 'Café Americano', descripcion: 'Espresso diluido con granos seleccionados de Veracruz, aromático y fresco.', precio: 38.00, categoria: 'Bebidas', disponible: true }
];

const INITIAL_COMANDAS: Comanda[] = [
  {
    id: 'c1',
    mesaId: 'm1',
    clienteNombre: 'Familia Ramírez',
    items: [
      { platilloId: 'd6', nombre: 'Guacamole Tradicional', cantidad: 1, precioUnitario: 110.00 },
      { platilloId: 'd2', nombre: 'Tacos de Arrachera (3 pzs)', cantidad: 2, precioUnitario: 180.00, notas: 'Sin cebolla' },
      { platilloId: 'd10', nombre: 'Agua Fresca de Horchata (Grande)', cantidad: 3, precioUnitario: 45.00 }
    ],
    estado: 'En Cocina',
    meseroId: 'p1',
    chefId: 'p3',
    timestamp: '2026-05-20T17:35:00Z',
    notasOpcionales: 'Servir primero el guacamole'
  },
  {
    id: 'c2',
    mesaId: 'm3',
    clienteNombre: 'Grupo Lic. Valenzuela',
    items: [
      { platilloId: 'd9', nombre: 'Margarita Clásica', cantidad: 4, precioUnitario: 120.00 },
      { platilloId: 'd3', nombre: 'Hamburguesa de la Casa', cantidad: 3, precioUnitario: 165.00, notas: 'Papas extra crujientes' },
      { platilloId: 'd8', nombre: 'Pastel de Tres Leches', cantidad: 2, precioUnitario: 85.00 }
    ],
    estado: 'Preparado',
    meseroId: 'p2',
    timestamp: '2026-05-20T17:15:00Z',
    notasOpcionales: 'Llevar copas de agua adicionales'
  },
  {
    id: 'c3',
    mesaId: 'm5',
    clienteNombre: 'Cumpleaños Laura',
    items: [
      { platilloId: 'd5', nombre: 'Sopa Azteca', cantidad: 2, precioUnitario: 95.00 },
      { platilloId: 'd1', nombre: 'Chilaquiles con Pollo', cantidad: 4, precioUnitario: 145.00, notas: 'Salsa verde' },
      { platilloId: 'd11', nombre: 'Café Americano', cantidad: 4, precioUnitario: 38.00 }
    ],
    estado: 'Pendiente',
    meseroId: 'p1',
    timestamp: '2026-05-20T17:55:00Z',
    notasOpcionales: 'Cumpleañera cumple hoy, llevar velita'
  }
];

const INITIAL_VENTAS: Venta[] = [
  {
    id: 'v1',
    comandaId: 'cx1',
    mesaNumero: 4,
    clienteNombre: 'Sonia Ruiz',
    subtotal: 310.00,
    propina: 31.00,
    total: 341.00,
    metodoPago: 'Tarjeta',
    timestamp: '2026-05-20T15:10:00Z',
    items: [
      { nombre: 'Flautas de Pollo (4 pzs)', cantidad: 1, precio: 120.00 },
      { nombre: 'Margarita Clásica', cantidad: 1, precio: 120.00 },
      { nombre: 'Flan Napolitano', cantidad: 1, precio: 75.00 }
    ]
  },
  {
    id: 'v2',
    comandaId: 'cx2',
    mesaNumero: 2,
    clienteNombre: 'Mario Casas',
    subtotal: 215.00,
    propina: 21.50,
    total: 236.50,
    metodoPago: 'Efectivo',
    timestamp: '2026-05-20T16:20:00Z',
    items: [
      { nombre: 'Hamburguesa de la Casa', cantidad: 1, precio: 165.00 },
      { nombre: 'Agua Fresca de Horchata (Grande)', cantidad: 1, precio: 45.00 }
    ]
  },
  {
    id: 'v3',
    comandaId: 'cx3',
    mesaNumero: 6,
    clienteNombre: 'Reunión Médicos',
    subtotal: 1045.00,
    propina: 150.00,
    total: 1195.00,
    metodoPago: 'Tarjeta',
    timestamp: '2026-05-20T14:30:00Z',
    items: [
      { nombre: 'Tacos de Arrachera (3 pzs)', cantidad: 4, precio: 180.00 },
      { nombre: 'Chilaquiles con Pollo', cantidad: 2, precio: 145.00 },
      { nombre: 'Café Americano', cantidad: 3, precio: 38.00 }
    ]
  }
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personal, setPersonal] = useState<Personal[]>(() => {
    const saved = localStorage.getItem('rest_personal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Personal[];
        // Validar si es necesario migrar o agregar credenciales de INITIAL_PERSONAL
        const tieneAdmin = parsed.some(p => p.id === 'admin');
        const tieneCredenciales = parsed.some(p => p.id === 'p1' && p.usuario === 'carlos');
        
        if (!tieneAdmin || !tieneCredenciales) {
          const listadoMigrado = [...parsed];
          INITIAL_PERSONAL.forEach(defecto => {
            const index = listadoMigrado.findIndex(u => u.id === defecto.id);
            if (index !== -1) {
              // Si ya existe pero no tiene credenciales, las inyectamos
              if (!listadoMigrado[index].usuario) {
                listadoMigrado[index].usuario = defecto.usuario;
              }
              if (!listadoMigrado[index].password) {
                listadoMigrado[index].password = defecto.password;
              }
            } else {
              // Si no existe (como el usuario administrador), lo agregamos
              listadoMigrado.push(defecto);
            }
          });
          return listadoMigrado;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PERSONAL;
      }
    }
    return INITIAL_PERSONAL;
  });

  const [usuarioActual, setUsuarioActual] = useState<Personal | null>(() => {
    const saved = localStorage.getItem('rest_usuario_actual');
    return saved ? JSON.parse(saved) : null;
  });

  const [mesas, setMesas] = useState<Mesa[]>(() => {
    const saved = localStorage.getItem('rest_mesas');
    return saved ? JSON.parse(saved) : INITIAL_MESAS;
  });

  const [menu, setMenu] = useState<Platillo[]>(() => {
    const saved = localStorage.getItem('rest_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [comandas, setComandas] = useState<Comanda[]>(() => {
    const saved = localStorage.getItem('rest_comandas');
    return saved ? JSON.parse(saved) : INITIAL_COMANDAS;
  });

  const [ventas, setVentas] = useState<Venta[]>(() => {
    const saved = localStorage.getItem('rest_ventas');
    return saved ? JSON.parse(saved) : INITIAL_VENTAS;
  });

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('rest_personal', JSON.stringify(personal));
    // If our current user matches a staff that was updated or deleted, sync them
    if (usuarioActual) {
      const currentInStaff = personal.find(p => p.id === usuarioActual.id);
      if (currentInStaff) {
        if (JSON.stringify(currentInStaff) !== JSON.stringify(usuarioActual)) {
          setUsuarioActual(currentInStaff);
        }
      } else {
        setUsuarioActual(null);
      }
    }
  }, [personal, usuarioActual]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('rest_usuario_actual', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('rest_usuario_actual');
    }
  }, [usuarioActual]);

  useEffect(() => {
    localStorage.setItem('rest_mesas', JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem('rest_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('rest_comandas', JSON.stringify(comandas));
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem('rest_ventas', JSON.stringify(ventas));
  }, [ventas]);

  // AUTH ACTIONS
  const login = (usuario: string, contrasena: string) => {
    const usr = personal.find(p => p.usuario?.toLowerCase() === usuario.toLowerCase() && p.password === contrasena);
    if (usr) {
      if (usr.estado === 'Inactivo') {
        return { success: false, error: 'Este empleado se encuentra inactivo.' };
      }
      setUsuarioActual(usr);
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const logout = () => {
    setUsuarioActual(null);
  };

  // PERSONAL ACTIONS
  const agregarPersonal = (empleado: Omit<Personal, 'id'>) => {
    const nuevoEmpleado: Personal = {
      ...empleado,
      id: `p_${Date.now()}`
    };
    setPersonal(prev => [...prev, nuevoEmpleado]);
  };

  const actualizarPersonal = (id: string, empleado: Partial<Personal>) => {
    setPersonal(prev => prev.map(p => p.id === id ? { ...p, ...empleado } : p));
  };

  const eliminarPersonal = (id: string) => {
    setPersonal(prev => prev.filter(p => p.id !== id));
  };

  // MESAS ACTIONS
  const agregarMesa = (mesa: Omit<Mesa, 'id' | 'estado'>) => {
    const nuevaMesa: Mesa = {
      ...mesa,
      id: `m_${Date.now()}`,
      estado: 'Libre'
    };
    setMesas(prev => [...prev, nuevaMesa]);
  };

  const actualizarMesa = (id: string, mesa: Partial<Mesa>) => {
    setMesas(prev => prev.map(m => m.id === id ? { ...m, ...mesa } : m));
  };

  const liberarMesa = (id: string) => {
    setMesas(prev => prev.map(m => m.id === id ? { 
      ...m, 
      estado: 'Libre', 
      clienteNombre: undefined, 
      meseroId: undefined 
    } : m));
  };

  const asignarClienteMesa = (id: string, clienteNombre: string, meseroId: string) => {
    setMesas(prev => prev.map(m => m.id === id ? { 
      ...m, 
      estado: 'Ocupada', 
      clienteNombre, 
      meseroId 
    } : m));
  };

  // MENU ACTIONS
  const agregarPlatillo = (platillo: Omit<Platillo, 'id'>) => {
    const nuevoPlatillo: Platillo = {
      ...platillo,
      id: `d_${Date.now()}`
    };
    setMenu(prev => [...prev, nuevoPlatillo]);
  };

  const actualizarPlatillo = (id: string, platillo: Partial<Platillo>) => {
    setMenu(prev => prev.map(d => d.id === id ? { ...d, ...platillo } : d));
  };

  const eliminarPlatillo = (id: string) => {
    setMenu(prev => prev.filter(d => d.id !== id));
  };

  // COMANDAS ACTIONS
  const crearComanda = (
    mesaId: string, 
    clienteNombre: string, 
    meseroId: string, 
    itemsInput: { platilloId: string; cantidad: number; notas?: string }[],
    notasOpcionales?: string
  ): string => {
    const comandaId = `c_${Date.now()}`;
    const mappedItems = itemsInput.map(item => {
      const p = menu.find(x => x.id === item.platilloId);
      return {
        platilloId: item.platilloId,
        nombre: p ? p.nombre : 'Platillo Desconocido',
        cantidad: item.cantidad,
        precioUnitario: p ? p.precio : 0,
        notas: item.notas
      };
    });

    const nuevaComanda: Comanda = {
      id: comandaId,
      mesaId,
      clienteNombre,
      items: mappedItems,
      estado: 'Pendiente',
      meseroId,
      timestamp: new Date().toISOString(),
      notasOpcionales
    };

    setComandas(prev => [...prev, nuevaComanda]);
    
    // Actualizar estado de la mesa a 'Esperando' o 'Ocupada'
    setMesas(prev => prev.map(m => m.id === mesaId ? { ...m, estado: 'Esperando', clienteNombre, meseroId } : m));
    
    return comandaId;
  };

  const actualizarEstadoComanda = (id: string, estado: EstadoComanda, chefId?: string) => {
    setComandas(prevComandas => {
      const updated = prevComandas.map(c => {
        if (c.id === id) {
          const comandaUpdate = { ...c, estado };
          if (chefId) {
            comandaUpdate.chefId = chefId;
          }
          return comandaUpdate;
        }
        return c;
      });

      // Efecto secundario: Actualizar el estado de la mesa correspondiente
      const comanda = updated.find(c => c.id === id);
      if (comanda) {
        setMesas(prevMesas => prevMesas.map(m => {
          if (m.id === comanda.mesaId) {
            let mEstado: EstadoMesa = m.estado;
            if (estado === 'Pendiente' || estado === 'En Cocina') {
              mEstado = 'Esperando';
            } else if (estado === 'Preparado') {
              mEstado = 'Ocupada'; // Listo, la mesa está comiendo / esperando entrega
            } else if (estado === 'Entregado') {
              mEstado = 'Comiendo';
            } else if (estado === 'Pagado') {
              mEstado = 'Libre';
            }
            return { ...m, estado: mEstado };
          }
          return m;
        }));
      }

      return updated;
    });
  };

  const eliminarComanda = (id: string) => {
    const comanda = comandas.find(c => c.id === id);
    if (comanda) {
      liberarMesa(comanda.mesaId);
    }
    setComandas(prev => prev.filter(c => c.id !== id));
  };

  // COBROS / VENTAS ACTIONS
  const procesarCobro = (
    mesaId: string, 
    comandaId: string, 
    subtotal: number, 
    propina: number, 
    metodoPago: MetodoPago
  ) => {
    const comanda = comandas.find(c => c.id === comandaId);
    const mesa = mesas.find(m => m.id === mesaId);
    if (!comanda || !mesa) return;

    // Crear registro de venta
    const nuevaVenta: Venta = {
      id: `v_${Date.now()}`,
      comandaId,
      mesaNumero: mesa.numero,
      clienteNombre: comanda.clienteNombre,
      subtotal,
      propina,
      total: subtotal + propina,
      metodoPago,
      timestamp: new Date().toISOString(),
      items: comanda.items.map(i => ({
        nombre: i.nombre,
        cantidad: i.cantidad,
        precio: i.precioUnitario
      }))
    };

    setVentas(prev => [...prev, nuevaVenta]);

    // Marcar comanda como pagada
    setComandas(prev => prev.map(c => c.id === comandaId ? { ...c, estado: 'Pagado' } : c));

    // Liberar mesa
    liberarMesa(mesaId);
  };

  return (
    <RestaurantContext.Provider value={{
      personal,
      mesas,
      menu,
      comandas,
      ventas,
      usuarioActual,
      login,
      logout,
      agregarPersonal,
      actualizarPersonal,
      eliminarPersonal,
      agregarMesa,
      actualizarMesa,
      liberarMesa,
      asignarClienteMesa,
      agregarPlatillo,
      actualizarPlatillo,
      eliminarPlatillo,
      crearComanda,
      actualizarEstadoComanda,
      eliminarComanda,
      procesarCobro
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant debe ser usado dentro de un RestaurantProvider');
  }
  return context;
};
