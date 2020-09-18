import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PasantesService {
  constructor(private http: HttpClient) {}

  getPasantes() {
    return this.http.get("/assets/json/Pasante.json");
  }
}
