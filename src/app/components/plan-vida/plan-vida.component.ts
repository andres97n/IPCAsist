import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormGroupDirective,
} from "@angular/forms";

@Component({
  selector: "app-plan-vida",
  templateUrl: "./plan-vida.component.html",
  styleUrls: ["./plan-vida.component.css"],
})
export class PlanVidaComponent implements OnInit {
  cities: any[];
  selectedCities: any[];

  values1: string[];

  forma: FormGroup;

  constructor(private fb: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cities = [
      { name: "Vinculación Emocional y Social", code: "NY" },
      { name: "Descubrimiento del Método Natural y Cultural", code: "RM" },
      { name: "Manifestación del Lenguaje Verbal y No Verbal", code: "LDN" },
      { name: "Exploración del Cuerpo y Motricidad", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];
  }

  crearFormulario() {
    this.forma = this.fb.group({
      docente: this.fb.control("", Validators.required),
      estudiante: this.fb.control("", Validators.required),
      aula: this.fb.control("", Validators.required),
      asignatura: this.fb.control("", Validators.required),
      descripcion: this.fb.control("", Validators.required),
      objetivo_general: this.fb.control("", Validators.required),
      metas_especificas: this.fb.control("", Validators.required),
      vision: this.fb.control("", Validators.required),
      area: this.fb.control("", Validators.required),
      dominio: this.fb.control("", Validators.required),
      necesidades: this.fb.array([]),
      logros: this.fb.control("", Validators.required),
      observaciones: this.fb.control("", Validators.required),
    });
  }

  invalidos(form: string) {
    return this.forma.get(form).invalid && this.forma.get(form).touched;
  }

  get necesidades() {
    return this.forma.get("necesidades") as FormArray;
  }

  necesidad(i: number): FormGroup {
    let array = this.forma.get("necesidades") as FormArray;
    return array.controls[i] as FormGroup;
  }

  agregarNecesidad() {
    this.necesidades.push(
      this.fb.group({
        nombre: this.fb.control("", Validators.required),
        descripcion: this.fb.control("", Validators.required),
      })
    );
  }

  guardarPlan() {
    console.log(this.forma);
  }
}
