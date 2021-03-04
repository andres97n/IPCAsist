import { Docente } from "./docente";

export class Periodo_Lectivo{

    id?: number;
    nombre?: string;
    fecha_inicio?:Date;
    fecha_fin?:Date;
    estado?:number;
    fecha_fin_clases?:Date;
    observaciones?:string;
    coordinador?:{};
    sub_coordinador?:{};
    
}
