import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { ComponentsComponent } from "./components/components.component";
import { ProfileComponent } from "./examples/profile/profile.component";
import { SignupComponent } from "./examples/signup/signup.component";
import { LandingComponent } from "./examples/landing/landing.component";
import { NucleoiconsComponent } from "./components/nucleoicons/nucleoicons.component";
import { DesarrolladoresComponent } from "./components/desarrolladores/desarrolladores.component";
import { VisitaEmpresaComponent } from "./components/visita-empresa/visita-empresa.component";
import { PasanteComponent } from "./components/pasante/pasante.component";
import { PlanVidaComponent } from "./components/plan-vida/plan-vida.component";
import { AsignarDocenteComponent } from "./components/asignar-docente/asignar-docente.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: ComponentsComponent },
  { path: "user-profile", component: ProfileComponent },
  { path: "sesion", component: SignupComponent },
  { path: "landing", component: LandingComponent },
  { path: "nucleoicons", component: NucleoiconsComponent },
  { path: "desarrolladores", component: DesarrolladoresComponent },
  { path: "visitas", component: VisitaEmpresaComponent },
  { path: "pasante", component: PasanteComponent },
  { path: "plan-vida", component: PlanVidaComponent },
  { path: "asignar-docente", component: AsignarDocenteComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
