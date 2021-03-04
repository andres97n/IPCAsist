import { Component, OnInit, ViewChild } from "@angular/core";
import { Form, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EjemplosService } from "app/services/ejemplos.service";
import { Visita_Empresa } from "app/clases/visita-empresa";
import { VisitasService } from "app/services/visitas.service";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
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
import { Persona } from "app/clases/persona";
import { Personal } from "app/clases/personal";
import { Table } from "primeng/table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
  cols: any[];
  es: any;
  celular: number;

  forma: FormGroup;
  forma_empresa: FormGroup;
  mostrarAdmin: boolean;

  administracion: {
      elaborado_por?:string,
      revisado_por?: string,
      aprobado_por?: string
    } = {};

  empresa_pdf: Empresa;

  mostrar_nueva_empresa: boolean;

  displayDialog: boolean;

  visitas: Visita_Empresa[];
  visita: Visita_Empresa;
  visita_seleccionada: Visita_Empresa;
  nueva_visita: boolean;
  visita_editar: Visita_Empresa;

  docentes: Docente[];
  docentes_filtrados: Docente[];

  empresas: Empresa[];
  empresa_filtrada: Empresa[];
  empresa: Empresa;
  tiempo: {
    hour: number,
    minute: number
  }

  @ViewChild('dt') table: Table;

  constructor(
    private fb: FormBuilder,
    private _visitasSrv: VisitasService,
    private modalService: NgbModal
  ) {

    this.visita = new Visita_Empresa();
    this.crearFormulario();

    this.mostrarAdmin = false;
  }

  ngOnInit(): void {

    // this._visitasSrv.getVisitas().subscribe((visitas: Visita_Empresa[]) => {
    //   console.log(visitas);
    //   this.visitas = visitas;
    // });

    this._visitasSrv.getLista("personal").subscribe((personal: Personal[]) => {
      this.docentes = personal;
      console.log(this.docentes, "Docentes");
      this.docentes.forEach( (docente)=> {
        this._visitasSrv.getDetalle(docente.persona, "persona").subscribe( (persona: Persona) => {
          docente.persona = persona;
        } )
      })
    });

    this._visitasSrv.getLista("empresas").subscribe((empresa: Empresa[])=> {
      this.empresas = empresa;
      console.log(this.empresas,"Empresas");
      
    } )

    this._visitasSrv.getLista("visitas").subscribe( (visitas:Visita_Empresa[]) => {
      this.visitas = visitas;
      this.visitas.forEach( (visita) => {
        this._visitasSrv.getDetalle(visita.empresa, "empresa").subscribe( (enterprise:Empresa) => {
          visita.empresa = enterprise;
        })
      } )
      console.log(this.visitas, "VISITAS");
      
    } )

    this.cols = [
      { field: "empresa.nombre", header: "NOMBRE DE EMPRESA" },
      { field: "motivo_visita", header: "MOTIVO DE VISITA" },
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
      acompanantes: this.fb.array([]),
      motivo_visita: ["", Validators.required],
      guia: ["", Validators.required],
      fecha_visita: ["", Validators.required],
      horario_visita: ["", Validators.required],
      // this.fb.group({
      //   horario_entrada: ["", Validators.required],
      //   horario_salida: ["", Validators.required],
      // }),
      observacion: ["", Validators.required],
    });
  }

  crearFormularioEmpresa(){
    this.forma_empresa = this.fb.group({
      nombre : ["", Validators.required],
      acompantes: this.fb.array([]),
      contacto: [""],
      correo: [""],
      direccion : ["", Validators.required]
    });
    console.log("Se creo el formulario");
    
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  agregarAcompanante(){
    this.acompanantes.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        contacto: this.fb.control("")
      })
    )
  }

  borrarAcompanante(i: number){
    this.acompanantes.removeAt(i);
  }

  get acompanantes() {
    return this.forma.get("acompanantes") as FormArray;
  }

  guardarVisita() {
    console.log(this.forma);
    this.visita = this.forma.value;
    let hora = `${this.forma.value.horario_visita.hour}:${this.forma.value.horario_visita.minute}`;
  
    let visita = {
      id: null,
      empresa: this.visita.empresa.id,
      motivo_visita: this.visita.motivo_visita,
      acompanantes: this.visita.acompanantes,
      encargado_visita: this.forma.value.guia,
      fecha_visita: this.forma.value.fecha_visita,
      hora_visita: hora,
      observaciones: this.visita.observaciones
    }

    console.log(visita, "VISITA FINAL");
    
    this._visitasSrv.setVisita(visita).subscribe( (data) => {
      console.log(data, "Se guardo correctamente");
      
    } )

    this.forma.reset();

  }

  editarVisita(){

    if(!this.nueva_visita){
      let hora = `${this.tiempo.hour}:${this.tiempo.minute}`;
    // console.log(hora);
  
      let visita = {
        id: this.visita_seleccionada.id,
        empresa: this.visita_seleccionada.empresa.id,
        motivo_visita: this.visita_seleccionada.motivo_visita,
        acompanantes: this.visita.acompanantes,
        encargado_visita: this.visita_seleccionada.encargado_visita,
        fecha_visita: this.visita_seleccionada.fecha_visita,
        hora_visita: hora,
        observaciones: this.visita_seleccionada.observaciones
      }

      console.log(visita, "EDITAR");

      this._visitasSrv.editarVisita(visita).subscribe( (data) => {
        console.log(data, "Se editó correctamente");
        this.displayDialog = false;
      } )
      
      
    }

  }

  clonePasante(c: Visita_Empresa): Visita_Empresa {
    let visita = {};
    for (let prop in c) {
      visita[prop] = c[prop];
    }
    return visita;
  }

  onRowSelect(event) {
    this.nueva_visita = false;
    // this.visita_editar = this.clonePasante(event.data);
    this.displayDialog = true;
    let t = this.visita_seleccionada.hora_visita.split(":");
    console.log(t, "TIEMPO");
    let hora = Number(t[0]);
    let min = Number(t[1]);
    
    this.tiempo = {hour: hora, minute: min}
    console.log(this.visita_seleccionada,"VISITA SELECCIONADA");

    // this.editarUniversidad(this.pasante_editar.institucion);
  }


  filtrarDocenteEditar(event) {
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

  filtrarDocente(event) {
    let query = event.query;
    let docentes: Docente[] = this.docentes;

    this.docentes_filtrados = [];

    docentes.forEach( (docente:Docente) => {
      // console.log(docente);
      
      
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

  

  filtrarEmpresa(event) {
    let query = event.query;
    let empresas: Empresa[] = this.empresas;

    console.log(empresas);
    
    this.empresa_filtrada = [];
    empresas.forEach( (empresa) => {

      if (
        empresa.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        this.empresa_filtrada.push(empresa);
      } 
    } )
  }

  

  getFormato(e){
    // console.log(e.value, "fecha");
    let dia = e.value.getDate();
    let mes = e.value.getMonth() + 1;;
    let anio = e.value.getFullYear();
    let fecha = `${anio}-${mes}-${dia}`
    console.log(fecha, "fecha");
    if(!this.nueva_visita){
      this.visita_seleccionada.fecha_visita = fecha;
    } else{

      this.forma.get("fecha_visita").setValue(fecha);
    }
    
  }

  extraerEmpresa(empresa){
    this.forma.patchValue({
      empresa: empresa.nombre,
      motivo_visita: null,
      representante: {
        nombres: empresa.representante.primerNombre,
        apellidos: empresa.representante.primerApellido,
      },
      contacto: empresa.representante.contacto,
      correo: empresa.representante.correo,
      direccion: {
        calle_principal: empresa.direccion.callePrincipal,
        calles_secundaria: empresa.direccion.calleSecundaria
      },
      // guia: null,
      // fecha_visita: null,
      // horario_visita: {
      //   horario_entrada: null,
      //   horario_salida: null,
      // },
      // observacion: null,
    });
    
  }

  empresaSeleccionada(){
    this.mostrar_nueva_empresa = true;
    this.crearFormularioEmpresa();
  }

  guardarEmpresa(){
    console.log(this.forma_empresa);
    
  }

  filtrarContenido(e) {
    console.log(e.value);
    this.mostrarAdmin = true;
  }

  abrirPDF(){
    this.mostrarAdmin = false;
    this.generarVisitasPorEmpresa();
  }

  generarVisitasPorEmpresa(){

    let fecha = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    let visitas_filtradas=[];
    let cols: string[] = [];
    let valor = [];
    let valores = [];

    let admin_colums = ['', "Elaborado Por", "Revisado Por", "Aprobado Por"];
    let admin_fields = [["DETALLE", this.administracion.elaborado_por, this.administracion.revisado_por, this.administracion.aprobado_por],
                        ["FIRMA", '', '', ''],
                        ["FECHA", fecha, fecha, fecha] ]

    this.visitas.forEach( (visita:Visita_Empresa) => {
      if(visita.empresa.nombre == this.empresa_pdf.nombre){
        visitas_filtradas.push(visita);
      }
    } )

    this.cols.forEach( col => {
      cols.push(col.header);
    } )
    cols.push("ACOMPAÑANTES")

    console.log(visitas_filtradas);
    

    visitas_filtradas.forEach( (visita:Visita_Empresa) => {
      console.log(visitas_filtradas);
      
      let aux = [];
      valor.push(visita.empresa.nombre);
      valor.push(visita.motivo_visita);
      valor.push(`${visita.encargado_visita.persona.primer_nombre} ${visita.encargado_visita.persona.primer_apellido}`);
      valor.push(visita.fecha_visita);
      valor.push(visita.hora_visita);
      visita.acompanantes.forEach( (persona:any) => {
        aux.push(`${persona.nombre} ${persona.contacto}`)
      } )
      valor.push(aux);
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
    doc.text(`Visitas por Materia - ${this.empresa_pdf.nombre}`, pdfWidht/2,pdfHeight/2, {align:"center"});

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

    doc.save(`Visitas_${this.empresa_pdf.nombre}.pdf`);
    this.empresa_pdf = {};

  }
  
}
