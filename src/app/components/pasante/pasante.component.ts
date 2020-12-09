import { Component, OnInit } from "@angular/core";
import { Persons } from "app/clases/persons";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EjemplosService } from "app/services/ejemplos.service";
import { PasantesService } from "app/services/pasantes.service";
import { Pasante } from "app/clases/pasante";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { DocenteService } from "app/services/docente.service";
import { Docente } from "app/clases/docente";

@Component({
  selector: "app-pasante",
  templateUrl: "./pasante.component.html",
  styleUrls: ["./pasante.component.css"],
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
export class PasanteComponent implements OnInit {
  persons: Persons[] = [];

  cols: any[];
  displayDialog: boolean;

  genero: Array<any>;
  selectedGen: any;

  edad: number;
  celular: number;

  tipo_sangre: Array<any>;
  tipo: string;

  universidades: any[];
  universidades_editar: any[];
  universidad: string;
  mostrarModal: boolean = false;
  auto_universidad: any;

  num_horas: number;

  horario = Date;
  es: any;

  forma: FormGroup;

  pasantes: Pasante[];
  pasante: Pasante;
  pasante_seleccionado: Pasante;
  pasante_editar: Pasante;
  nuevo_pasante: boolean;

  docentes: Docente[];
  docentes_filtrados: Docente[];

  hora_visita: Date;

  constructor(
    private fb: FormBuilder,
    private _ejemplosSrv: EjemplosService,
    private _pasanteSrv: PasantesService,
    private _docenteSrv: DocenteService
  ) {
    this.crearFormulario();

    this.pasante = new Pasante();

    this.universidades = this._ejemplosSrv.getUniversidades();
  }

  ngOnInit(): void {
    this._ejemplosSrv.getPersons().subscribe((persons: Persons[]) => {
      console.log(persons);

      this.persons = persons;
    });

    this._pasanteSrv.getPasantes().subscribe((pasantes: Pasante[]) => {
      console.log(pasantes);
      this.pasantes = pasantes;
    });

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      console.log(docentes);
      this.docentes = docentes;
    });

    this.cols = [
      { field: "persona.identificacion", header: "CÉDULA" },
      { field: "persona.primer_nombre", header: "NOMBRES" },
      { field: "persona.primer_apellido", header: "APELLIDOS" },
      { field: "institución", header: "INSTITUCIÓN" },
      { field: "docente.primer_nombre", header: "TUTOR" },
    ];

    this.genero = [
      { name: "Masculino", value: "M" },
      { name: "Femenino", value: "F" },
      { name: "Otro", value: "O" },
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

  crearFormulario() {
    this.forma = this.fb.group({
      identificacion: ["", Validators.required],
      identidad: this.fb.group({
        nombres: ["", Validators.required],
        apellidos: ["", Validators.required],
      }),
      genero: ["", Validators.required],
      edad: ["", Validators.required],
      correo: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ],
      ],
      contacto: ["", Validators.required],
      // tipo_sangre: ["", Validators.required],
      institucion: [this.universidad, Validators.required],
      tutor: ["", Validators.required],
      especialidad: ["", Validators.required],
      asignacion_aula: ["", Validators.required],
      num_horas: ["", Validators.required],
      fecha_inicio: ["", Validators.required],
    });
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  get noNombres() {
    return (
      this.forma.get("identidad.nombres").invalid &&
      this.forma.get("identidad.nombres").touched
    );
  }

  get noApellidos() {
    return (
      this.forma.get("identidad.apellidos").invalid &&
      this.forma.get("identidad.apellidos").touched
    );
  }

  get numHoras() {
    return this.forma.get("num_horas").value;
  }

  generoSeleccionado(event) {
    console.log(event.value);
  }

  sangreSeleccionada(event) {
    console.log(event.value);
  }

  universidadSeleccionada(event) {
    this.universidad = event.option.name;
    if (this.universidad === "Otro") {
      this.mostrarModal = true;
    }

    console.log(event.option.name);
  }

  nuevaInstitucion(e) {
    this.universidad = e.target.value;
    console.log(this.universidad);
  }

  cerrarModal() {
    this.mostrarModal = false;
    console.log(this.universidad);
  }

  mostrarFecha(event) {
    console.log(event);
  }

  guardarPasante() {
    console.log(this.forma);
  }

  onRowSelect(event) {
    this.nuevo_pasante = false;
    this.pasante_editar = this.clonePasante(event.data);
    this.displayDialog = true;
    switch (this.pasante_editar.persona.genero) {
      case "F":
        this.selectedGen = {
          name: "Femenino",
          value: "F",
        };
        break;
      case "M":
        this.selectedGen = {
          name: "Masculino",
          value: "M",
        };
        break;
      case "O":
        this.selectedGen = {
          name: "Otro",
          value: "O",
        };
        break;
    }
    this.editarUniversidad(this.pasante_editar.institucion);
  }

  clonePasante(c: Pasante): Pasante {
    let pasante = {};
    for (let prop in c) {
      pasante[prop] = c[prop];
    }
    return pasante;
  }

  editarUniversidad(u: string) {
    this.universidades.forEach((institucion) => {
      if (institucion.name === u) {
        this.auto_universidad = institucion;
      }
    });
    console.log(this.auto_universidad);
  }

  filtrarUniversidad(event) {
    let query = event.query;
    let instituciones: any[] = this.universidades;

    this.universidades_editar = [];
    for (let i = 0; i < instituciones.length - 1; i++) {
      let institucion = instituciones[i];

      if (institucion.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.universidades_editar.push(institucion);
      }
    }
  }

  filtrarDocente(event) {
    let query = event.query;
    let docentes: Docente[] = this.docentes;

    this.docentes_filtrados = [];
    for (let i = 0; i < docentes.length; i++) {
      let docente = docentes[i];

      if (
        docente.persona.primerApellido
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
}
