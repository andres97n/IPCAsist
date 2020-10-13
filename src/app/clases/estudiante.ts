import { Persona } from "./persona";

export class Estudiante {
  _id?: string;
  persona?: Persona;
  padre?: {
    id?: string;
    persona: Persona;
  };
  madre?: {
    id?: string;
    persona: Persona;
  };
  representante?: {
    id?: string;
    persona: Persona;
  };
  relacion_representante?: string;
  fecha_creacion?: Date;
}
