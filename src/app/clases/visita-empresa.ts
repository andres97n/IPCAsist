import { Empresa } from "./empresa";
import { Time } from "@angular/common";

export class Visita_Empresa {

  id?: number;
  empresa?: Empresa;
  motivo_visita?: string;
  acompanantes?: [{}];
  encargado_visita?;
  fecha_visita?: string;
  hora_visita?: string;
  observaciones?: string;

}
