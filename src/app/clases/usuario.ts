import { Persona } from "./persona";

export class Usuario {

    id?: number;
    username?:string;
    is_staff?:boolean;
    is_active?:boolean;
    email?:string;
    first_name?:string;
    last_name?:string;
    persona?:Persona;
    password?: string;

}
