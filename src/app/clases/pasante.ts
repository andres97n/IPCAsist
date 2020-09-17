import { Persona } from "./persona";
import { Docente } from "./docente";

export class Pasante {
  _id: string;
  persona: Persona;
  nombre_institucion: string;
  especialidad: string;
  tutor: Docente;
  fecha_inicio?: Date;
  horas_diarias?: number;
  fecha_creacion: Date;
}
