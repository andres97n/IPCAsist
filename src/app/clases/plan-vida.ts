
import { Alumno } from "./alumno";
import { Aula } from "./aula";
import { Periodo_Lectivo } from "./periodo_lectivo";
import { Personal } from "./personal";

export class Plan_Vida {

  id?: number;
  periodo_lectivo?: Periodo_Lectivo;
  docente?: Personal;
  alumno?: Alumno;
  asignaturas?:[{}];
  aula?: Aula;
  descripcion?: string;
  objetivo_general?: string;
  metas_especificas?: string[];
  vision?: string;
  ambitos?: [{}];
  dominio?:  [{}];
  necesidades?:  [{}];
  potencialidades?: [{}];
  gustos?:  [{}];
  disgustos?:  [{}];
  deseos?:  [{}];
  suenos?:  [{}];
  logros?: string[];
  observaciones?: string;
  estado?: number;

}
