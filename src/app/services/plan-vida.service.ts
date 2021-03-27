import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Materia } from "app/clases/materia";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlanVidaService {
  constructor(private http: HttpClient) {}

  setPlanVida(plan_vida:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(plan_vida);
    console.log(body)
    return this.http.post(`https://ipcasist.herokuapp.com/api/planes_vida`, body,{'headers':headers})
  }

  editarPlanVida(plan_vida:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(plan_vida);
    console.log(body)
    return this.http.put(`https://ipcasist.herokuapp.com/api/plan_vida/${plan_vida.id}`, body,{'headers':headers})
  }

  eliminarPlan(plan:any){
    return this.http.get(`https://ipcasist.herokuapp.com/api/plan_vida_eliminar/${plan}`);
  }

  
  // getPlanesVida(){
  //   return this.http.get("/assets/json/Plan_Vida.json");
  // }

  getLista(e: string) {
    return this.http.get(`https://ipcasist.herokuapp.com/api/${e}`);
  }

  getDetallePersona(id: any){
    return this.http.get(`https://ipcasist.herokuapp.com/api/persona/${id}`);
  }

  setMateria(materia:Materia): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(materia);
    console.log(body)
    return this.http.post(`https://ipcasist.herokuapp.com/api/materias`, body,{'headers':headers})
  }

  getPeriodoLectivo(){
    return this.http.get("/assets/json/Periodo_Lectivo.json");
  }
}
