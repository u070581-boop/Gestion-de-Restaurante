export type RolPersonal = 'Mesero' | 'Chef' | 'Administrador' | 'Cajero';
export type EstadoPersonal = 'Activo' | 'Inactivo' | 'En Turno';

export interface Personal {
  id: string;
  nombre: string;
  rol: RolPersonal;
  estado: EstadoPersonal;
  telefono: string;
  usuario?: string;
  password?: string;
}

export type EstadoMesa = 'Libre' | 'Ocupada' | 'Esperando' | 'Comiendo' | 'Cuenta Solicitada';

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
  clienteNombre?: string;
  meseroId?: string;
}

export type CategoriaPlatillo = 'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas';

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaPlatillo;
  disponible: boolean;
}

export type EstadoComanda = 'Pendiente' | 'En Cocina' | 'Preparado' | 'Entregado' | 'Pagado' | 'Cancelado';

export interface ComandaItem {
  platilloId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  notas?: string;
}

export interface Comanda {
  id: string;
  mesaId: string;
  clienteNombre: string;
  items: ComandaItem[];
  estado: EstadoComanda;
  meseroId: string;
  chefId?: string;
  timestamp: string;
  notasOpcionales?: string;
}

export type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export interface Venta {
  id: string;
  comandaId?: string;
  mesaNumero: number;
  clienteNombre: string;
  subtotal: number;
  propina: number;
  total: number;
  metodoPago: MetodoPago;
  timestamp: string;
  items: { nombre: string; cantidad: number; precio: number }[];
}
