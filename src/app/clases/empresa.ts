import { Persona } from "./persona";
import { Docente } from "./docente";

export class Empresa {
  _id?: string;
  nombre?: string;
  representante?: Persona;
  direccion?: {
    calle_principal: string;
    calle_secundaria: string;
  };
  fecha_creacion?: Date;
}
