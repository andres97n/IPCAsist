import { Empresa } from "./empresa";
import { Docente } from "./docente";
import { Persona } from "./persona";

export class Visita_Empresa {
  _id?: string;
  empresa?: Empresa;
  motivoVisita?: string;
  encargadoVisita?: Docente[];
  fechaVisita?: Date;
  horarioVisita?: {
    horaEntrada?: string;
    horaSalida?: string;
  };
  observaciones?: string;
  historico?: {
    fechaRegistro?: Date  
  };
}
