import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasantesService {
  constructor(private http: HttpClient) {}

  setPasante(pasante:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(pasante);
    console.log(body)
    return this.http.post(`http://localhost:8000/api/pasantes`, body,{'headers':headers})
  }

  editarPasante(pasante:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(pasante);
    console.log(body)
    return this.http.put(`http://localhost:8000/api/pasante/${pasante.id}`, body,{'headers':headers})
  }

  eliminarPasante(pasante:any){
    return this.http.get(`http://localhost:8000/api/pasante_eliminar/${pasante}`);
  }


  getLista(e: string) {
    return this.http.get(`http://localhost:8000/api/${e}`);
  }

  getDetalle(id: any, e:string){
    return this.http.get(`http://localhost:8000/api/${e}/${id}`);
  }

  getPasantes() {
    return this.http.get("/assets/json/Pasante.json");
  }
}
