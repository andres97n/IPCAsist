import { Docente } from "./docente";

export class Periodo_Lectivo{
    id?: string;
    nombre?: string;
    descripcion?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    fechaFinClases?: Date;
    estado?: string;
    responsables?: Docente[];
}
