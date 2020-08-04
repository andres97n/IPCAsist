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
  }

  sexoSeleccionado(event) {
    console.log(event.value);
  }

  sangreSeleccionada(event) {
    console.log(event.value);
  }
}
