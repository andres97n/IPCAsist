import { Component, OnInit } from "@angular/core";
import { EjemplosService } from "app/services/ejemplos.service";

@Component({
  selector: "app-ayuda-componentes",
  templateUrl: "./ayuda-componentes.component.html",
  styleUrls: ["./ayuda-componentes.component.css"],
})
export class AyudaComponentesComponent implements OnInit {
  materias: any[];
  opciones: any[];

  es: any;
  calendario: Date;

  filteredCountriesSingle: any[];

  hora: string;

  sexo: Array<any>;
  selectedSex: string;

  num_horas: number = 0;

  constructor(private _ejemSrv: EjemplosService) {}

  ngOnInit(): void {
    this.materias = [
      { name: "Vinculación Emocional y Social", code: "NY" },
      { name: "Descubrimiento del Método Natural y Cultural", code: "RM" },
      { name: "Manifestación del Lenguaje Verbal y No Verbal", code: "LDN" },
      { name: "Exploración del Cuerpo y Motricidad", code: "IST" },
      { name: "Estimulación Sensorial", code: "ES" },
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

    this.sexo = [
      { name: "Masculino", value: 1 },
      { name: "Femenino", value: 2 },
      { name: "Otro", value: 3 },
    ];
  }

  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];

      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  filterCountrySingle(event) {
    let query = event.query;

    this._ejemSrv.getCountries().subscribe((data: any[]) => {
      // console.log(data);

      this.filteredCountriesSingle = this.filterCountry(query, data);
    });
  }

  sexoSeleccionado(event) {
    console.log(event.value);
  }
}
