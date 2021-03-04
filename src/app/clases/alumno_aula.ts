import { Alumno } from "./alumno";
import { Aula } from "./aula";

export class AlumnoAula {

    id?: number;
    diagnostico_clinico?:string;
    aula?:Aula;
    alumno?:Alumno;
    numero_matricula?:string;
    matricula?:string;
    aporte_voluntario?:number;
    tratamiento?:string;
    info_faltas?:{};
    diagnostico_final?:string;

}