import { Persona } from "./persona";

export class Docente {
  _id?: string;
  persona?: Persona;
  funcion?: {
    nombre?: "DOCENTE"
    descripcion?: string
  };
  info?: {
    titulo?: string
    tipoTitulo?: string
    areDeTrabajo?: string
  };
  historico?: {};
  descripcion?: string;
}
