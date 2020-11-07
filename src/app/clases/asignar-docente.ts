import { Docente } from "./docente";
import { Aula } from "./aula";
import { Periodo_Lectivo } from "./periodo_lectivo";

export class AsignarDocente {
  _id?: string;
  periodo_lectivo?: Periodo_Lectivo;
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
