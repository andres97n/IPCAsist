import { Docente } from "./docente";
import { Aula } from "./aula";

export class AsignarDocente {
  _id?: string;
  docente?: Docente;
  horario_entrada?: {
    periodo: string;
    hora: string;
  };
  horario_salida?: {
    periodo: string;
    hora: string;
  };
  aula?: Aula;
}
