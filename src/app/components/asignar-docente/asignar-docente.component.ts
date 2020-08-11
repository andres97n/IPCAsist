import { Component, OnInit } from "@angular/core";
import { DocenteService } from "app/services/docente.service";
import { Persons } from "app/clases/persons";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { Car } from "app/clases/cars";
@Component({
  selector: "app-asignar-docente",
  templateUrl: "./asignar-docente.component.html",
  styleUrls: ["./asignar-docente.component.css"],
  animations: [
    trigger("rowExpansionTrigger", [
      state(
        "void",
        style({
          transform: "translateX(-10%)",
          opacity: 0,
        })
      ),
      state(
        "active",
        style({
          transform: "translateX(0)",
          opacity: 1,
        })
      ),
      transition("* <=> *", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")),
    ]),
  ],
})
export class AsignarDocenteComponent implements OnInit {
  time = { hour: 13, minute: 30 };
  time2 = { hour: 13, minute: 30 };
  meridian = false;

  country: any;

  countries: any[];

  filteredCountriesSingle: any[];

  persons: Persons[];
  cols: any[];
  displayDialog: boolean;
  person: Persons = {};
  selectedPerson: Persons;
  newPerson: boolean;

  forma: FormGroup;

  cars: Car[];
  cols2: any[];

  constructor(private _docenteSrv: DocenteService, private fb: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this._docenteSrv.getPersons().subscribe((persons: Persons[]) => {
      console.log(persons);

      this.persons = persons;
    });

    // this._docenteSrv.getCarsSmall().subscribe((cars: Car[]) => {
    //   console.log(cars);

    //   this.cars = cars;
    // });

    this.cols = [
      { field: "_id", header: "ID" },
      { field: "name", header: "Name" },
      { field: "age", header: "Age" },
      { field: "email", header: "Email" },
      { field: "phone", header: "Phone" },
    ];

    // this.cols2 = [
    //   { field: "vin", header: "Vin" },
    //   { field: "year", header: "Year" },
    //   { field: "brand", header: "Brand" },
    //   { field: "color", header: "Color" },
    // ];
  }

  crearFormulario() {
    this.forma = this.fb.group({
      identificacion: ["", [Validators.required, Validators.minLength(2)]],
      horario: this.fb.group({
        horario_entrada: ["", Validators.required],
        horario_salida: ["", Validators.required],
      }),
      aula: ["", [Validators.required, Validators.minLength(2)]],
    });
  }

  showDialogToAdd() {
    this.newPerson = true;
    this.person = {};
    this.displayDialog = true;
  }

  save() {
    let persons = [...this.persons];
    if (this.newPerson) persons.push(this.person);
    else persons[this.persons.indexOf(this.selectedPerson)] = this.person;

    this.persons = persons;
    this.person = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.persons.indexOf(this.selectedPerson);
    this.persons = this.persons.filter((val, i) => i != index);
    this.person = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newPerson = false;
    this.person = this.clonePerson(event.data);
    this.displayDialog = true;
  }

  clonePerson(c: Persons): Persons {
    let person = {};
    for (let prop in c) {
      person[prop] = c[prop];
    }
    return person;
  }

  asignarDocente() {
    console.log(this.forma);

    // this.forma.reset();
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  get noEntrada() {
    return (
      this.forma.get("horario.horario_entrada").invalid &&
      this.forma.get("horario.horario_entrada").touched
    );
  }

  get noSalida() {
    return (
      this.forma.get("horario.horario_salida").invalid &&
      this.forma.get("horario.horario_salida").touched
    );
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
