import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class EjemplosService {
  universidades: Array<any>;

  constructor(private http: HttpClient) {
    this.llenarUniversidades();
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

  llenarUniversidades() {
    this.universidades = [
      {
        name: "Universidad de Cuenca",
        value: "UCUENCA",
      },
      {
        name: "Universidad Católica de Cuenca",
        value: "CATOCUENCA",
      },
      {
        name: "Universidad del Azuay",
        value: "UDA",
      },
      {
        name: "Universidad Politécnica Salesiana",
        value: "UPS",
      },
      {
        name: "Universidad Nacional de Educación",
        value: "UNAE",
      },
      {
        name: "Instituo Superior Tecnológico del Azuay",
        value: "ISTA",
      },
      {
        name: "Instituto Tecnológico Sudamericano",
        value: "SUDA",
      },
      {
        name: "Instituto Tecnológico Superior San Gabriel",
        value: "SAN GABRIEL",
      },
      {
        name: "Instituto Tecnológico Superior American Collage",
        value: "AMERICAN COLLAGE",
      },
      {
        name: "Instituto Superior San Isidro",
        value: "SAN ISIDRO",
      },
      {
        name: "Otro",
        value: "OTRO",
      },
    ];

    localStorage.setItem("universidades", JSON.stringify(this.universidades));
  }

  getUniversidades() {
    let collages = localStorage.getItem("universidades");
    if (collages !== null) {
      return JSON.parse(collages);
    }
  }
}
