import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DocenteService } from "app/services/docente.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { AsignarDocente } from "app/clases/asignar-docente";
import { Docente } from "app/clases/docente";
import { Aula } from "app/clases/aula";
import { Periodo_Lectivo } from "app/clases/periodo_lectivo";
import { Table } from "primeng/table";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { AulasService } from "app/services/aulas.service";
import { Alumno } from "app/clases/alumno";
import { Personal } from "app/clases/personal";
import { Persona } from "app/clases/persona";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

// import pdfFonts from 'pdfmake/build/vfs_fonts';
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

  @ViewChild('dt') table: Table;

  cols: any[];
  displayDialog: boolean;
  mostrarAdmin: boolean;

  forma: FormGroup;
  forma_editar: FormGroup;

  asignaciones: AsignarDocente[];
  asignacion: AsignarDocente = {};
  asignacion_seleccionada: AsignarDocente;
  asignacion_editar: AsignarDocente;
  nueva_asignacion: boolean;

  // docente: Docente;

  docentes: Docente[];
  docentes_filtrados: Docente[];
  docentes_editados: Docente[];
  identificacion: string;

  // hora_entrada: any;
  // hora_salida: any;
  dia: Date;

  aula_filtrada: Aula;
  aula: Aula;
  aulas: Aula[];
  aulas_filtradas: Aula[];
  aulas_editadas: Aula[];
  nombre_aula: string;

  periodo_lectivo: Periodo_Lectivo;
  periodos_lectivos: Periodo_Lectivo[];
  periodos_filrados: Periodo_Lectivo[];

  data: {
      periodo_lectivo,
      docente_cedula,
      docente_nombre,
      horario_entrada,
      horario_salida,
      aula
    }

    administracion: {
      elaborado_por?:string,
      revisado_por?: string,
      aprobado_por?: string
    } = {};

    @ViewChild('tabla_aulas', {static: false}) tabla_aulas: ElementRef;



  constructor(
    private fb: FormBuilder,
    // private _ejemSrv: EjemplosService,
    private _docenteSrv: DocenteService,
    // private _planSrv: PlanVidaService,
    private _aulaSrv: AulasService,
    private modalService: NgbModal
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {

    this.mostrarAdmin = false;
  
    this.asignacion = new AsignarDocente();

    this._aulaSrv.getLista("aulas").subscribe( (aulas: Aula[]) => {
      
      this.aulas = aulas;

      this.aulas.forEach( (aula:Aula) => {

        if (aula.alumnos.length != 0) {
          aula.alumnos.forEach( (alumno: Alumno) => {
            this._aulaSrv.getDetalle(alumno, "alumno").subscribe( (student:Alumno) => {
              alumno = student;
              
              this._aulaSrv.getDetalle(alumno.id, "persona").subscribe( (person:Persona) =>{
                alumno.persona = person;
              } )
              aula.alumnos.push(alumno)
            })
          } )
        }

        if(aula.docentes.length != 0){
          aula.docentes.forEach( (docente: Personal) => {
            this._aulaSrv.getDetalle(docente, "personal").subscribe( (teacher:Personal) => {
              docente = teacher
              this._aulaSrv.getDetalle(docente.id, "persona").subscribe( (person:Persona) =>{
                docente.persona = person;
              } )
              aula.docentes.push(docente);
            })
          } )
        }
        
        this._aulaSrv.getDetalle(aula.id, "periodo_lectivo").subscribe( (periodo:Periodo_Lectivo) => {
          aula.periodo = periodo;
        } )

      } );

      this.aulas.forEach( (aula:Aula) => {
      
        let num_docente = aula.docentes.length;
        let num_alumno = aula.alumnos.length;
        
        for (let index = 0; index < num_docente; index++) {
         this.removeItemFromArr(aula.docentes,index);
          
        }

        for (let index = 0; index < num_alumno; index++) {
          
         this.removeItemFromArr(aula.alumnos,index);
          
        }
      } )
    });

    this._aulaSrv.getLista("periodos_lectivos").subscribe( (periodos_lectivos: Periodo_Lectivo[]) =>{
      
      this.periodos_lectivos = periodos_lectivos;
  
    } )

    this._docenteSrv
      .getAsignaciones()
      .subscribe((asignaciones: AsignarDocente[]) => {
        this.asignaciones = asignaciones;
      });

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      this.docentes = docentes;
    });


    this.cols = [
      { field: "nombre", header: "AULA" },
      { field: "docente.persona", header: "DOCENTES" },
      { field: "capacidad", header: "CAPACIDAD" },
      { field: "periodo_lectivo.nombre", header: "PERÍODO LECTIVO" },
      // { field: "horario_entrada.hora", header: "HORARIO DE ENTRADA" },
      // { field: "horario_salida.hora", header: "HORARIO DE SALIDA" },
      { field: "jornada", header: "JORNADA" },
    ];
  }

  removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
    arr.splice( i, 1 );
}

  crearFormulario() {
    this.forma = this.fb.group({
      // identificacion: new FormControl(this.identificacion, [Validators.required, Validators.minLength(2)]),
      periodo_lectivo: [
        this.asignacion.periodo_lectivo,
        Validators.required
      ],
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

  cloneAsignacion(c: AsignarDocente): AsignarDocente {
    let asignacion = {};
    for (let prop in c) {
      asignacion[prop] = c[prop];
    }
    return asignacion;
  }

  // Método no Válido - Edición
  onRowSelect(event) {

    this.nueva_asignacion = false;
    this.asignacion_editar = this.cloneAsignacion(event.data);
    this.crearFormularioEditar(this.asignacion_editar);
    
    this.displayDialog = true;
  }

  
  filtrarContenido(event: any){
    this.mostrarAdmin = true;
  }
  
  abrirPDF(){
    this.mostrarAdmin = false;
    this.generarAulasPorPeriodo();
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
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

  nuevaData(asignacion:AsignarDocente){

    this.data.periodo_lectivo = asignacion.periodo_lectivo.nombre
      this.data.docente_cedula = asignacion.docente.persona.identificacion
      this.data.docente_nombre =  `${asignacion.docente.persona.primer_nombre} ${asignacion.docente.persona.primer_apellido}`
      this.data.horario_entrada = asignacion.horario_entrada.hora
      this.data.horario_salida = asignacion.horario_salida.hora
      this.data.aula = asignacion.aula.nombre

      return this.data

  }
  

  generarAulasPorPeriodo(){

    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    let aulas_filtradas=[];
    let cols: string[] = [];
    let valor = [];
    let valores = [];

    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.administracion.elaborado_por, this.administracion.revisado_por, this.administracion.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]

    this.aulas.forEach( (aula:Aula) => {
      if(aula.periodo.id == this.periodo_lectivo.id){
        aulas_filtradas.push(aula);
      }
    } )

    this.cols.forEach( col => {
      cols.push(col.header);
    } )

    aulas_filtradas.forEach( (aula:Aula) => {
      let aux = [];
      valor.push(aula.nombre);
      aula.docentes.forEach( (docente:Personal) => {
        aux.push(`${docente.persona.primer_nombre} ${docente.persona.primer_apellido}`)
      } )
      valor.push(aux);
      valor.push(aula.capacidad);
      valor.push(aula.periodo.nombre);
      valor.push(aula.jornada);
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

    doc.addImage(logo_ipca, 'PNG', pdfWidht/3, pdfHeight/5, 75, 65, 'logo_IPCA', 'NONE', 0);
    doc.setFontSize(20);
    doc.text(`Aulas por Período Lectivo ${this.periodo_lectivo.nombre}`, pdfWidht/2,pdfHeight/2, {align:"center"});

    doc.addPage('a4');
    autoTable(doc, {
      head: head,
      body: data,
      theme: "striped",
      didDrawCell: (data) => {
        console.log(data.column.index)
      },
    })
    doc.addPage('a4');

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

    doc.save(`Aulas_${this.periodo_lectivo.nombre}.pdf`);
    this.periodo_lectivo = {};

  }


}
