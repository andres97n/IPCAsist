import { Discapacidad } from "./discapacidad";

export class Persona {
  id?: number;
  identificacion?: string;
  tipo_identificacion?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  pais_nacimiento?: string;
  fecha_nacimiento?: string;
  genero?: string;
  estado_civil?: string;
  tieneDiscapacidad?: string;
  discapacidades?: Discapacidad[];
  carnetConadis?: string;
  porcentajeDiscapacidad?: string;
  etnia?: string;
  tipo_sangre?: string;
  pais_residencia?:string;
  provincia_residencia?:string;
  canton_residencia?:string;
  parroquia_residencia?:string;
  direccion_domiciliaria?:string;
  telefono?: string;
  celular_uno?: string;
  celular_dos?: string;
  correo?: string;
  foto?: string;
  extras?: {};
}
