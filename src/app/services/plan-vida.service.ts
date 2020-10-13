import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PlanVidaService {
  constructor(private http: HttpClient) {}

  getEstudiantes() {
    return this.http.get("/assets/json/Estudiante.json");
  }

  getPlanesVida(){
    return this.http.get("/assets/json/Plan_Vida.json");
  }
}
