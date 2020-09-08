import { Empresa } from "./empresa";
import { Docente } from "./docente";

export class Visita_Empresa {
  _id: string;
  empresa: Empresa;
  motivo_visita: string;
  encargado_visita: Docente;
  fecha_visita: Date;
  formato_hora?: string;
  hora: string;
  fecha_creacion: Date;
}
