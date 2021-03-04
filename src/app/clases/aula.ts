import { Alumno } from "./alumno";
import { AlumnoAula } from "./alumno_aula";
import { Docente } from "./docente";
import { Periodo_Lectivo } from "./periodo_lectivo";
import { Personal } from "./personal";

export class Aula {

  id?: number;
  nombre?:string;
  capacidad?:number;
  grado?:number;
  alumnos?:Alumno[];
  docentes?:Personal[];
  periodo?:Periodo_Lectivo;
  observaciones?:string;
  jornada?:string;

}
