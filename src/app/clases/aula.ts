import { Docente } from "./docente";
import { Pasante } from "./pasante";
import { Periodo_Lectivo } from "./periodo_lectivo";

export class Aula {
  _id?: string;
  grado?: string;
  paralelo?: string;
  nombre?: string;
  docentes?: Docente[];
  pasantes?: Pasante[];
  especialidades?: [];
  periodoLectivo?: Periodo_Lectivo;
  jornada?: string;
}
