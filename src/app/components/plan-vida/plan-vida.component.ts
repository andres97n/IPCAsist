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
import { Drop } from "app/clases/drop";
import { Alumno } from "app/clases/alumno";
import { Materia } from "app/clases/materia";
import { Periodo_Lectivo } from "app/clases/periodo_lectivo";
import { Plan_Vida } from "app/clases/plan-vida";
import { PlanVidaService } from "app/services/plan-vida.service";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { Table } from "primeng/table";
import { Persona } from "app/clases/persona";
import { Personal } from "app/clases/personal";
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

  // msgs: Message[] = [];

  materias: Materia[];

  values1: string[];

  forma: FormGroup;

  mostrarAdmin: boolean;
  mostrar_pdf: boolean;

  administracion: {
      elaborado_por?:string,
      revisado_por?: string,
      aprobado_por?: string
    } = {};

    plan_admin: {
      elaborado_por?:string,
      revisado_por?: string,
      aprobado_por?: string
    } = {};

    plan_pdf:Plan_Vida;

  periodo_pdf: Periodo_Lectivo;

  // displayDialog: boolean;
  editar: boolean;
  cols: any[];

  mostrar_nuevo_ambito: boolean;
  mostrar_nueva_asignatura: boolean;
  mostrar_nuevo_dominio: boolean;

  docentes: Personal[];
  docentes_filtrados: Docente[];
  // docentes_editados: Docente[];

  aulas: Aula[];
  aulas_filtradas: Aula[];
  // aulas_editadas: Aula[];

  alumnos: Alumno[];
  alumnos_filtrados: Alumno[];
  // estudiantes_editados: Estudiante[];

  planes_vida: Plan_Vida[];
  plan_vida: Plan_Vida;
  plan_seleccionado: Plan_Vida;
  nuevo_plan: boolean;
  plan_editar: Plan_Vida;

  asignaturas_combo: Materia[];
  ambitos_combo: Materia[];
  dominios_combo: Materia[];

  ambito: string;
  asignatura: string;
  dominio: string;

  periodo_lectivo: Periodo_Lectivo;
  periodos_lectivos: Periodo_Lectivo[];
  periodos_activos: Periodo_Lectivo[];
  periodos_filrados: Periodo_Lectivo[];
  
  periodos_drop: Drop[];

  first = 0;
  rows = 5;

  @ViewChild('dt') table: Table;
  

  constructor(
    private fb: FormBuilder,
    private _planSrv: PlanVidaService,
    private modalService: NgbModal
    // private confirmationService: ConfirmationService
  ) {

    // this.plan_vida = new Plan_Vida();

    this.crearFormulario();
    this.periodos_lectivos = [];
    this.periodos_drop = [];

    this.mostrarAdmin = false;
    this.mostrar_pdf = false;
  }

  ngOnInit(): void {

    this.editar = false;

    this.plan_vida = {
      periodo_lectivo: {
        nombre: ""
      },
      docente: {
        persona: {
          identificacion: "",
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
        }
      },
      alumno: {
        persona: {
          identificacion: "",
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
        }
      },
      asignaturas: [{}],
      aula: {
        nombre: ""
      },
      descripcion: "",
      objetivo_general: "",
      metas_especificas: [],
      vision: "",
      ambitos: [{}],
      dominio: [{}],
      necesidades: [{}],
      potencialidades: [{}],
      gustos: [{}],
      disgustos: [{}],
      deseos: [{}],
      suenos: [{}],
      logros: [],
      observaciones: "",
      estado: 1,
    };


    this._planSrv.getLista("periodos_activos").subscribe( (periodos_lectivos: Periodo_Lectivo[]) =>{
      this.periodos_lectivos = periodos_lectivos;
      console.log(this.periodos_lectivos, "Periodos Lectivos");
    } )

    this._planSrv.getLista("personal").subscribe((personal: Personal[]) => {
      this.docentes = personal;
      console.log(this.docentes, "Docentes");
      this.docentes.forEach( (docente)=> {
        this._planSrv.getDetallePersona(docente.persona).subscribe( (persona: Persona) => {
          docente.persona = persona;
        } )
      })
    });

    this._planSrv.getLista("aulas").subscribe((aulas: Aula[]) => {
      this.aulas = aulas;
      console.log(this.aulas, "Aulas");
    });

    this._planSrv.getLista("alumnos").subscribe((alumnos: Alumno[]) => {
      this.alumnos = alumnos;
      this.alumnos.forEach( (alumno) => {
        this._planSrv.getDetallePersona(alumno.persona).subscribe( (persona: Persona) => {
          alumno.persona = persona;
        } )
      })
      console.log(this.alumnos, "Alumnos");
    });

    this._planSrv.getLista("materias").subscribe( (materias:Materia[]) => {
      this.materias = materias;
      console.log(this.materias, "Materias");
      this.asignaturas_combo = [];
      this.ambitos_combo = [];
      this.dominios_combo = [];

      this.materias.forEach( (materia:Materia) => {
        if(materia.tipo_materia == 1){
          this.dominios_combo.push(materia);
        } else if(materia.tipo_materia == 2){
          this.ambitos_combo.push(materia);
        } else{
          this.asignaturas_combo.push(materia);
        }
      })
      
    } )

    this._planSrv.getLista("periodos_lectivos").subscribe( (periodos_lectivos:Periodo_Lectivo[]) => {
      this.periodos_lectivos = periodos_lectivos;
      // let periodo:Periodo_Lectivo = new Periodo_Lectivo();
      // periodo.nombre = "Todos"
      // this.periodos_lectivos.push(periodo);
      console.log(this.periodos_lectivos, "Periodos Lectivos");
    })
    
    this._planSrv.getLista("periodos_activos").subscribe( (periodos_lectivos:Periodo_Lectivo[]) => {
      this.periodos_activos = periodos_lectivos;
      // let periodo:Periodo_Lectivo = new Periodo_Lectivo();
      // periodo.nombre = "Todos"
      // this.periodos_activos.push(periodo);
      console.log(this.periodos_activos, "Periodos Lectivos");
    })
    
    this._planSrv.getLista("planes_vida").subscribe((planes_vida: Plan_Vida[]) =>{
      this.planes_vida = planes_vida;
      
      this.planes_vida.forEach( (plan) => {
        
        this.periodos_lectivos.forEach( (periodo) => {
          if(periodo.id == plan.periodo_lectivo){
            plan.periodo_lectivo = periodo;
          }
        });

        this.alumnos.forEach( (alumno) => {
          if(alumno.id == plan.alumno){
            plan.alumno = alumno;
          }
        });
        
        this.docentes.forEach( (docente) => {
          if (docente.id == plan.docente) {
            plan.docente = docente;
          }
        });
        
        this.aulas.forEach( (aula) => {
          if (aula.id == plan.aula) {
            plan.aula = aula;
          }
        })
        
      })

      console.log(this.planes_vida, "Planes de Vida");
      
    } )
    // this._planSrv.getLista("planes_vida").subscribe( (planes_vida: Plan_Vida[]) =>{
    //   this.planes_vida = planes_vida;
    //   console.log(this.planes_vida, "Planes de Vida");
      
    // } )

    this.cols = [
      { field: "docente.persona.primer_apellido", header: "DOCENTE" },
      { field: "alumno.persona.primer_apellido", header: "ALUMNO" },
      { field: "aula.nombre", header: "AULA" },
      { field: "periodo_lectivo.nombre", header: "PERÍODO LECTIVO" },
      { field: "objetivo_general", header: "OBJETIVO GENERAL" },
    ];

   
    this.periodos_drop.push( {label: "Todos los Períodos", value: null} );
    let drop : Drop;
    
    this.periodos_lectivos.forEach( (periodo) =>{
      drop.label = periodo.nombre;
      drop.value = periodo.nombre;
      console.log(drop);
      
      this.periodos_drop.push( drop );
    })
   

    console.log(this.periodos_drop, "Periodos Drop");

    

  }

  crearFormulario() {
    this.forma = this.fb.group({
      periodo_lectivo: this.fb.control("", Validators.required),
      docente: this.fb.control("", Validators.required),
      alumno: this.fb.control("", Validators.required),
      aula: this.fb.control("", Validators.required),
      asignaturas: this.fb.control("", Validators.required),
      descripcion: this.fb.control("", Validators.required),
      objetivo_general: this.fb.control("", Validators.required),
      metas_especificas: this.fb.control("", Validators.required),
      vision: this.fb.control("", Validators.required),
      ambitos: this.fb.control("", Validators.required),
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
        // asignacion: "NO"
      })
    }
    console.log(this.materias);
    this.mostrar_nuevo_ambito = false;
  }

  asignaturaSeleccionada(e: any){
    this.mostrar_nueva_asignatura = true;
  }

  nuevaMateria(tipo:number, nombre:string){

    console.log(this.forma.get(nombre).value);
    

    if(this.forma.get(nombre).value){

      let materia: Materia = new Materia();
      materia.nombre = this.forma.get(nombre).value
      materia.tipo_materia = tipo;
      console.log(materia);
      

      this._planSrv.setMateria(materia).subscribe( (data) => {
        console.log(data, "setmateria");
        
      } )

      if(nombre == "ambitos"){
        this.mostrar_nuevo_ambito = false;
      } else if(nombre == "asignaturas"){
        this.mostrar_nueva_asignatura = false;
      } else{
        this.mostrar_nuevo_dominio = false;
      }

      this.forma.get(nombre).setValue('');
      // this.materias.push({
      //   nombre: this.forma.get("asignatura").value,
      //   // asignacion: "NO"
      // })
    }
  }

  dominioSeleccionado(){
    this.mostrar_nuevo_dominio = true;
  }

  nuevoDominio(){
    if(this.forma.get("dominio").value){
      this.materias.push({
        nombre: this.forma.get("dominio").value,
        // asignacion: "NO"
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
    this.plan_vida = this.forma.value;
    
    
    let plan = {
      id: null,
      periodo_lectivo: this.plan_vida.periodo_lectivo.id,
      docente: this.plan_vida.docente.id,
      alumno: this.plan_vida.alumno.id,
      asignaturas: this.plan_vida.asignaturas,
      aula: this.plan_vida.aula.id,
      descripcion: this.plan_vida.descripcion,
      objetivo_general: this.plan_vida.objetivo_general,
      metas_especificas: this.plan_vida.metas_especificas,
      vision: this.plan_vida.vision,
      ambitos: this.plan_vida.ambitos,
      dominio: this.plan_vida.dominio,
      necesidades: this.plan_vida.necesidades,
      potencialidades: this.plan_vida.potencialidades,
      gustos: this.plan_vida.gustos,
      disgustos: this.plan_vida.disgustos,
      deseos: this.plan_vida.deseos,
      suenos: this.plan_vida.suenos,
      logros: this.plan_vida.logros,
      observaciones: this.plan_vida.observaciones,
      estado: 1
    }

    console.log(plan, "JSON");

    if(!this.editar){

    this._planSrv.setPlanVida(plan).subscribe( (data) => {
      console.log(data, "Guardado Exitoso");

      
    })} else{

      plan.id = this.plan_seleccionado.id;
      this._planSrv.editarPlanVida(plan).subscribe( (data) => {
        console.log(data, "EDITADO CORRECTAMENE");
        
      })

    }
    
    this.forma.reset();
    this.limpiarArrays();
    // this._planSrv.setPlanVida(this.plan_vida).subscribe((data) =>{
    //   console.log(data);
    // })
    
  }

  eliminarPlan(plan_vida:Plan_Vida){
    
    this._planSrv.eliminarPlan(plan_vida.id).subscribe( (data) => {
      console.log(data, "ELIMINADO CORRECTAMENTE");
      // this.displayDialog = false;
    })

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
    console.log(this.plan_seleccionado, "PLAN SELECCIONADO");

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
      periodo_lectivo: this.plan_seleccionado.periodo_lectivo,
      docente: this.plan_seleccionado.docente,
      alumno: this.plan_seleccionado.alumno,
      aula: this.plan_seleccionado.aula,
      asignaturas: this.plan_seleccionado.asignaturas,
      descripcion: this.plan_seleccionado.descripcion,
      objetivo_general: this.plan_seleccionado.objetivo_general,
      metas_especificas: this.plan_seleccionado.metas_especificas,
      vision: this.plan_seleccionado.vision,
      ambitos: this.plan_seleccionado.ambitos,
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

    // this.forma.get("periodoLectivo").setValue(this.periodos_lectivos.find( periodo_lectivo => periodo_lectivo.nombre === this.plan_seleccionado.periodo_lectivo.nombre ));

    // this.editarUniversidad(this.pasante_editar.institucion);
  }



  filtrarDocente(e: any) {
    let query = e.query;
    let docentes: Docente[] = this.docentes;

    this.docentes_filtrados = [];

    docentes.forEach( (docente) => {
      
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
      
    })
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

  filtrarAlumno(e: any) {
    let query:string = e.query;
    let alumnos: Alumno[] = this.alumnos;

    this.alumnos_filtrados = [];

    alumnos.forEach( (alumno) => {

      console.log(query);
      
      if (
        alumno.persona.primer_apellido
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        this.alumnos_filtrados.push(alumno);
      } else {
        if (alumno.persona.identificacion.indexOf(query) == 0) {
          this.alumnos_filtrados.push(alumno);
        }
      }
    } )
  }

  filtrarAula(event) {
    let query = event.query;
    let aulas: Aula[] = this.aulas;

    this.aulas_filtradas = [];

    aulas.forEach( (aula) => {

      if (aula.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.aulas_filtradas.push(aula);
      }

    } )

    // for (let i = 0; i < aulas.length; i++) {
    //   let aula = aulas[i];

    // }
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

  filtrarContenido(e) {
    console.log(e.value);
    this.mostrarAdmin = true;
  }

  abrirPDF(){
    this.mostrarAdmin = false;
    this.generarPlanesporPeriodo();
  }

  generarPlanesporPeriodo(){

    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    let planes_filtrados=[];
    let cols: string[] = [];
    let valor = [];
    let valores = [];

    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.administracion.elaborado_por, this.administracion.revisado_por, this.administracion.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]

    this.planes_vida.forEach( (plan:Plan_Vida) => {
      if(plan.periodo_lectivo.id == this.periodo_pdf.id){
        planes_filtrados.push(plan);
      }
    } )

    this.cols.forEach( col => {
      cols.push(col.header);
    } )
    cols.push("VISIÓN")
    cols.push("DESCRIPCIÓN")

    // console.log(planes_filtrados);

    planes_filtrados.forEach( (plan:Plan_Vida) => {
      console.log(planes_filtrados);
      
      // let aux = [];
      valor.push(`${plan.docente.persona.primer_nombre} ${plan.docente.persona.primer_apellido}`);
      valor.push(`${plan.alumno.persona.primer_nombre} ${plan.alumno.persona.primer_apellido}`);
      valor.push(plan.aula.nombre);
      valor.push(plan.periodo_lectivo.nombre);
      valor.push(plan.objetivo_general);
      valor.push(plan.vision);
      valor.push(plan.descripcion);
      // visita.acompanantes.forEach( (persona:any) => {
      //   aux.push(`${persona.nombre} ${persona.contacto}`)
      // } )
      // valor.push(aux);
      valores.push(valor);
    })

    const head = [cols]
    const data = valores
    const head_2 = [admin_colums]
    const data_2 = admin_fields
    const doc = new jsPDF("p","mm","a4");
    const pdfWidht=210;  // width of A4 in mm
    const pdfHeight=297;  // height of A4 in mm

    let logo_ipca= new Image();
    logo_ipca.src = 'assets/img/logo-editado.png';

    doc.addImage(logo_ipca, 'PNG', pdfWidht/3.2, pdfHeight/5, 85, 65, 'logo_IPCA', 'NONE', 0);
    doc.setFontSize(20);
    doc.text(`Planes de Vida por ${this.periodo_pdf.nombre}`, pdfWidht/2,pdfHeight/2, {align:"center"});

    doc.addPage('a4', "landscape")
    // doc.setFontSize(20);
    // doc.text(`Listado de Períodos Lectivo en ${this.periodo_lectivo.nombre}`, pdfWidht/2,pdfHeight/15, {align:"center"});
    // doc.table(pdfWidht/15,pdfHeight/4, aulas_filtradas, cols)
    autoTable(doc, {
      head: head,
      body: data,
      theme: "striped",
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })
    doc.addPage('a4',"l");

    autoTable(doc, {
      head: head_2,
      body: data_2,
      theme: "grid",
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })

    doc.setFontSize(8);
    doc.text('Documento generado por IPCAsist', pdfWidht/2, pdfHeight/1.03, {align:"center"});

    doc.save(`Planes_Vida_${this.periodo_pdf.nombre}.pdf`);
    this.periodo_pdf = {};

  }

  generarPlan(){
    const doc = new jsPDF("p","mm","a4");
    const pdfWidht=210;  // width of A4 in mm
    const pdfHeight=297;  // height of A4 in mm

    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    // let planes_filtrados
    let cols = [];
    let valor = [];
    let valores = [];
    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.plan_admin.elaborado_por, this.plan_admin.revisado_por, this.plan_admin.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]

    let logo_ipca= new Image();
    logo_ipca.src = 'assets/img/logo-editado.png';
  
    doc.addImage(logo_ipca, 'PNG', pdfWidht/3.2, pdfHeight/5, 85, 65, 'logo_IPCA', 'NONE', 0);
    doc.setFontSize(18);
    doc.text(`Institución de Parálisis Cerebral del Azuay`, pdfWidht/2,pdfHeight/2, {align:"center"});

    // doc.addImage(logo_ipca, 'PNG', pdfWidht/3, pdfHeight/10, 35, 25, 'logo_IPCA', 'NONE', 0);
    // doc.setFontSize(16);

    doc.setFontSize(14);
    doc.text(`Periodo Lectivo ${this.plan_pdf.periodo_lectivo.nombre}`, pdfWidht/2,pdfHeight/1.90, {align:"center"});
    doc.addPage('a4', "landscape")
    // doc.setFontSize(12);
    cols = [
      ["DATOS INFORMATIVOS",null, null, null, null],
      ['DOCENTE', 'ASIGNATURAS', 'ALUMNO', 'GRADO/CURSO', 'DESCRIPCIÓN GENERAL']
    ]
    let aux = [];
    valor.push(`${this.plan_pdf.docente.persona.primer_nombre} ${this.plan_pdf.docente.persona.segundo_nombre}
    ${this.plan_pdf.docente.persona.primer_apellido} ${this.plan_pdf.docente.persona.segundo_apellido}`)
    // valor.push(this.plan_pdf.asignaturas)
    this.plan_pdf.asignaturas.forEach( (a:any) => {
        aux.push(a.nombre)
      } )
    valor.push(aux);
    valor.push(`${this.plan_pdf.alumno.persona.primer_nombre} ${this.plan_pdf.alumno.persona.segundo_nombre} 
    ${this.plan_pdf.alumno.persona.primer_apellido} ${this.plan_pdf.alumno.persona.segundo_apellido}`)
    valor.push(this.plan_pdf.aula.nombre)
    valor.push(this.plan_pdf.descripcion)
    valores.push(valor);

    const head_info = cols
    const data_info = valores
    const head_2 = [admin_colums]
    const data_2 = admin_fields
    valor = []
    cols = []
    valores = []
    aux = []

    autoTable(doc, {
      head: head_info,
      body: data_info,
      theme: "striped",
      // startY: pdfHeight/2,
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })

    cols = [
      ["PLANIFICACIÓN",null, null, null, null, null],
      ['OBJETIVO GENERAL', 'METAS ESPECÍFICAS', 'NECESIDADES', 'POTENCIALIDADES', 'GUSTOS', 'DISGUSTOS']
    ]
    valor.push(this.plan_pdf.objetivo_general)
    // valor.push(this.plan_pdf.asignaturas)
    this.plan_pdf.metas_especificas.forEach( (a:any) => {
        aux.push(a)
      } )
    valor.push(aux);
    aux = []
    this.plan_pdf.necesidades.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)
    } )
    valor.push(aux)
    aux = []
    this.plan_pdf.potencialidades.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)
    } )
    valor.push(aux)
    aux = []
    this.plan_pdf.gustos.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)

    } )
    valor.push(aux)
    aux = []
    this.plan_pdf.disgustos.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)

    } )
    valor.push(aux)
    valores.push(valor);

    const head_plani_1 = cols
    const data_plani_1 = valores

    valor = []
    cols = []
    valores = []
    aux = []

    autoTable(doc, {
      head: head_plani_1,
      body: data_plani_1,
      theme: "striped",
      startY: pdfHeight/6,
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })

    cols = [
      ["PLANIFICACIÓN",null, null, null, ],
      ['DESEOS', 'SUEÑOS', 'ÁMBITOS', 'DOMINIOS']
    ]
    // valor.push(this.plan_pdf.objetivo_general)
    // valor.push(this.plan_pdf.asignaturas)
    this.plan_pdf.deseos.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)
      } )
    valor.push(aux);
    aux = []
    this.plan_pdf.suenos.forEach( (a:any) => {
      aux.push(`\n${a.nombre}: ${a.descripcion}`)
    } )
    valor.push(aux)
    aux = []
    this.plan_pdf.ambitos.forEach( (a:any) => {
      aux.push(a.nombre)
    } )
    valor.push(aux)
    aux = []
    this.plan_pdf.dominio.forEach( (a:any) => {
      aux.push(a.nombre)

    } )
    valor.push(aux)
    // aux = []
    // this.plan_pdf.disgustos.forEach( (a:any) => {
    //   aux.push(a.nombre)

    // } )
    // valor.push(aux)
    // valor.push(this.plan_pdf.aula.nombre)
    // valor.push(this.plan_pdf.descripcion)
    valores.push(valor);

    const head_plani_2 = cols
    const data_plani_2 = valores

    valor = []
    cols = []
    valores = []
    aux = []

    autoTable(doc, {
      head: head_plani_2,
      body: data_plani_2,
      theme: "striped",
      startY: pdfHeight/2.5,
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })

    cols = [
      ["DETALLE",null ],
      ['LOGROS', 'OBSERVACIONES']
    ]
    // valor.push(this.plan_pdf.objetivo_general)
    // valor.push(this.plan_pdf.asignaturas)
    this.plan_pdf.logros.forEach( (a:any) => {
      aux.push(a)
      } )
    valor.push(aux);
    valor.push(this.plan_pdf.observaciones);
    valores.push(valor)

    const head_detalle = cols
    const data_detalle = valores

    
    doc.addPage('a4',"landscape");
    autoTable(doc, {
      head: head_detalle,
      body: data_detalle,
      theme: "striped",
      // startY: pdfHeight/1.8,
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })
    
    autoTable(doc, {
      head: head_2,
      body: data_2,
      theme: "grid",
      startY: pdfHeight/5,
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })

    doc.setFontSize(8);
    doc.text('Documento generado por IPCAsist', pdfHeight/2, pdfWidht/1.03, {align:"center"});


    doc.save(`Planes_Vida_${this.plan_pdf.alumno.persona.primer_nombre}_${this.plan_pdf.alumno.persona.primer_apellido}_${this.plan_pdf.periodo_lectivo.nombre}.pdf`);
    this.plan_pdf = {};
    
    // doc.text(`Plan de Vida - ${this.plan_pdf.alumno.persona.primer_nombre} ${this.plan_pdf.alumno.persona.primer_apellido} - ${this.plan_pdf.periodo_lectivo.nombre}`, pdfWidht/2,pdfHeight/6, {align:"center"});
    

  }

  copiarPlan(event){
    console.log(event, "Event");
    this.mostrar_pdf = true;
    this.plan_pdf = event;
  }

}
