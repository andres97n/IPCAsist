import { Component, OnInit, ViewChild } from "@angular/core";
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
import { Docente } from "app/clases/docente";
import { Aula } from "app/clases/aula";
import { Table } from "primeng/table";
import { Persona } from "app/clases/persona";
import { Personal } from "app/clases/personal";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
// import { Table } from "primeng";

@Component({
  selector: "app-pasante",
  templateUrl: "./pasante.component.html",
  styleUrls: ["./pasante.component.css", "./pasante.component.scss"],
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

  cols: any[];
  displayDialog: boolean;
  mostrarAdmin: boolean;

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

  mostrar_pdf: boolean;
  pasante_admin: {
        elaborado_por?:string,
        revisado_por?: string,
        aprobado_por?: string
      } = {};

  horario = Date;
  es: any;

  forma: FormGroup;

  lista_aulas: Aula[];

  pasantes: Pasante[];
  pasante: Pasante;
  pasante_seleccionado: Pasante;
  pasante_editar: Pasante;
  nuevo_pasante: boolean;

  docentes: Personal[];
  docentes_filtrados: Personal[];

  administracion: {
    elaborado_por?:string,
    revisado_por?: string,
    aprobado_por?: string
  } = {};

  aulas_pdf:Aula;

  // hora_visita: Date;

  @ViewChild('dt') table: Table;

  constructor(
    private fb: FormBuilder,
    private _ejemplosSrv: EjemplosService,
    private _pasanteSrv: PasantesService,
    private modalService: NgbModal
  ) {
    this.crearFormulario();

    this.pasante = new Pasante();
    this.mostrar_pdf = false

    this.universidades = this._ejemplosSrv.getUniversidades();
  }

  ngOnInit(): void {

    this.mostrarAdmin = false;

    this._pasanteSrv.getLista("pasantes").subscribe((pasantes: Pasante[]) => {
      this.pasantes = pasantes;
      // this.instituciones = [];
      // this.institucion = {};

      this.pasantes.forEach( (pasante:Pasante) => {

        if(pasante.aula.length != 0){
          pasante.aula.forEach( (aula: Aula) => {
            this._pasanteSrv.getDetalle(aula, "aula").subscribe( (aula:Aula) => {
              // if(pasante.aula.length == 1){

              //   pasante.aula = []
              // }
              pasante.aula.push(aula);
              // this._aulaSrv.getDetalle(teacher.id, "persona").subscribe( (person:Persona) =>{
              //   teacher.persona = person;
              // } )
            })
          } )
        }
        // this.institucion.nombre = pasante.institucion
        // this.instituciones.push(this.institucion);
        // this.pasante.aula.reverse();
      } )

      this.pasantes.forEach( (pasante:Pasante) => {
      
        let num_aula = pasante.aula.length;
        // let num_alumno = aula.alumnos.length;
        
        for (let index = 0; index < num_aula; index++) {
          // console.log(aula.a);
          
         this.removeItemFromArr(pasante.aula,index);
          
        }

        // for (let index = 0; index < num_alumno; index++) {
        //   // console.log(aula.a);
          
        //  this.removeItemFromArr(aula.docentes,index);
          
        // }
      } )

      console.log(this.pasantes, "PASANTES");
      // this.institucion = {}
      // this.instituciones
    });

    this._pasanteSrv.getLista("aulas").subscribe( (aulas: Aula[] ) => {
      this.lista_aulas = aulas;
      console.log(this.lista_aulas, "Aulas");
    });

    this._pasanteSrv.getLista("personal").subscribe((docentes: Personal[]) => {
      this.docentes = docentes;
      this.docentes.forEach( (docente)=> {
        this._pasanteSrv.getDetalle(docente.persona, "persona").subscribe( (persona: Persona) => {
          docente.persona = persona;
        } )
      })
      console.log(this.docentes, "DOCENTES");
    });

    this.cols = [
      { field: "persona.identificacion", header: "CÉDULA" },
      { field: "persona", header: "NOMBRE" },
      { field: "aula", header: "AULAS" },
      { field: "institución", header: "INSTITUCIÓN" },
      { field: "docente.primer_nombre", header: "TUTOR" },
    ];

    this.genero = [
      { name: "Masculino", value: "M" },
      { name: "Femenino", value: "F" },
      { name: "Otro", value: "O" },
    ];

    // this.tipo_sangre = [
    //   {
    //     name: "O negativo",
    //     value: "O-",
    //   },
    //   { name: "O positivo", value: "O+" },
    //   {
    //     name: "A negativo",
    //     value: "A-",
    //   },
    //   {
    //     name: "A positivo",
    //     value: "O+",
    //   },
    //   {
    //     name: "B negativo",
    //     value: "B-",
    //   },
    //   {
    //     name: "B positivo",
    //     value: "B+",
    //   },
    //   {
    //     name: "AB negativo",
    //     value: "AB-",
    //   },
    //   {
    //     name: "AB positivo",
    //     value: "AB+",
    //   },
    // ];

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
      institucion: ["", Validators.required],
      tutor: ["", Validators.required],
      especialidad: ["", Validators.required],
      num_horas: ["", Validators.required],
      aulas: ["", Validators.required],
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

  // generoSeleccionado(event) {
  //   console.log(event.value);
  // }

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
    // console.log(this.forma.value);
    let tutor: Personal =  this.forma.value.tutor;
    let aulas = [];
    this.forma.value.aulas.forEach(aula => {
      aulas.push(aula.id)
    });

    let datos = {
      persona: {
        identificacion: this.forma.value.identificacion,
        nombres: this.forma.value.identidad.nombres,
        apellidos: this.forma.value.identidad.apellidos,
        edad: this.forma.value.edad,
        genero: this.forma.value.genero.value,
        correo: this.forma.value.correo,
        contacto: this.forma.value.contacto
      },
      institucion: this.forma.value.institucion,
      tutor: tutor,
      aula: aulas,
      especialidad: this.forma.value.especialidad,
      numHoras: this.forma.value.num_horas
      }

      console.log(datos, "PASANTE");
      
      this._pasanteSrv.setPasante(datos).subscribe( data => {
        console.log(data, "Se guardó con éxito");
        
      } )

      this.forma.reset();
  }

  editarPasante(){

    // console.log(this.pasante_seleccionado);
    let aulas = []

    this.pasante_editar.aula.forEach( data => {
      if(data.id){
        aulas.push(data.id)
      }
    } )
    

    let datos = {
      id: this.pasante_editar.id,
      persona: {
        identificacion: this.pasante_editar.persona.identificacion,
        nombres: this.pasante_editar.persona.nombres,
        apellidos: this.pasante_editar.persona.apellidos,
        edad: this.pasante_editar.persona.edad,
        genero: this.pasante_editar.persona.genero.value,
        correo: this.pasante_editar.persona.correo,
        contacto: this.pasante_editar.persona.contacto
      },
      institucion: this.pasante_editar.institucion.name,
      tutor: this.pasante_editar.tutor,
      aula: aulas,
      especialidad: this.pasante_editar.especialidad,
      numHoras: this.pasante_editar.numHoras
      }
      

      console.log(datos, "DATOS FINALES");

      this._pasanteSrv.editarPasante(datos).subscribe( data => {

        console.log(data, "PASANTE EDITADO");
        this.displayDialog = false;

      } )
      

  }

  onRowSelect(event) {
    this.nuevo_pasante = false;
    this.pasante_editar = this.clonePasante(event.data);
    this.displayDialog = true;
    // console.log(this.pasante_seleccionado);
    
    // switch (this.pasante_editar.persona) {
    //   case "F":
    //     this.selectedGen = {
    //       name: "Femenino",
    //       value: "F",
    //     };
    //     break;
    //   case "M":
    //     this.selectedGen = {
    //       name: "Masculino",
    //       value: "M",
    //     };
    //     break;
    //   case "O":
    //     this.selectedGen = {
    //       name: "Otro",
    //       value: "O",
    //     };
    //     break;
    // }
    this.editarUniversidad(this.pasante_editar.institucion);
    this.editarGenero(this.pasante_editar.persona.genero)
    // this.pasante_seleccionado.institucion = this.auto_universidad;
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
        this.pasante_editar.institucion = institucion;
      }
    });
  }

  editarGenero(u: string) {
    this.genero.forEach((g) => {
      // console.log(u);
      
      if (g.value === u) {
        this.pasante_editar.persona.genero = g;
      }
    });
  }

  removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
    arr.splice( i, 1 );
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

  filtrarContenido(e) {
    console.log(e.value);
    this.mostrarAdmin = true;
  }

  abrirPDF(){
    this.mostrarAdmin = false;
    this.generarPasantesPorAula();
  }

  generarPasantesPorAula(){

    let pasantes_pdf:Pasante[] = this.pasantes
    console.log(pasantes_pdf, "PDF");
    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    let pasantes_filtrados=[];
    let cols: string[] = [];
    let valor = [];
    let valores = [];

    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.administracion.elaborado_por, this.administracion.revisado_por, this.administracion.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]
    
    pasantes_pdf.forEach( (pasante:Pasante) => {
      // console.log(pasante.aula.length);
      // 
      // if(pasante.aula.length != 0){
        pasante.aula.forEach( (aula:Aula) => {
          if(aula.id == this.aulas_pdf.id){
            pasantes_filtrados.push(pasante);
          }
        } )
      // }
    } )



    this.cols.forEach( col => {
      cols.push(col.header);
    } )

    pasantes_filtrados.forEach( (pasante:Pasante) => {
      let aux = [];
      valor.push(pasante.persona.identificacion);
      valor.push(`${pasante.persona.nombres} ${pasante.persona.apellidos}`);
      pasante.aula.forEach( (aula:Aula) => {
        aux.push(aula.nombre);
      } )
      valor.push(aux);
      valor.push(pasante.institucion);
      valor.push(`${pasante.tutor.persona.primer_nombre} ${pasante.tutor.persona.primer_apellido}`);
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
    doc.text(`Pasantes por ${this.aulas_pdf.nombre}`, pdfWidht/2,pdfHeight/2, {align:"center"});

    doc.addPage('a4')
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

    doc.save(`Pasantes_${this.aulas_pdf.nombre}.pdf`);
    this.aulas_pdf = {};

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

  generarPasante(){

    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    // let visitas_filtradas=[];
    // let cols: string[] = [];
    // let valor = [];
    // let valores = [];

    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.pasante_admin.elaborado_por, this.pasante_admin.revisado_por, this.pasante_admin.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]

    // const head = [cols]
    // const data = valores
    const head_2 = [admin_colums]
    const data_2 = admin_fields
    const doc = new jsPDF("p","mm","a4");
    const pdfWidht=210;  // width of A4 in mm
    const pdfHeight=297;  // height of A4 in mm

    let logo_ipca= new Image();
    logo_ipca.src = 'assets/img/logo-editado.png';

    doc.addImage(logo_ipca, 'PNG', pdfWidht/2.5, pdfHeight/17, 45, 25, 'logo_IPCA', 'NONE', 0);
    doc.setFontSize(18);
    doc.text(`Institución de Parálisis Cerebral del Azuay`, pdfWidht/2,pdfHeight/5, {align:"center"});

    doc.setFontSize(16);
    doc.text(`Detalle de Pasante`, pdfWidht/2,pdfHeight/4, {align:"center"});
    // doc.addPage('a4', "landscape")
    doc.setFontSize(14);
    doc.text(`Identificación: ${this.pasante_editar.persona.identificacion}`, 20, 90, {align:"left"});
    doc.text(`Nombre: ${this.pasante_editar.persona.nombres} ${this.pasante_seleccionado.persona.apellidos}`, 20, 105, {align:"left"});
    doc.text(`Edad: ${this.pasante_editar.persona.edad}`, 20, 120, {align:"left"});
    doc.text(`Correo: ${this.pasante_editar.persona.correo}`, 20, 135, {align:"left"});
    doc.text(`Contacto: ${this.pasante_editar.persona.contacto}`, 20, 150, {align:"left"});
    doc.text(`Nombre de la Institución: ${this.pasante_editar.institucion.name} `, 20, 165, {align:"left"});
    doc.text(`Nombre de Tutor: ${this.pasante_editar.tutor.persona.primer_nombre} ${this.pasante_editar.tutor.persona.segundo_nombre} ${this.pasante_editar.tutor.persona.primer_apellido} ${this.pasante_editar.tutor.persona.segundo_apellido}`, 20, 180, {align:"left"});
    let i = 195
    this.pasante_editar.aula.forEach( (aula:any) => {
      doc.text(`Nombre: ${aula.nombre}`, 20, i, {align:"left"});
      i = i + 15;
    } )
    doc.text(`Especialidad: ${this.pasante_editar.especialidad}`, 20, i, {align:"left"});
    doc.text(`Número de horas diarias previstas: ${this.pasante_editar.numHoras}`, 20, i+15, {align:"left"});
    
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


    doc.save(`Pasante_${this.pasante_editar.persona.nombres}_${this.pasante_editar.persona.apellidos}.pdf`);
    this.mostrar_pdf = false;
    this.displayDialog = false;

  }

  mostrarPasante(){
    this.mostrar_pdf = true;
    
    // this.generarPasante();
  }

  eliminarPasante(pasante:Pasante){

    this._pasanteSrv.eliminarPasante(pasante.id).subscribe( (data) => {
      console.log(data, "ELIMINADO CORRECTAMENTE");
      this.displayDialog = false;
    })

  }

}
