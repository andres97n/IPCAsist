import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Sesion } from "app/clases/sesion";
import { EjemplosService } from "app/services/ejemplos.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})


export class SignupComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;

  forma: FormGroup;
  // type: string;
  // message: string;

  usuarios: Sesion[];
  usuario: Sesion;

  entry: boolean;
  error: boolean;

  

  constructor(private _fb: FormBuilder, private router:Router, private _ejemSrv: EjemplosService) {
    
    this.crearFormulario();
    
  }

  ngOnInit() {
    
    this._ejemSrv.getUsuarios().subscribe( (usuarios:Sesion[]) => {

      this.usuarios = usuarios;
      
    } );

  this.entry = false;
  this.error = false;

  }

  crearFormulario() {
    this.forma = this._fb.group({
      usuario: ["", Validators.required],
      contrasena: ["", Validators.required],
    });
  }

  validarUsuario(usuario:Sesion){
    this.usuarios.forEach( user => {

      if(usuario.usuario.toLowerCase() == user.usuario){
        
        if(usuario.contrasena == user.contrasena){
          this.entry = true;
        }
      } 
    } );
  
  }

  iniciarSesion() {
    this.usuario = new Sesion();
    this.usuario.usuario = this.forma.value.usuario;
    this.usuario.contrasena = this.forma.value.contrasena;
    this.validarUsuario(this.usuario)

    if(this.entry == true){
      this._ejemSrv.loginUser(this.usuario);
      this.router.navigate(["home"]);
    } else {
        this.error = true;
        setTimeout(() => {
          this.error= false;
        }, 4000);
        
    }
    this.forma.reset();
  }
}
