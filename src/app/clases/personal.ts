import { Funcion_Personal } from "./funcion_personal";
import { Persona } from "./persona";

export class Personal {

    id?: number;
    persona?: Persona;
    funciones?: Funcion_Personal[];
    titulo?: string;
    tipo_titulo?: string;
    area_de_trabajo?: string;

}