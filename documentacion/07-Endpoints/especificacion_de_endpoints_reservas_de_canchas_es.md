
Endpoints por pantalla del Frontend

### A. Pantalla **Alquileres** (lista + solicitar)
- `GET /api/disponibilidad?fecha=YYYY-MM-DD&canchaId?`
- `GET /api/reservas?fecha=YYYY-MM-DD&estado=ACEPTADA&canchaId?`
- `POST /api/cotizaciones` (calcula precio por rango solicitado)
- `POST /api/reservas` (crear **solicitud** de reserva)

### B. **Inicio sesion/REgistro**
- `POST /api/autenticacion/registro`
- `POST /api/autenticacion/inicio-sesion`
- `GET  /api/autenticacion/mi-perfil`

### C. **Panel de Administración**
- `GET   /api/reservas?estado=PENDIENTE|ACEPTADA|RECHAZADA|CANCELADA&fecha?&canchaId?`
- `PATCH /api/reservas/:id/estado` (aceptar/rechazar/cancelar)
- `GET   /api/canchas`
- `PATCH /api/canchas/:id/estado` (habilitar/deshabilitar)
- `GET   /api/precios?minutosBloque=30`
- `PATCH /api/precios` (actualizar precio por bloque)

### 2.1 `GET /api/disponibilidad`
**a) Reglas de negocio**
- Devuelve *intervalos de 30 minutos* por cancha para la fecha indicada.
- Excluye canchas **DESHABILITADA**.
- Marca como **OCUPADO** cuando el intervalo se superpone con reservas **ACEPTADA**.

**b) Autenticación**: No requerida.

```ts
export type EstadoIntervalo = "LIBRE" | "OCUPADO";
export interface ConsultaDisponibilidad {
  fecha: string;
  canchaId?: string;
}
export interface IntervaloDisponibilidad {
  canchaId: string;
  inicio: string;
  fin: string;
  estado: EstadoIntervalo;
}
export type RespuestaDisponibilidad = IntervaloDisponibilidad[];
```

---

### 2.2 `GET /api/reservas`
**a) Reglas de negocio**
- Para la grilla pública usar `estado=ACEPTADA`.
- Soporta filtros `fecha` (día completo) y `canchaId`.
- No expone datos sensibles; muestra `nombreMostrar`.

**b) Autenticación**: No, salvo si `mias=true` (reservas del usuario) → requiere **USUARIO**.
```ts
export type EstadoReserva = "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
export interface ReservaDTO {
  id: string;
  canchaId: string;
  inicio: string;
  fin: string;
  estado: EstadoReserva;
  nombreMostrar: string;
}
export interface ConsultaReservas {
  fecha?: string;
  estado?: EstadoReserva;
  canchaId?: string;
  mias?: boolean;
}
export type RespuestaListaReservas = ReservaDTO[];
```

---

### 2.3 `POST /api/aceptarres`
**a) Reglas de negocio**
- Valida múltiplos de **30 minutos**, `inicio < fin`, fecha/hora ≥ ahora, cancha **HABILITADA** y **sin solape** con reservas **ACEPTADA**.
- Calcula `bloques`, `precioPorBloque`, `total` y devuelve notas/reglas si aplica (pico, fin de semana, etc.).

**b) Autenticación**: **USUARIO**

```ts
export interface SolicitudAceptada {
  canchaId: string;
  inicio: string;
  fin: string;
}
export interface RespuestaAceptada {
  bloques: number;
  minutosPorBloque: 30;
  precioPorBloque: number;
  total: number;
  moneda: "ARS" | "USD";
  notas?: string;
}
```

---

### 2.4 `POST /api/reservas`
**a) Reglas de negocio**
- Crea **solicitud** en estado **PENDIENTE**.
- Revalida reglas de 2.3; guarda `nombreMostrar` para la grilla.
- Devuelve mensaje de confirmación y la cotización usada.

**b) Autenticación**: **USUARIO**

```ts
export interface CrearReserva {
  canchaId: string;
  inicio: string;
  fin: string;
  nombreMostrar: string;
}
export interface RespuestaCrearReserva {
  id: string;
  estado: "PENDIENTE";
  cotizacion: RespuestaReserva;
  mensaje: string;
}
```

---

### 2.5 `POST /api/autenticacion/registro`
**a) Reglas de negocio**
- Email único, contraseña con hash; rol por defecto **USUARIO**.

**b) Autenticación**: No.

```ts
export type Rol = "USUARIO" | "ADMIN";
export interface Registro {
  nombre: string;
  email: string;
  contrasenia: string;
}
export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  rol: Rol;
}
export interface RespuestaAutenticacion {
  token: string; // JWT
  usuario: UsuarioAutenticado;
}
```

---

### 2.6 `POST /api/autenticacion/inicio-sesion`
**a) Reglas de negocio**
- Verifica credenciales, retorna JWT y usuario.

**b) Autenticación**: No.

```ts
export interface InicioSesion { email: string; contrasenia: string; }
export type RespuestaInicioSesion = RespuestaAutenticacion;
```

---

### 2.7 `GET /api/autenticacion/mi-perfil`
**a) Reglas de negocio**
- Retorna el usuario asociado al token.

**b) Autenticación**: **USUARIO/ADMIN**.

```ts
export type RespuestaMiPerfil = UsuarioAutenticado;
```

---

### 2.8 `PATCH /api/reservas/:id/estado`
**a) Reglas de negocio**
- Cambios permitidos: `ACEPTADA`, `RECHAZADA` (requiere `motivoRechazo`), `CANCELADA`.
- Al **ACEPTAR**, verificar **no solape**; opcional: pasar a **RECHAZADA** otras **PENDIENTE** solapadas.
- **CANCELADA**: por **ADMIN**.

**b) Autenticación**: **ADMIN**.

```ts
export type NuevoEstado = "ACEPTADA" | "RECHAZADA" | "CANCELADA";
export interface ActualizarEstadoReserva {
  estado: NuevoEstado;
  motivoRechazo?: string;
}
export interface RespuestaEstadoReserva extends ReservaDTO {}
```

---

### 2.9 `GET /api/canchas`
**a) Reglas de negocio**
- Lista canchas y su estado.

**b) Autenticación**: Pública (sólo lectura).

```ts
export type EstadoCancha = "HABILITADA" | "DESHABILITADA";
export interface CanchaDTO { id: string; nombre: string; estado: EstadoCancha; }
export type RespuestaListaCanchas = CanchaDTO[];
```

---

### 2.10 `PATCH /api/canchas/:id/estado`
**a) Reglas de negocio**
- Cambia a **HABILITADA/DESHABILITADA**.
- Si se deshabilita, impedir **nuevas** reservas; decidir política sobre reservas aceptadas (mantener o cancelar con aviso).

**b) Autenticación**: **ADMIN**.

```ts
export interface ActualizarEstadoCancha { estado: EstadoCancha; nota?: string; }
export interface RespuestaEstadoCancha extends CanchaDTO {}
```

---

### 2.11 `GET /api/precios?minutosBloque=30`
**a) Reglas de negocio**
- Obtiene precio vigente por bloque y moneda.

**b) Autenticación**: Pública.

```ts
export interface PrecioDTO {
  minutosPorBloque: 30;
  precioPorBloque: number;
  vigenteDesde?: string;
}
```

---

### 2.12 `PATCH /api/precios`
**a) Reglas de negocio**
- Actualiza precio por bloque.

**b) Autenticación**: **ADMIN**.

```ts
export interface ActualizarPrecio {
  minutosPorBloque: 30;
  precioPorBloque: number;
  vigenteDesde?: string;
}
export interface RespuestaActualizarPrecio extends PrecioDTO {}
```

---

## 3) Modelos base y tipos compartidos
```ts
export type ISODateTime = string;

export type EstadoReserva = "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
export type EstadoCancha  = "HABILITADA" | "DESHABILITADA";
export type Rol          = "USUARIO" | "ADMIN";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Cancha {
  id: string;
  nombre: string;
  estado: EstadoCancha;
}

export interface Reserva {
  id: string;
  usuarioId?: string;
  canchaId: string;
  inicio: ISODateTime;
  fin: ISODateTime;
  estado: EstadoReserva;
  nombreMostrar: string;
  creadoEn: ISODateTime;
  actualizadoEn: ISODateTime;
  motivoRechazo?: string;
}
```

---

## 4) Reglas de negocio (resumen)
- **Bloques de 30’**: `inicio` y `fin` deben caer en múltiplos de 30 min.
- **Sin solapes** para pasar a **ACEPTADA**; se permiten **PENDIENTE** superpuestas hasta la decisión del admin.
- **Cancha DESHABILITADA**: impide nuevas solicitudes.
- **Precio** = `bloques * precioPorBloque`; `POST /api/cotizaciones` devuelve el total al usuario antes de confirmar.
- **Estados**: `PENDIENTE → (ACEPTADA | RECHAZADA | CANCELADA)`.
- **Zonas horarias**: usar ISO con `-03:00` para evitar ambigüedades.
- **Seguridad**: JWT, roles, limitacion en creación de reservas.

---

## 5) Notas para implementación
- Middleware `autenticado` (valida JWT) y `requiereRol("ADMIN")`.
- Validaciones con schema zod para request/response.
- Auditoría de cambios de estado (quién, cuándo, motivo).

