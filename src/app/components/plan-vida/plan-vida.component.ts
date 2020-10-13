import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Aula } from "app/clases/aula";
import { Docente } from "app/clases/docente";
import { Estudiante } from "app/clases/estudiante";
import { Plan_Vida } from "app/clases/plan-vida";
import { DocenteService } from "app/services/docente.service";
import { PlanVidaService } from "app/services/plan-vida.service";

@Component({
  selector: "app-plan-vida",
  templateUrl: "./plan-vida.component.html",
  styleUrls: ["./plan-vida.component.css"],
})
export class PlanVidaComponent implements OnInit {
  cities: any[];
  selectedCities: any[];

  values1: string[];

  forma: FormGroup;

  displayDialog: boolean;
  cols: any[];

  docentes: Docente[];
  docentes_filtrados: Docente[];

  aulas: Aula[];
  aulas_filtradas: Aula[];

  estudiantes: Estudiante[];
  estudiantes_filtrados: Estudiante[];

  planes_vida: Plan_Vida[];
  plan_vida: Plan_Vida;
  nuevo_plan: boolean;
  plan_editar: Plan_Vida;
  

  constructor(
    private fb: FormBuilder,
    private _docenteSrv: DocenteService,
    private _planSrv: PlanVidaService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cities = [
      { name: "Vinculación Emocional y Social", code: "NY" },
      { name: "Descubrimiento del Método Natural y Cultural", code: "RM" },
      { name: "Manifestación del Lenguaje Verbal y No Verbal", code: "LDN" },
      { name: "Exploración del Cuerpo y Motricidad", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      console.log(docentes);
      this.docentes = docentes;
    });

    this._docenteSrv.getAulas().subscribe((aulas: Aula[]) => {
      console.log(aulas);
      this.aulas = aulas;
    });

    this._planSrv.getEstudiantes().subscribe((estudiantes: Estudiante[]) => {
      console.log(estudiantes);
      this.estudiantes = estudiantes;
    });

    this._planSrv.getPlanesVida().subscribe( (planes_vida: Plan_Vida[]) =>{
      console.log(planes_vida);
      this.planes_vida = planes_vida;
      
    } )

    this.cols = [
      { field: "docente.persona", header: "DOCENTE" },
      { field: "estudiante.persona", header: "ESTUDIANTE" },
      { field: "aula.nombre", header: "AULA" },
      { field: "vision", header: "VISIÓN" },
      { field: "observaciones", header: "OBSERVACIONES" },
    ];
  }

  crearFormulario() {
    this.forma = this.fb.group({
      docente: this.fb.control("", Validators.required),
      estudiante: this.fb.control("", Validators.required),
      aula: this.fb.control("", Validators.required),
      asignatura: this.fb.control("", Validators.required),
      descripcion: this.fb.control("", Validators.required),
      objetivo_general: this.fb.control("", Validators.required),
      metas_especificas: this.fb.control("", Validators.required),
      vision: this.fb.control("", Validators.required),
      area: this.fb.control("", Validators.required),
      dominio: this.fb.control("", Validators.required),
      necesidades: this.fb.array([
        // this.fb.group({})
      ]),
      potencialidades: this.fb.array([]),
      gustos: this.fb.array([]),
      disgustos: this.fb.array([]),
      deseos: this.fb.array([]),
      suenos: this.fb.array([]),
      logros: this.fb.control("", Validators.required),
      observaciones: this.fb.control("", Validators.required),
    });
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  // Retorno de Array's

  get necesidades() {
    return this.forma.get("necesidades") as FormArray;
  }

  get potencialidades(){
    return this.forma.get("potencialidades") as FormArray;
  }

  get gustos(){
    return this.forma.get("gustos") as FormArray;
  }

  get disgustos(){
    return this.forma.get("disgustos") as FormArray;
  }

  get deseos(){
    return this.forma.get("deseos") as FormArray;
  }

  get suenos(){
    return this.forma.get("suenos") as FormArray;
  }

  // Agregar a Array's
  agregarNecesidad() {
    this.necesidades.push(
      this.fb.group({
        // nombre: ["", Validators.required],
        // descripcion: ["", Validators.required]
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    );
  }

  agregarPotencialidad(){
    this.potencialidades.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    )
  }

  agregarGusto(){
    this.gustos.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    )
  }

  agregarDisgusto(){
    this.disgustos.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    )
  }

  agregarDeseo(){
    this.deseos.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    )
  }

  agregarSueno(){
    this.suenos.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required)
      })
    )
  }

// Guardar datos de Plan de Vida
  guardarPlan() {
    console.log(this.forma);
  }

  clonePlan(c: Plan_Vida): Plan_Vida {
    let plan = {};
    for (let prop in c) {
      plan[prop] = c[prop];
    }
    return plan;
  }

  onRowSelect(event) {
    this.nuevo_plan = false;
    this.plan_editar = this.clonePlan(event.data);
    this.displayDialog = true;
    console.log(this.planes_vida);

    // this.editarUniversidad(this.pasante_editar.institucion);
  }

  filtrarDocente(e: any) {
    let query = e.query;
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
  }

  filtrarEstudiante(e: any) {
    let query = e.query;
    let estudiantes: Estudiante[] = this.estudiantes;

    this.estudiantes_filtrados = [];
    for (let i = 0; i < estudiantes.length; i++) {
      let estudiante = estudiantes[i];

      if (
        estudiante.persona.primer_apellido
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        this.estudiantes_filtrados.push(estudiante);
      } else {
        if (estudiante.persona.identificacion.indexOf(query) == 0) {
          this.docentes_filtrados.push(estudiante);
        }
      }
    }
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
}
