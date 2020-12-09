import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Visita_Empresa } from "app/clases/visita-empresa";

@Injectable({
  providedIn: "root",
})
export class VisitasService {
  constructor(private http: HttpClient) {}

  getVisitas() {
    return this.http.get("/assets/json/Visitas.json");
  }

  getEmpresas(){
    return this.http.get("/assets/json/Empresa.json");
  }
}
