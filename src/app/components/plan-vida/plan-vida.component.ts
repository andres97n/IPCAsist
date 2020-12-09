import { state } from "@angular/animations";
import { style } from "@angular/animations";
import { animate } from "@angular/animations";
import { transition } from "@angular/animations";
import { trigger } from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Aula } from "app/clases/aula";
import { Docente } from "app/clases/docente";
import { Estudiante } from "app/clases/estudiante";
import { Materia } from "app/clases/materia";
import { Periodo_Lectivo } from "app/clases/periodo_lectivo";
import { Plan_Vida } from "app/clases/plan-vida";
import { DocenteService } from "app/services/docente.service";
import { PlanVidaService } from "app/services/plan-vida.service";
import { Table } from "primeng/table";
// import {ConfirmationService} from 'primeng/api';

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

  

  // msgs: Message[] = [];

  materias: Materia[];

  values1: string[];

  forma: FormGroup;

  // displayDialog: boolean;
  editar: boolean;
  cols: any[];

  mostrar_nuevo_ambito: boolean;
  mostrar_nueva_asignatura: boolean;
  mostrar_nuevo_dominio: boolean;

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
  plan_seleccionado: Plan_Vida;
  nuevo_plan: boolean;
  plan_editar: Plan_Vida;

  ambito: string;
  asignatura: string;
  dominio: string;

  periodo_lectivo: Periodo_Lectivo;
  periodos_lectivos: Periodo_Lectivo[];
  periodos_filrados: Periodo_Lectivo[];

  @ViewChild('dt') table: Table;
  

  constructor(
    private fb: FormBuilder,
    private _docenteSrv: DocenteService,
    private _planSrv: PlanVidaService,
    private modalService: NgbModal
    // private confirmationService: ConfirmationService
  ) {

    // this.plan_vida = new Plan_Vida();

    this.crearFormulario();

  }

  ngOnInit(): void {

    this.editar = false;

    this.plan_vida = {
      periodoLectivo: {
        nombre: ""
      },
      docente: {
        persona: {
          identificacion: "",
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
        }
      },
      alumno: {
        persona: {
          identificacion: "",
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
        }
      },
      asignaturas: [],
      aula: {
        nombre: ""
      },
      descripcion: "",
      objetivoGeneral: "",
      metasEspecificas: [],
      vision: "",
      ambitos: [],
      dominio: [],
      necesidades: [],
      potencialidades: [],
      gustos: [],
      disgustos: [],
      deseos: [],
      suenos: [],
      logros: [],
      observaciones: "",
      estado: "ACTIVO",
    };

    // this.cities = [
    //   { name: "Vinculación Emocional y Social", code: "NY" },
    //   { name: "Descubrimiento del Método Natural y Cultural", code: "RM" },
    //   { name: "Manifestación del Lenguaje Verbal y No Verbal", code: "LDN" },
    //   { name: "Exploración del Cuerpo y Motricidad", code: "IST" },
    //   { name: "Paris", code: "PRS" },
    // ];

    this.materias = [
      { nombre: "Vinculación Emocional y Social" , descripcion: ""},
      { nombre: "Descubrimiento del Método Natural y Cultural" , descripcion: "" },
      { nombre: "Manifestación del Lenguaje Verbal y No Verbal" , descripcion: "" },
      { nombre: "Exploración del Cuerpo y Motricidad" , descripcion: "" },
      { nombre: "Lengua y Comunicación" , descripcion: "" },
      {
        nombre: "Alimentación", descripcion: ""
      },
      {
        nombre: "Cuidado Personal", descripcion: ""
      }
    ]

    this._planSrv.getPeriodoLectivo().subscribe( (periodos_lectivos: Periodo_Lectivo[]) =>{
      
      this.periodos_lectivos = periodos_lectivos;
      console.log(this.periodos_lectivos);
    } )

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
      { field: "docente", header: "DOCENTE" },
      { field: "estudiante", header: "ESTUDIANTE" },
      { field: "aula", header: "AULA" },
      { field: "periodo_lectivo", header: "PERÍODO LECTIVO" },
      { field: "observaciones", header: "OBSERVACIONES" },
    ];
  }

  crearFormulario() {
    this.forma = this.fb.group({
      periodoLectivo: this.fb.control("", Validators.required),
      docente: this.fb.control("", Validators.required),
      alumno: this.fb.control("", Validators.required),
      aula: this.fb.control("", Validators.required),
      asignatura: this.fb.control("", Validators.required),
      descripcion: this.fb.control("", Validators.required),
      objetivoGeneral: this.fb.control("", Validators.required),
      metasEspecificas: this.fb.control("", Validators.required),
      vision: this.fb.control("", Validators.required),
      ambito: this.fb.control("", Validators.required),
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

  // showModal() {
  //   this.modalService.open(Modal);
  // }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  // get ambito{
  //   return this.forma
  // }

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

  // Agregar Materias

  ambitoSeleccionado(e: any){
    this.mostrar_nuevo_ambito = true;
  }

  nuevoAmbito(){
    if(this.forma.get("ambito").value){
      this.materias.push({
        nombre: this.forma.get("ambito").value,
        asignacion: "NO"
      })
    }
    console.log(this.materias);
    this.mostrar_nuevo_ambito = false;
  }

  asignaturaSeleccionada(e: any){
    this.mostrar_nueva_asignatura = true;
  }

  nuevaAsignatura(){
    if(this.forma.get("asignatura").value){
      this.materias.push({
        nombre: this.forma.get("asignatura").value,
        asignacion: "NO"
      })
    }
  }

  dominioSeleccionado(){
    this.mostrar_nuevo_dominio = true;
  }

  nuevoDominio(){
    if(this.forma.get("dominio").value){
      this.materias.push({
        nombre: this.forma.get("dominio").value,
        asignacion: "NO"
      })
    }
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

  // mostrarConfirmacion(){
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       this.eliminarPlan();
  //         // this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
  //     },
  //     reject: () => {
  //         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
  //     }
  // });
  // }

  limpiarArrays(){
    this.necesidades.clear();
    this.potencialidades.clear();
    this.gustos.clear();
    this.disgustos.clear();
    this.deseos.clear();
    this.suenos.clear();
  }

// Guardar datos de Plan de Vida
  guardarPlan() {
    console.log(this.forma);
    console.log(this.plan_vida);
    
  }

  eliminarPlan(){
    console.log(this.plan_seleccionado);
    
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this record?',
  //     header: 'Delete Confirmation',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //         this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
  //     },
  //     reject: () => {
  //         this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
  //     }
  // });

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
    this.editar = true;
    console.log(this.plan_seleccionado);

    // let plan_select = event.data;

    // this.necesidades.setValue(this.plan_vida.necesidades);

    this.limpiarArrays();

    // plan_select.necesidades.forEach( necesidad => {
    //   this.agregarNecesidad() 
    // });

    this.plan_seleccionado.necesidades.forEach( necesidad =>{
      this.agregarNecesidad() 
    } )

    // plan_select.potencialidades.forEach( potencialidad => {
    //   this.agregarPotencialidad();
    // } );

    this.plan_seleccionado.potencialidades.forEach(potencialidad => {
      this.agregarPotencialidad();
    } )

    // plan_select.disgustos.forEach( disgusto =>{
    //   this.agregarDisgusto();
    // } );

    this.plan_seleccionado.disgustos.forEach( disgusto => {
      this.agregarDisgusto();
    } )

    // plan_select.suenos.forEach( sueno=> {
    //   this.agregarSueno();
    // } );

    this.plan_seleccionado.suenos.forEach( sueno => {
      this.agregarSueno();
    } )

    // plan_select.gustos.forEach( gusto=> {
    //   this.agregarGusto();
    // } );

    this.plan_seleccionado.gustos.forEach( seguro => {
      this.agregarGusto();
    } )

    // plan_select.deseos.forEach( deseo=> {
    //   this.agregarDeseo();
    // } );

    this.plan_seleccionado.deseos.forEach( deseo => {
      this.agregarDeseo();
    } )
    
    // console.log(plan_select.alumno);

    this.forma.setValue({
      periodoLectivo: this.plan_seleccionado.periodoLectivo,
      docente: this.plan_seleccionado.docente,
      alumno: this.plan_seleccionado.alumno,
      aula: this.plan_seleccionado.aula,
      asignatura: this.plan_seleccionado.asignaturas,
      descripcion: this.plan_seleccionado.descripcion,
      objetivoGeneral: this.plan_seleccionado.objetivoGeneral,
      metasEspecificas: this.plan_seleccionado.metasEspecificas,
      vision: this.plan_seleccionado.vision,
      ambito: this.plan_seleccionado.ambitos,
      dominio: this.plan_seleccionado.dominio,
      necesidades: this.plan_seleccionado.necesidades,
      potencialidades: this.plan_seleccionado.potencialidades,
      gustos: this.plan_seleccionado.gustos,
      disgustos: this.plan_seleccionado.disgustos,
      deseos: this.plan_seleccionado.deseos,
      suenos: this.plan_seleccionado.suenos,
      logros: this.plan_seleccionado.logros,
      observaciones: this.plan_seleccionado.observaciones

    });

    this.forma.get("periodoLectivo").setValue(this.periodos_lectivos.find( periodo_lectivo => periodo_lectivo.nombre === this.plan_seleccionado.periodoLectivo.nombre ));

    // this.editarUniversidad(this.pasante_editar.institucion);
  }

  filtrarContenido(event: any){
    console.log(event.value.nombre);
    
    this.table.filterGlobal(event.value.nombre, 'contains')
  }

  // periodoSeleccionado(e: any){
  //   console.log(e.value);
    
  // }

  filtrarDocente(e: any) {
    let query = e.query;
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
      console.log(estudiante);
      
      if (
        estudiante.persona.primerApellido
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

  filtrarPeriodo(event) {
    let query = event.query;
    let periodos: Periodo_Lectivo[] = this.periodos_lectivos;

    this.periodos_filrados = [];
    for (let i = 0; i < periodos.length; i++) {
      let periodo = periodos[i];

      if (periodo.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.periodos_filrados.push(periodo);
      }
    }
  }

  generarPlanes(){
    console.log("CLICK EN GENERAR");
    
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
