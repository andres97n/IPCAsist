import { Component, OnInit, ViewChild } from "@angular/core";
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
import { AsignarDocente } from "app/clases/asignar-docente";
import { Docente } from "app/clases/docente";
import { Aula } from "app/clases/aula";
import { Periodo_Lectivo } from "app/clases/periodo_lectivo";
import { PlanVidaService } from "app/services/plan-vida.service";

import pdfMake from 'pdfmake/build/pdfmake';
import { Util } from "app/utils/util";
import { Table } from "primeng/table";
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

  constructor(
    private fb: FormBuilder,
    // private _ejemSrv: EjemplosService,
    private _docenteSrv: DocenteService,
    private _planSrv: PlanVidaService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {

    // Util.getImageDataUrlFromLocalPath1('assets/img/logo-editado.png').then(
    //   result => this.logoDataUrl = result
    // )
    // console.log(this.logoDataUrl);
    
    this.asignacion = new AsignarDocente();

    this._planSrv.getPeriodoLectivo().subscribe( (periodos_lectivos: Periodo_Lectivo[]) =>{
      
      this.periodos_lectivos = periodos_lectivos;
      console.log(this.periodos_lectivos);
    } )

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
      { field: "nombre", header: "AULA" },
      { field: "docentes.persona.primerNombre", header: "DOCENTES" },
      { field: "pasantes.persona.primer_apellido", header: "PASANTES" },
      { field: "periodo_lectivo.nombre", header: "PERÍODO LECTIVO" },
      // { field: "horario_entrada.hora", header: "HORARIO DE ENTRADA" },
      // { field: "horario_salida.hora", header: "HORARIO DE SALIDA" },
      { field: "especialidades.nombre", header: "ESPECIALIDADES" },
    ];
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

  // Método no Válido - Edición
  onRowSelect(event) {
    console.log(this.asignacion_seleccionada);

    this.nueva_asignacion = false;
    this.asignacion_editar = this.cloneAsignacion(event.data);
    this.crearFormularioEditar(this.asignacion_editar);
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
    console.log(this.asignacion);
    
  }

  //PENDIENTE
  filtrarContenido(event: any){
    console.log(event.value.nombre);
    
    this.table.filterGlobal(event.value, 'contains')
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

  asignacion_periodo(){

  }

  async openPdf(){
    const fonts = {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
      },
      Symbol: {
        normal: 'Symbol'
      },
      ZapfDingbats: {
        normal: 'ZapfDingbats'
      }
    };

    // console.log(this.asignacion, "PDF");

    // this.asignaciones.forEach( (asignacion)=> {

      const documentDefinition = { 
        
        header: [
          {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="pattern_9rgHkX" patternUnits="userSpaceOnUse" width="9.5" height="9.5" patternTransform="rotate(45)"><line x1="0" y="0" x2="0" y2="9.5" stroke="#DFC500" stroke-width="1"/></pattern></defs> <rect width="100%" height="100%" fill="url(#pattern_9rgHkX)" opacity="1"/></svg>',
            fit: [20,10],
            width: 20
          }
        ],
  
        background: function(currentPage, pageSize) {
          return `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`
        },
  
        content: [
          {
            image: await this.getBase64ImageFromURL('assets/img/logo-editado.png'),
            width: 80,
            height: 50
          },
          {
            text: [
              'This paragraph is defined as an array of elements to make it possible to ',
              { text: 'restyle part of it and make it bigger ', fontSize: 40 },
              'than the rest.'
            ]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 100, '*'],
              
              body: [
                [
                  { text: 'PERÍODO LECTIVO', bold: true },
                  { text: 'DOCENTE', bold: true },
                  { text: 'HORA DE ENTRADA', bold: true },
                  { text: 'HORA DE SALIDA', bold: true },
                  { text: 'AULA ASIGNADA', bold: true },
                ],
                [ this.asignacion.periodo_lectivo.nombre, 
                  `${this.asignacion.docente.persona.primerNombre} ${this.asignacion.docente.persona.primerApellido}`, 
                  this.asignacion.horario_entrada.hora, 
                  this.asignacion.horario_salida.hora,
                  this.asignacion.aula.nombre
                ],
                ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
                [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4', 'Val 5']
              ]
            }
          },
          {
  
          }
        ], 
       }
      
      pdfMake.createPdf(documentDefinition).open();

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
        docente.persona.primerApellido
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
      this.data.docente_nombre =  `${asignacion.docente.persona.primerNombre} ${asignacion.docente.persona.primerApellido}`
      this.data.horario_entrada = asignacion.horario_entrada.hora
      this.data.horario_salida = asignacion.horario_salida.hora
      this.data.aula = asignacion.aula.nombre

      return this.data

  }

  async generarPlanes(){
    console.log("CLICK EN GENERAR");
    let asignacion_pdf: any[];

    this.asignaciones.forEach( (asignacion: AsignarDocente)=> {
      
      // let data: {
      //   periodo_lectivo,
      //   docente_cedula,
      //   docente_nombre,
      //   horario_entrada,
      //   horario_salida,
      //   aula
      // }

      // this.data.periodo_lectivo = asignacion.periodo_lectivo.nombre
      // this.data.docente_cedula = asignacion.docente.persona.identificacion
      // this.data.docente_nombre =  `${asignacion.docente.persona.primer_nombre} ${asignacion.docente.persona.primer_apellido}`
      // this.data.horario_entrada = asignacion.horario_entrada.hora
      // this.data.horario_salida = asignacion.horario_salida.hora
      // this.data.aula = asignacion.aula.nombre

      // asignacion_pdf.push(this.nuevaData(asignacion));

      console.log(asignacion);
      
    } );

    function buildTableBody(data, columns) {
      var body = [];
  
      body.push(columns);
  
      data.forEach(function(row) {
          var dataRow = [];
  
          columns.forEach(function(column) {
              dataRow.push(row[column].toString());
          })
  
          body.push(dataRow);
      });
  
      return body;
  }
  
  function table(data, columns) {
      return {
          table: {
              headerRows: 1,
              body: buildTableBody(data, columns)
          }
      };
  }
  
  // var dd = {
  //     content: [
  //         { text: 'Dynamic parts', style: 'header' },
  //         table(externalDataRetrievedFromServer, ['name', 'age'])
  //     ]
  // }

    const documentDefinition = { 

      background: function(currentPage, pageSize) {
        return `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`
      },

      content: [
        {
          image: await this.getBase64ImageFromURL('assets/img/logo-editado.png'),
          width: 80,
          height: 50
        },
        {
          text: [
            'This paragraph is defined as an array of elements to make it possible to ',
            { text: 'restyle part of it and make it bigger ', fontSize: 40 },
            'than the rest.'
          ]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 100, '*'],
            
            body: [
              [
                { text: 'PERÍODO LECTIVO', bold: true },
                { text: 'DOCENTE', bold: true },
                { text: 'HORA DE ENTRADA', bold: true },
                { text: 'HORA DE SALIDA', bold: true },
                { text: 'AULA ASIGNADA', bold: true },
              ],
              [ this.asignacion.periodo_lectivo.nombre, 
                `${this.asignacion.docente.persona.primerNombre} ${this.asignacion.docente.persona.primerApellido}`, 
                this.asignacion.horario_entrada.hora, 
                this.asignacion.horario_salida.hora,
                this.asignacion.aula.nombre
              ],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'],
              [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4', 'Val 5']
            ]
          }
        },
        // table(this.asignaciones, ['PERÍODO LECTIVO', 'CÉDULA DE DOCENTE', 'NOMBRE DE DOCENTE', 'HORA DE ENTRADA', 'HORA DE SALIDA', 'AULA ASIGNADA'])
      ], 
     }
    // } );
    
    pdfMake.createPdf(documentDefinition).open();

  }

}
