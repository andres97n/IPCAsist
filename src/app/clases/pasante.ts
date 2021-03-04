import { Persona } from "./persona";
import { Aula } from "./aula";

export class Pasante {

  id?: number;
  persona?: {
    identificacion
    nombres
    apellidos
    edad
    genero
    correo
    contacto
  };
  institucion?;
  tutor?;
  aula?: Aula[];
  especialidad?: string;
  numHoras?: number;

}
