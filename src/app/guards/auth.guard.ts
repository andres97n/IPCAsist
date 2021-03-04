import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EjemplosService } from 'app/services/ejemplos.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: EjemplosService,
    private _router: Router){}

    canActivate(): boolean {
      if (this._authService.loggedIn()) {
        console.log('true')
        return true
      } else {
        console.log('false')            
        this._router.navigate(['/sesion'])
        return false
      }
    }
  
}
