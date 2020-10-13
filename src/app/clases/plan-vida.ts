import { Docente } from "./docente";
import { Estudiante } from "./estudiante";
import { Materia } from "./materia";
import { Aula } from "./aula";
import { Detalle } from "./detalle";

export class Plan_Vida {
  _id?: string;
  docente?: Docente;
  estudiante?: Estudiante;
  asignaturas?: Materia[];
  aula?: Aula;
  descripcion?: string;
  objetivo_general?: string;
  metas_especificas?: string[];
  vision?: string;
  areas?: Materia[];
  dominio?: Materia[];
  necesidades?: Detalle[];
  potencialidades?: Detalle[];
  gustos?: Detalle[];
  disgustos?: Detalle[];
  deseos?: Detalle[];
  suenos?: Detalle[];
  logros?: string[];
  observaciones?: string;
  fecha_creacion?: Date;
}
