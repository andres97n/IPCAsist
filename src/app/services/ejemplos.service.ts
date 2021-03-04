import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Sesion } from "app/clases/sesion";

@Injectable({
  providedIn: "root",
})
export class EjemplosService {
  universidades: Array<any>;

  constructor(private http: HttpClient, private _router:Router) {
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
        value: "Universidad de Cuenca",
      },
      {
        name: "Universidad Católica de Cuenca",
        value: "Universidad Católica de Cuenca",
      },
      {
        name: "Universidad del Azuay",
        value: "Universidad del Azuay",
      },
      {
        name: "Universidad Politécnica Salesiana",
        value: "Universidad Politécnica Salesiana",
      },
      {
        name: "Universidad Nacional de Educación",
        value: "Universidad Nacional de Educación",
      },
      {
        name: "Universidad Técnica Particular de Loja",
        value: "Universidad Técnica Particular de Loja",
      },
      {
        name: "Instituto Superior Tecnológico del Azuay",
        value: "Instituto Superior Tecnológico del Azuay",
      },
      {
        name: "Instituto Tecnológico Sudamericano",
        value: "Instituto Tecnológico Sudamericano",
      },
      {
        name: "Instituto Tecnológico Superior San Gabriel",
        value: "Instituto Tecnológico Superior San Gabriel",
      },
      {
        name: "Instituto Tecnológico Superior American Collage",
        value: "Instituto Tecnológico Superior American Collage",
      },
      {
        name: "Instituto Superior San Isidro",
        value: "Instituto Superior San Isidro",
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

  getUsuarios(){
    return this.http.get("/assets/json/Sesion.json");
  }

  loginUser(user:Sesion) {
    localStorage.setItem('inicio', user.usuario);
    console.log(localStorage.getItem('inicio'));
    
  }

  logoutUser() {
    localStorage.removeItem('inicio')
    this._router.navigate(['sesion'])
  }


  loggedIn() {
    return !!localStorage.getItem('inicio')    
  }

}
