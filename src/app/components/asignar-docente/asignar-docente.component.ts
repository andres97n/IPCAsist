import { Component, OnInit } from "@angular/core";
import { DocenteService } from "app/services/docente.service";
import { Persons } from "app/clases/persons";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
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

  persons: Persons[];
  cols: any[];
  displayDialog: boolean;
  person: Persons = {};
  selectedPerson: Persons;

  forma: FormGroup;
  forma_editar: FormGroup;

  asignaciones: AsignarDocente[];
  asignacion: AsignarDocente = {};
  asignacion_seleccionada: AsignarDocente;
  asignacion_editar: AsignarDocente;
  nueva_asignacion: boolean;

  docente: Docente;
  docentes: Docente[];
  docentes_filtrados: Docente[];
  docentes_editados: Docente[];
  identificacion: string;

  // hora_entrada: any;
  // hora_salida: any;
  dia: Date;

  aula_filtrada: Aula;
  aulas: Aula[];
  aulas_filtradas: Aula[];
  aulas_editadas: Aula[];
  nombre_aula: string;

  constructor(
    private fb: FormBuilder,
    // private _ejemSrv: EjemplosService,
    private _docenteSrv: DocenteService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.asignacion = {
      docente: {
        persona: {
          identificacion: "",
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
        },
      },
      horario_entrada: {
        periodo: "",
        hora: "",
      },
      horario_salida: {
        periodo: "",
        hora: "",
      },
      aula: {
        nombre: "",
      },
    };

    this._docenteSrv
      .getAsignaciones()
      .subscribe((asignaciones: AsignarDocente[]) => {
        this.asignaciones = asignaciones;
        console.log(this.asignaciones);
      });

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      console.log(docentes);
      this.docentes = docentes;
    });

    this._docenteSrv.getAulas().subscribe((aulas: Aula[]) => {
      this.aulas = aulas;

      console.log(this.aulas);
    });

    this.cols = [
      { field: "docente.persona.identificacion", header: "CÉDULA" },
      { field: "docente.persona.primer_nombre", header: "NOMBRES" },
      { field: "docente.persona.primer_apellido", header: "APELLIDOS" },
      { field: "horario_entrada.hora", header: "HORARIO DE ENTRADA" },
      { field: "horario_salida.hora", header: "HORARIO DE SALIDA" },
      { field: "aula.nombre", header: "AULA" },
    ];
  }

  crearFormulario() {
    this.forma = this.fb.group({
      // identificacion: new FormControl(this.identificacion, [Validators.required, Validators.minLength(2)]),
      identificacion: [
        // this.asignacion.docente.persona.identificacion,
        this.identificacion,
        [Validators.required, Validators.minLength(2)],
      ],
      horario: this.fb.group({
        horario_entrada: [this.asignacion.horario_entrada, Validators.required],
        horario_salida: [this.asignacion.horario_salida, Validators.required],
      }),
      aula: [
        // this.asignacion.aula.nombre,
        this.nombre_aula,
        [Validators.required, Validators.minLength(2)],
      ],
    });
  }

  crearFormularioEditar(asignacion: AsignarDocente) {
    this.forma_editar = this.fb.group({
      identificacion: [
        asignacion.docente.persona.identificacion,
        [Validators.required, Validators.minLength(2)],
      ],
      horario_entrada: ["", Validators.required],
      horario_salida: ["", Validators.required],
      aula: [
        asignacion.aula.nombre,
        [Validators.required, Validators.minLength(2)],
      ],
    });
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

  cloneAsignacion(c: AsignarDocente): AsignarDocente {
    let asignacion = {};
    for (let prop in c) {
      asignacion[prop] = c[prop];
    }
    return asignacion;
  }

  onRowSelect(event) {
    console.log(this.asignacion_seleccionada);

    this.nueva_asignacion = false;
    this.asignacion_editar = this.cloneAsignacion(event.data);
    this.crearFormularioEditar(this.asignacion_editar);
    this.dia = new Date();
    console.log(this.dia);

    this.dia = new Date(
      Number(this.dia.getFullYear.toString),
      Number(this.dia.getMonth.toString),
      Number(this.dia.getDay.toString),
      12,
      30,
      0,
      this.dia.getTimezoneOffset() * 60 * 1000
    );
    console.log(this.dia);

    this.displayDialog = true;
  }

  asignarDocente() {
    console.log(this.forma);

    // this.forma.reset();
  }

  editarDocente() {
    console.log(this.forma_editar);
  }

  filtrarDocente(event) {
    let query = event.query;
    let docentes: Docente[] = this.docentes;

    this.docentes_filtrados = [];
    for (let i = 0; i < docentes.length; i++) {
      let docente = docentes[i];

      if (
        docente.persona.primer_apellido
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        this.docentes_filtrados.push(docente);
      } else {
        if (docente.persona.identificacion.indexOf(query) == 0) {
          this.docentes_filtrados.push(docente);
        }
      }
    }

    // this.docentesFiltrados = this.filtrarDocentes(query, this.docentes);
  }

  filtrarAula(event) {
    let query = event.query;
    let aulas: Aula[] = this.aulas;

    this.aulas_filtradas = [];
    for (let i = 0; i < aulas.length; i++) {
      let aula = aulas[i];

      if (aula.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.aulas_filtradas.push(aula);
      }
    }
  }

  filtrarAulaEditar(event) {
    let query = event.query;
    let aulas: Aula[] = this.aulas;

    this.aulas_editadas = [];
    for (let i = 0; i < aulas.length; i++) {
      let aula = aulas[i];

      if (aula.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.aulas_editadas.push(aula);
      }
    }
  }

  filtrarDocenteEditar(event) {
    let query = event.query;
    let docentes: Docente[] = this.docentes;

    this.docentes_editados = [];
    for (let i = 0; i < docentes.length; i++) {
      let docente = docentes[i];

      if (
        docente.persona.primer_apellido
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        this.docentes_editados.push(docente);
      } else {
        if (docente.persona.identificacion.indexOf(query) == 0) {
          this.docentes_editados.push(docente);
        }
      }
    }
  }
}
