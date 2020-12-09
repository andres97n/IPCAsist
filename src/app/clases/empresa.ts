import { Persona } from "./persona";
import { Docente } from "./docente";

export class Empresa {
  _id?: string;
  nombre?: string;
  representante?: Persona;
  direccion?: {
    callePrincipal: string;
    calleSecundaria: string;
  };
  historico?: {
    fechaRegistro
  }
}
