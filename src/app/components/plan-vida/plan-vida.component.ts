import { state } from "@angular/animations";
import { style } from "@angular/animations";
import { animate } from "@angular/animations";
import { transition } from "@angular/animations";
import { trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Aula } from "app/clases/aula";
import { Docente } from "app/clases/docente";
import { Estudiante } from "app/clases/estudiante";
import { Materia } from "app/clases/materia";
import { Plan_Vida } from "app/clases/plan-vida";
import { DocenteService } from "app/services/docente.service";
import { PlanVidaService } from "app/services/plan-vida.service";

@Component({
  selector: "app-plan-vida",
  templateUrl: "./plan-vida.component.html",
  styleUrls: ["./plan-vida.component.css"],
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

export class PlanVidaComponent implements OnInit {
  cities: any[];
  selectedCities: any[];

  materias: Materia[];

  values1: string[];

  forma: FormGroup;

  displayDialog: boolean;
  cols: any[];

  docentes: Docente[];
  docentes_filtrados: Docente[];
  // docentes_editados: Docente[];

  aulas: Aula[];
  aulas_filtradas: Aula[];
  // aulas_editadas: Aula[];

  estudiantes: Estudiante[];
  estudiantes_filtrados: Estudiante[];
  // estudiantes_editados: Estudiante[];

  planes_vida: Plan_Vida[];
  plan_vida: Plan_Vida;
  nuevo_plan: boolean;
  plan_editar: Plan_Vida;
  

  constructor(
    private fb: FormBuilder,
    private _docenteSrv: DocenteService,
    private _planSrv: PlanVidaService
  ) {

    this.plan_vida = {
      docente: {
        persona : {
          identificacion : "",
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido : "",
          segundo_apellido: ""
        }
      },
      aula: {
        nombre: ""
      },
      estudiante: {
        persona: {
          identificacion: "",
          primer_nombre: "",
          segundo_apellido: "",
          primer_apellido: "",
          segundo_nombre: ""
        }
      },
      asignaturas: [],
      descripcion: "",
      objetivo_general: "",
      metas_especificas: [],
      vision: "",
      areas: [],
      dominio: [],
      necesidades: [],
      potencialidades: [],
      gustos: [],
      disgustos: [],
      deseos: [],
      suenos: [ ],
      logros: [],
      observaciones: ""
    }

    this.crearFormulario();

  }

  ngOnInit(): void {

    // this.cities = [
    //   { name: "Vinculación Emocional y Social", code: "NY" },
    //   { name: "Descubrimiento del Método Natural y Cultural", code: "RM" },
    //   { name: "Manifestación del Lenguaje Verbal y No Verbal", code: "LDN" },
    //   { name: "Exploración del Cuerpo y Motricidad", code: "IST" },
    //   { name: "Paris", code: "PRS" },
    // ];

    this.materias = [
      { nombre: "Vinculación Emocional y Social" , asignacion: "VES" },
      { nombre: "Descubrimiento del Método Natural y Cultural" , asignacion: "DMNC" },
      { nombre: "Manifestación del Lenguaje Verbal y No Verbal" , asignacion: "MLVNV" },
      { nombre: "Exploración del Cuerpo y Motricidad" , asignacion: "ECM" },
      { nombre: "Lengua y Comunicación" , asignacion: "LC" }
    ]

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
      docente: this.fb.control(this.plan_vida.docente.persona.identificacion, Validators.required),
      estudiante: this.fb.control(this.plan_vida.estudiante.persona.identificacion, Validators.required),
      aula: this.fb.control(this.plan_vida.aula.nombre, Validators.required),
      asignatura: this.fb.control(this.plan_vida.asignaturas, Validators.required),
      descripcion: this.fb.control(this.plan_vida.descripcion, Validators.required),
      objetivo_general: this.fb.control(this.plan_vida.objetivo_general, Validators.required),
      metas_especificas: this.fb.control(this.plan_vida.metas_especificas, Validators.required),
      vision: this.fb.control(this.plan_vida.vision, Validators.required),
      area: this.fb.control(this.plan_vida.areas, Validators.required),
      dominio: this.fb.control(this.plan_vida.dominio, Validators.required),
      necesidades: this.fb.array([
        // this.fb.group({})
      ]),
      potencialidades: this.fb.array([]),
      gustos: this.fb.array([]),
      disgustos: this.fb.array([]),
      deseos: this.fb.array([]),
      suenos: this.fb.array([]),
      logros: this.fb.control(this.plan_vida.logros, Validators.required),
      observaciones: this.fb.control(this.plan_vida.observaciones, Validators.required),
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

  // Borrar Formularios Dinámicos

  borrarNecesidad(i: number){
    this.necesidades.removeAt(i);
  }

  borrarGustos(i: number){
    this.gustos.removeAt(i);
  }

  borrarDeseos(i: number){
    this.deseos.removeAt(i);
  }

  borrarPotencialidad(i: number){
    this.potencialidades.removeAt(i);
  }

  borrarDisgustos(i: number){
    this.disgustos.removeAt(i);
  }

  borrarSuenos(i: number){
    this.suenos.removeAt(i);
  }

  limpiarArrays(){
    // this.necesidades.length = 0
  }

// Guardar datos de Plan de Vida
  guardarPlan() {
    console.log(this.forma);
    console.log(this.plan_vida);
    
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
    console.log(this.plan_vida);

    // this.necesidades.setValue(this.plan_vida.necesidades);

    this.limpiarArrays();

    this.plan_vida.necesidades.forEach( necesidad =>{
      this.agregarNecesidad() 
    } )

    this.plan_vida.potencialidades.forEach(potencialidad => {
      this.agregarPotencialidad();
    } )

    this.plan_vida.disgustos.forEach( disgusto => {
      this.agregarDisgusto();
    } )

    this.plan_vida.suenos.forEach( sueno => {
      this.agregarSueno();
    } )

    this.plan_vida.gustos.forEach( seguro => {
      this.agregarGusto();
    } )

    this.plan_vida.deseos.forEach( deseo => {
      this.agregarDeseo();
    } )

    this.forma.setValue({
      docente: this.plan_vida.docente,
      estudiante: this.plan_vida.estudiante,
      aula: this.plan_vida.aula,
      asignatura: this.plan_vida.asignaturas,
      descripcion: this.plan_vida.descripcion,
      objetivo_general: this.plan_vida.objetivo_general,
      metas_especificas: this.plan_vida.metas_especificas,
      vision: this.plan_vida.vision,
      area: this.plan_vida.areas,
      dominio: this.plan_vida.dominio,
      necesidades: this.plan_vida.necesidades,
      potencialidades: this.plan_vida.potencialidades,
      gustos: this.plan_vida.gustos,
      disgustos: this.plan_vida.disgustos,
      deseos: this.plan_vida.deseos,
      suenos: this.plan_vida.suenos,
      logros: this.plan_vida.logros,
      observaciones: this.plan_vida.observaciones
    });

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

  // filtrarDocenteEditado(e: any) {
  //   let query = e.query;
  //   let docentes: Docente[] = this.docentes;

  //   this.docentes_editados = [];
  //   for (let i = 0; i < docentes.length; i++) {
  //     let docente = docentes[i];

  //     if (
  //       docente.persona.primer_apellido
  //         .toLowerCase()
  //         .indexOf(query.toLowerCase()) == 0
  //     ) {
  //       this.docentes_editados.push(docente);
  //     } else {
  //       if (docente.persona.identificacion.indexOf(query) == 0) {
  //         this.docentes_editados.push(docente);
  //       }
  //     }
  //   }
  // }

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
          this.estudiantes_filtrados.push(estudiante);
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

  // filtrarAulaEditada(event) {
  //   let query = event.query;
  //   let aulas: Aula[] = this.aulas;

  //   this.aulas_editadas = [];
  //   for (let i = 0; i < aulas.length; i++) {
  //     let aula = aulas[i];

  //     if (aula.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       this.aulas_editadas.push(aula);
  //     }
  //   }
  // }

  // filtrarEstudianteEditar(e: any) {
  //   let query = e.query;
  //   let estudiantes: Estudiante[] = this.estudiantes;

  //   this.estudiantes_editados = [];
  //   for (let i = 0; i < estudiantes.length; i++) {
  //     let estudiante = estudiantes[i];

  //     if (
  //       estudiante.persona.primer_apellido
  //         .toLowerCase()
  //         .indexOf(query.toLowerCase()) == 0
  //     ) {
  //       this.estudiantes_editados.push(estudiante);
  //     } else {
  //       if (estudiante.persona.identificacion.indexOf(query) == 0) {
  //         this.estudiantes_editados.push(estudiante);
  //       }
  //     }
  //   }
  // }
}
