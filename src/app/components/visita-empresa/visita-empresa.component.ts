import { Component, OnInit } from '@angular/core';
import { Persons } from "app/clases/persons";
import { DocenteService } from "app/services/docente.service";

@Component({
  selector: 'app-visita-empresa',
  templateUrl: './visita-empresa.component.html',
  styleUrls: ['./visita-empresa.component.css']
})
export class VisitaEmpresaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
