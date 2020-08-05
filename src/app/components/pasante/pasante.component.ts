import { Component, OnInit } from "@angular/core";
import { Persons } from "app/clases/persons";
import { DocenteService } from "app/services/docente.service";

@Component({
  selector: "app-pasante",
  templateUrl: "./pasante.component.html",
  styleUrls: ["./pasante.component.css"],
})
export class PasanteComponent implements OnInit {
  persons: Persons[] = [];

  cols: any[];

  sexo: Array<any>;
  selectedSex: string;

  edad: number;
  celular: number;

  tipo_sangre: Array<any>;
  tipo: string;

  universidades: Array<any>;
  universidad: string;

  num_horas: number;

  horario = Date;
  es: any;

  constructor(private _docenteSrv: DocenteService) {}

  ngOnInit(): void {
    this._docenteSrv.getPersons().subscribe((persons: Persons[]) => {
      console.log(persons);

      this.persons = persons;
    });

    this.cols = [
      { field: "_id", header: "ID" },
      { field: "name", header: "Name" },
      { field: "age", header: "Age" },
      { field: "email", header: "Email" },
      { field: "phone", header: "Phone" },
    ];

    this.sexo = [
      { name: "Masculino", value: 1 },
      { name: "Femenino", value: 2 },
      { name: "Otro", value: 3 },
    ];

    this.tipo_sangre = [
      {
        name: "O negativo",
        value: "O-",
      },
      { name: "O positivo", value: "O+" },
      {
        name: "A negativo",
        value: "A-",
      },
      {
        name: "A positivo",
        value: "O+",
      },
      {
        name: "B negativo",
        value: "B-",
      },
      {
        name: "B positivo",
        value: "B+",
      },
      {
        name: "AB negativo",
        value: "AB-",
      },
      {
        name: "AB positivo",
        value: "AB+",
      },
    ];

    this.universidades = [
      {
        name: "Universidad de Cuenca",
        value: "UCUENCA",
      },
      {
        name: "Universidad Católica de Cuenca",
        value: "CATOCUENCA",
      },
      {
        name: "Universidad del Azuay",
        value: "UDA",
      },
      {
        name: "Universidad Politécnica Salesiana",
        value: "UPS",
      },
      {
        name: "Universidad Nacional de Educación",
        value: "UNAE",
      },
      {
        name: "Instituo Superior Tecnológico del Azuay",
        value: "ISTA",
      },
      {
        name: "Instituto Tecnológico Sudamericano",
        value: "SUDA",
      },
      {
        name: "Instituto Tecnológico Superior San Gabriel",
        value: "SAN GABRIEL",
      },
      {
        name: "Instituto Tecnológico Superior American Collage",
        value: "AMERICAN COLLAGE",
      },
      {
        name: "Instituto Superior San Isidro",
        value: "SAN ISIDRO",
      },
      {
        name: "Otro",
        value: "OTRO",
      },
    ];

    this.es = {
      firstDayOfWeek: 0,
      dayNames: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      monthNamesShort: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      today: "Hoy",
      clear: "Borrar",
      dateFormat: "mm/dd/aa",
      weekHeader: "Sm",
    };
  }

  sexoSeleccionado(event) {
    console.log(event.value);
  }

  sangreSeleccionada(event) {
    console.log(event.value);
  }

  universidadSeleccionada(event) {
    console.log(event.value);
  }

  mostrarFecha(event) {
    console.log(event);
  }
}
