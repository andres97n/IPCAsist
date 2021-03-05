import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Visita_Empresa } from "app/clases/visita-empresa";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class VisitasService {
  constructor(private http: HttpClient) {}

  setVisita(visita:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(visita);
    console.log(body)
    return this.http.post(`http://localhost:8000/api/visitas`, body,{'headers':headers})
  }

  editarVisita(visita:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(visita);
    console.log(body)
    return this.http.put(`http://localhost:8000/api/visita/${visita.id}`, body,{'headers':headers})
  }

  eliminarVisita(visita:any){
    return this.http.get(`http://localhost:8000/api/visita_eliminar/${visita}`);
  }

  setEmpresa(empresa:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(empresa);
    console.log(body)
    return this.http.post(`http://localhost:8000/api/empresas`, body,{'headers':headers})
  }

  getLista(e: string) {
    return this.http.get(`http://localhost:8000/api/${e}`);
  }

  getDetalle(id: any, e:string){
    return this.http.get(`http://localhost:8000/api/${e}/${id}`);
  }

  

}
