
export class Persona {
  _id?: string;
  identificacion?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  telefono?: string;
  celular?: string;
  correo?: string;
  foto?: string;
  genero?: string;
  direccion?: {
    callePrincipal?: string
    calleSecundaria?: string
    numeroCasa?: string
    lugarReferencia?: string
  };
  fechaNacimiento?: string;
  tipoSangre?: string;
  tieneDiscapacidad?: string;
  infoDiscapacidad?: {
    discapacidades?: {}
    carnetConadis?: string
    porcentajeDiscapacidad?: string
  }
  ocupacion?: string;
  nivelFormacion?: string;
}
