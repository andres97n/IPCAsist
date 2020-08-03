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
  }

  sexoSeleccionado(event) {
    console.log(event.value);
  }
}
