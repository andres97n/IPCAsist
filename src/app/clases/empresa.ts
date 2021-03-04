import { Persona } from "./persona";
import { Docente } from "./docente";

export class Empresa {

  id?: number;
  nombre?: string;
  representante?: {};
  direccion?: {
    callePrincipal: string;
    calleSecundaria: string;
  };

}
