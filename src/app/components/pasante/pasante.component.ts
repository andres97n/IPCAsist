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

  sexo: Array<any>;
  selectedSex: string;

  edad: number;
  celular: number;

  tipo_sangre: Array<any>;
  tipo: string;

  universidades: Array<any>;
  universidad: string;
  mostrarModal: boolean = false;

  num_horas: number;

  horario = Date;
  es: any;

  forma: FormGroup;

  pasantes: Pasante[];
  pasante: Pasante;
  pasante_seleccionado: Pasante;
  pasante_editar: Pasante;
  nuevo_pasante: boolean;

  constructor(
    private fb: FormBuilder,
    private _ejemplosSrv: EjemplosService,
    private _pasanteSrv: PasantesService
  ) {
    this.crearFormulario();

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

    this.cols = [
      { field: "persona.identificacion", header: "CÉDULA" },
      { field: "persona.primer_nombre", header: "NOMBRES" },
      { field: "persona.primer_apellido", header: "APELLIDOS" },
      { field: "institución", header: "INSTITUCIÓN" },
      { field: "docente.primer_nombre", header: "TUTOR" },
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
      sexo: ["", Validators.required],
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

  sexoSeleccionado(event) {
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
    // this.dia = new Date();
    // console.log(this.dia);

    // this.dia = new Date(
    //   Number(this.dia.getFullYear.toString),
    //   Number(this.dia.getMonth.toString),
    //   Number(this.dia.getDay.toString),
    //   12,
    //   30,
    //   0,
    //   this.dia.getTimezoneOffset() * 60 * 1000
    // );
    // console.log(this.dia);

    this.displayDialog = true;
  }

  clonePasante(c: Pasante): Pasante {
    let pasante = {};
    for (let prop in c) {
      pasante[prop] = c[prop];
    }
    return pasante;
  }
}
