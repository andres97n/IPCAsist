import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

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

  constructor(private _fb: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit() {}

  crearFormulario() {
    this.forma = this._fb.group({
      identificacion: ["", Validators.required],
      contrasena: ["", Validators.required],
    });
  }

  iniciarSesion() {
    console.log(this.forma);
  }
}
