import { Component, OnInit } from "@angular/core";
import { Persons } from "app/clases/persons";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EjemplosService } from "app/services/ejemplos.service";
import { Visita_Empresa } from "app/clases/visita-empresa";
import { VisitasService } from "app/services/visitas.service";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Docente } from "app/clases/docente";
import { DocenteService } from "app/services/docente.service";
import { Empresa } from "app/clases/empresa";

@Component({
  selector: "app-visita-empresa",
  templateUrl: "./visita-empresa.component.html",
  styleUrls: ["./visita-empresa.component.css"],
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
export class VisitaEmpresaComponent implements OnInit {
  persons: Persons[] = [];
  cols: any[];
  es: any;
  celular: number;

  forma: FormGroup;

  displayDialog: boolean;

  visitas: Visita_Empresa[];
  visita: Visita_Empresa;
  visita_seleccionada: Visita_Empresa;
  nueva_visita: boolean;
  visita_editar: Visita_Empresa;

  docentes: Docente[];
  docentes_filtrados: Docente[];

  empresas: Empresa[];

  constructor(
    private fb: FormBuilder,
    private _ejemplosSrv: EjemplosService,
    private _visitasSrv: VisitasService,
    private _docenteSrv: DocenteService
  ) {

    this.visita = new Visita_Empresa();
    this.crearFormulario();
  }

  ngOnInit(): void {
    this._ejemplosSrv.getPersons().subscribe((persons: Persons[]) => {
      console.log(persons);

      this.persons = persons;
    });

    this._visitasSrv.getVisitas().subscribe((visitas: Visita_Empresa[]) => {
      console.log(visitas);
      this.visitas = visitas;
    });

    this._docenteSrv.getDocentes().subscribe((docentes: Docente[]) => {
      console.log(docentes);
      this.docentes = docentes;
    });

    this._visitasSrv.getEmpresas().subscribe((empresa: Empresa[])=> {
      this.empresas = empresa;
      console.log(this.empresas);
      
    } )

    this.cols = [
      { field: "empresa.nombre", header: "NOMBRE DE EMPRESA" },
      { field: "empresa.representante", header: "REPRESENTANTE" },
      { field: "encargado_visita", header: "ENCARGADO DE VISITA" },
      { field: "fecha_visita", header: "FECHA DE VISITA" },
      { field: "hora_visita", header: "HORA DE VISITA" },
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
      direccion: this.fb.group({
        calle_principal: ["", Validators.required],
        calles_secundaria: ["", Validators.required]
      }),
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

  onRowSelect(event) {
    this.nueva_visita = false;
    this.visita_editar = this.clonePasante(event.data);
    this.displayDialog = true;
    console.log(this.visita);

    // this.editarUniversidad(this.pasante_editar.institucion);
  }



  clonePasante(c: Visita_Empresa): Visita_Empresa {
    let visita = {};
    for (let prop in c) {
      visita[prop] = c[prop];
    }
    return visita;
  }

  filtrarDocenteEditar(event) {
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

  openPdf(){

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

    let pagesize;
    // let PdfPrinter = require('pdfmake');
    // let printer = new PdfPrinter(fonts);
    // let fs = require('fs');

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
      info: {
        title: 'awesome Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
        },
      content: 'This is an sample PDF printed with pdfMake', 
     }

      // let pdfDoc = printer.createPdfKitDocument(documentDefinition);
      // pdfDoc.pipe(fs.createWriteStream('document.pdf'));
      // pdfDoc.end();
        
    pdfMake.createPdf(documentDefinition).open();
  }
  
}
