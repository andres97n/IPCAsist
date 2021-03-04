import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DocenteService {
  constructor(private http: HttpClient) {}

  getAsignaciones() {
    return this.http.get("/assets/json/Asignar-Docente.json");
  }

  getDocentes() {
    return this.http.get("/assets/json/Docentes.json");
  }

  getAulas() {
    return this.http.get("/assets/json/Aulas.json");
  }

  getCountries() {
    return this.http.get("/assets/json/countries.json");
    // .toPromise()
    // .then((res: any) => <any[]>res.json())
    // .then((data) => {
    //   return data;
    // });
  }

  getPersons() {
    return this.http.get("/assets/json/ejemplo.json");
  }

  getCarsSmall() {
    return this.http.get("/assets/json/cars.json");
  }
}
