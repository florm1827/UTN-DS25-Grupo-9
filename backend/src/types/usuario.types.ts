export type Rol = "USUARIO" | "ADMIN";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  contraseniaHash: string; 
  creadoEn: string;
  actualizadoEn: string;
}

export interface RegistroDTO {
  nombre: string;
  email: string;
  contrasenia: string;
}

export interface InicioSesionDTO {
  email: string;
  contrasenia: string;
}

export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface RespuestaAuth {
  token: string;
  usuario: UsuarioAutenticado;
}
