import { Persona } from "./persona";

export class Alumno {
  id?: number;
  persona?: Persona;
  padre?: {};
  madre?: {};
  representante?: {};
  contactoEmergencia?: {};
  observaciones?: string;
  historia_clinica?:string;
  trastornos_asociados?:string;
  grado_dependencia?:string;
  bono?:string;
  tipo_bono?:string;
  afiliacion_iess?:string;
  quintil_pobreza?:string;
}
