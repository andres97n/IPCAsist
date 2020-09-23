import { Empresa } from "./empresa";
import { Docente } from "./docente";
import { Persona } from "./persona";

export class Visita_Empresa {
  _id?: string;
  empresa?: Empresa;
  motivo_visita?: string;
  encargado_visita?: Docente;
  fecha_visita?: Date;
  hora_visita?: {
    formato_hora?: string;
    hora?: string;
  };
  fecha_creacion?: Date;
}
