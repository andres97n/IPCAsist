import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AulasService {

  constructor(private http: HttpClient) { }

  getLista(e: string) {
    return this.http.get(`http://localhost:8000/api/${e}`);
  }

  getDetalle(id: any, e:string){
    return this.http.get(`http://localhost:8000/api/${e}/${id}`);
  }


}
