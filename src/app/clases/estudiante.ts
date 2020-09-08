import { Persona } from "./persona";

export class Estudiante {
  _id: string;
  persona: Persona;
  padre?: string;
  madre?: string;
  representante?: string;
  relacion_representante?: string;
  fecha_creacion: Date;
}
