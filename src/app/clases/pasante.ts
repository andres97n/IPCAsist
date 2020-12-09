import { Persona } from "./persona";
import { Docente } from "./docente";

export class Pasante {
  _id?: string;
  persona?: Persona;
  institucion?: string;
  tutor?: Docente;
  especialidad?: string;
  numHoras?: number;
  historico?: {
    fechaCreacion?: Date;
  }
}
