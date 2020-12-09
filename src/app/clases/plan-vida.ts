import { Docente } from "./docente";
import { Estudiante } from "./estudiante";
import { Materia } from "./materia";
import { Aula } from "./aula";
import { Detalle } from "./detalle";
import { Periodo_Lectivo } from "./periodo_lectivo";

export class Plan_Vida {
  _id?: string;
  periodoLectivo?: Periodo_Lectivo;
  docente?: Docente;
  alumno?: Estudiante;
  asignaturas?: Materia[];
  aula?: Aula;
  descripcion?: string;
  objetivoGeneral?: string;
  metasEspecificas?: string[];
  vision?: string;
  ambitos?: Materia[];
  dominio?: Materia[];
  necesidades?: Detalle[];
  potencialidades?: Detalle[];
  gustos?: Detalle[];
  disgustos?: Detalle[];
  deseos?: Detalle[];
  suenos?: Detalle[];
  logros?: string[];
  observaciones?: string;
  estado?: string;
  historico?: []
}
