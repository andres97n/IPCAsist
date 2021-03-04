import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Sesion } from "app/clases/sesion";
// import { Usuario } from "app/clases/usuario";
import { EjemplosService } from "app/services/ejemplos.service";
// import { time } from "console";

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
      // console.log(this.usuarios);
      
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

    // let usuarios: Usuario[];

    console.log(usuario,"VALIDACION");
    

    this.usuarios.forEach( user => {

      if(usuario.usuario.toLowerCase() == user.usuario){
        console.log("1");
        
        if(usuario.contrasena == user.contrasena){
        console.log("2");

          this.entry = true;
        }
      } 
    } );
  
  }

  iniciarSesion() {
    // let data = this.forma.value;
    this.usuario = new Sesion();
    this.usuario.usuario = this.forma.value.usuario;
    this.usuario.contrasena = this.forma.value.contrasena;
    // this.usuarios.forEach( (usuario)  )
    this.validarUsuario(this.usuario)
    console.log(this.entry);

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
    // this.usuario.contrasena = this.forma.value.contrasena;
    // if(this.validarUsuario(this.usuario) === true){

    //   this.router.navigate(["home"]);
    // }
    
    // console.log(this.usuario);
  }
}
