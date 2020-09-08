import { Discapacidad } from "./discapacidad";

export class Persona {
  _id: string;
  identificacion: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  genero: string;
  sexo?: string;
  foto?: string;
  tipo_sangre?: string;
  fecha_nacimiento: string;
  edad: string;
  calle_principal?: string;
  calle_secundaria?: string;
  lugar_referencia?: string;
  numero_casa?: string;
  telefono?: string;
  celular?: string;
  correo?: string;
  carnet_conadis?: string;
  discapacidad?: Discapacidad[];
  nivel_discapacidad?: string;
  ocupacion: string;
  fecha_creacion: Date;
}
