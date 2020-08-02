import { Component, OnInit } from "@angular/core";
import { DocenteService } from "app/services/docente.service";
import { Persons } from "app/clases/persons";
@Component({
  selector: "app-asignar-docente",
  templateUrl: "./asignar-docente.component.html",
  styleUrls: ["./asignar-docente.component.css"],
})
export class AsignarDocenteComponent implements OnInit {
  time = { hour: 13, minute: 30 };
  time2 = { hour: 13, minute: 30 };
  meridian = false;

  country: any;

  countries: any[];

  filteredCountriesSingle: any[];

  persons: Persons[] = [];

  cols: any[];

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
  }

  // buscarPersona(event) {
  //   let persona = event.query;
  //   console.log(persona);

  //   this.libro = this.libros.filter((book: string) => {
  //     if (book.includes(persona)) {
  //       return book;
  //     }
  //   });
  // }

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

    this._docenteSrv.getCountries().subscribe((data: any[]) => {
      // console.log(data);

      this.filteredCountriesSingle = this.filterCountry(query, data);
    });
  }
}
