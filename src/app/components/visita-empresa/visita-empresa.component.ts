import { Component, OnInit } from "@angular/core";
import { Persons } from "app/clases/persons";
import { DocenteService } from "app/services/docente.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-visita-empresa",
  templateUrl: "./visita-empresa.component.html",
  styleUrls: ["./visita-empresa.component.css"],
})
export class VisitaEmpresaComponent implements OnInit {
  persons: Persons[] = [];
  cols: any[];
  es: any;
  celular: number;

  forma: FormGroup;

  constructor(private _docenteSrv: DocenteService, private fb: FormBuilder) {
    this.crearFormulario();
  }

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
      empresa: ["", Validators.required],
      // direccion: this.fb.group({
      //   calle_principal: ["", Validators.required],
      //   calle_secundaria: ["", Validators.required],
      // }),
      motivo_visita: ["", Validators.required],
      representante: this.fb.group({
        nombres: ["", Validators.required],
        apellidos: ["", Validators.required],
      }),
      contacto: ["", Validators.required],
      correo: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ],
      ],
      guia: ["", Validators.required],
      fecha_visita: ["", Validators.required],
      horario_visita: this.fb.group({
        horario_entrada: ["", Validators.required],
        horario_salida: ["", Validators.required],
      }),
      observacion: ["", Validators.required],
    });
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  get sinNombres() {
    return (
      this.forma.get("representante.nombres").invalid &&
      this.forma.get("representante.nombres").touched
    );
  }

  get sinApellidos() {
    return (
      this.forma.get("representante.apellidos").invalid &&
      this.forma.get("representante.apellidos").touched
    );
  }

  get sinPrincipal() {
    return (
      this.forma.get("direccion.calle_principal").invalid &&
      this.forma.get("direccion.calle_principal").touched
    );
  }

  get sinSecundaria() {
    return (
      this.forma.get("direccion.calle_secundaria").invalid &&
      this.forma.get("direccion.calle_secundaria").touched
    );
  }

  get noHoraEntrada() {
    return (
      this.forma.get("horario_visita.horario_entrada").invalid &&
      this.forma.get("horario_visita.horario_entrada").touched
    );
  }

  get noHoraSalida() {
    return (
      this.forma.get("horario_visita.horario_salida").invalid &&
      this.forma.get("horario_visita.horario_salida").touched
    );
  }

  guardarVisita() {
    console.log(this.forma);
  }
}
