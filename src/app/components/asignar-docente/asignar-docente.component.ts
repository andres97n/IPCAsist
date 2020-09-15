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
import { EjemplosService } from "app/services/ejemplos.service";
import { AsignarDocente } from "app/clases/asignar-docente";
import { Docente } from "app/clases/docente";
import { Aula } from "app/clases/aula";
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

  forma: FormGroup;

  cars: Car[];
  cols2: any[];

  asignaciones: AsignarDocente[];
  asignacion: AsignarDocente;
  asignacion_seleccionada: AsignarDocente;
  nueva_asignacion: boolean;

  docente: Docente;
  docentes: Docente[];
  docentesFiltrados: Docente[];

  constructor(
    private fb: FormBuilder,
    private _ejemSrv: EjemplosService,
    private _docenteSrv: DocenteService
  ) {
    this.crearFormulario();

    this.asignacion = {
      docente: new Docente(),
      horario_entrada: {
        periodo: "",
        hora: "",
      },
      horario_salida: {
        periodo: "",
        hora: "",
      },
      aula: new Aula(),
    };
  }

  ngOnInit(): void {
    this._ejemSrv.getPersons().subscribe((persons: Persons[]) => {
      console.log(persons);

      this.persons = persons;
    });

    this._docenteSrv
      .getAsignaciones()
      .subscribe((asignaciones: AsignarDocente[]) => {
        this.asignaciones = asignaciones;
        console.log(this.asignaciones);
      });

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      this.docentes = docentes;
      console.log(this.docentes);
    });

    // this._docenteSrv.getCarsSmall().subscribe((cars: Car[]) => {
    //   console.log(cars);

    //   this.cars = cars;
    // });

    this.cols = [
      { field: "docente.persona.identificacion", header: "CÉDULA" },
      { field: "docente.persona.primer_nombre", header: "NOMBRE" },
      { field: "docente.persona.primer_apellido", header: "APELLIDO" },
      { field: "horario_entrada.hora", header: "HORARIO DE ENTRADA" },
      { field: "horario_salida.hora", header: "HORARIO DE SALIDA" },
      { field: "aula.nombre", header: "AULA" },
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
    this.nueva_asignacion = true;
    this.asignacion_seleccionada = {};
    this.displayDialog = true;
  }

  save() {
    let persons = [...this.persons];
    if (this.nueva_asignacion) persons.push(this.person);
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
    this.nueva_asignacion = false;
    this.asignacion_seleccionada = this.cloneAsignacion(event.data);
    this.displayDialog = true;
  }

  cloneAsignacion(c: AsignarDocente): AsignarDocente {
    let asignacion = {};
    for (let prop in c) {
      asignacion[prop] = c[prop];
    }
    return asignacion;
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

  filtrarDocentes(query, docentes: Docente[]): Docente[] {
    let filtered: any[] = [];
    for (let i = 0; i < docentes.length; i++) {
      let docente = docentes[i];

      if (
        docente.persona.primer_apellido
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(docente);
      }
      // if(docente.persona.identificacion.indexOf(query) == 0){
      //   filtered.push(docente);
      // }
    }
    return filtered;
  }

  filtrarDocente(event) {
    let query = event.query;
    this.docentesFiltrados = this.filtrarDocentes(query, this.docentes);

    // this._ejemSrv.getCountries().subscribe((data: any[]) => {
    //   // console.log(data);

    //   this.filteredCountriesSingle = this.filterCountry(query, data);
    // });
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
}
