import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { ComponentsComponent } from "./components/components.component";
import { DesarrolladoresComponent } from "./components/desarrolladores/desarrolladores.component";
import { VisitaEmpresaComponent } from "./components/visita-empresa/visita-empresa.component";
import { PasanteComponent } from "./components/pasante/pasante.component";
import { PlanVidaComponent } from "./components/plan-vida/plan-vida.component";
import { AsignarDocenteComponent } from "./components/asignar-docente/asignar-docente.component";
import { AyudaComponentesComponent } from "./components/ayuda-componentes/ayuda-componentes.component";
import { AuthGuard } from "./guards/auth.guard";
import { SignupComponent } from "./components/signup/signup.component";

const routes: Routes = [
  { path: "", redirectTo: "/sesion", pathMatch: "full" },
  { path: "home", component: ComponentsComponent },
  // { path: "user-profile", component: ProfileComponent },
  { path: "sesion", component: SignupComponent },
  // { path: "landing", component: LandingComponent },
  // { path: "nucleoicons", component: NucleoiconsComponent },
  { path: "desarrolladores", component: DesarrolladoresComponent },
  { path: "visitas", component: VisitaEmpresaComponent, canActivate: [AuthGuard] },
  { path: "pasante", component: PasanteComponent, canActivate: [AuthGuard] },
  { path: "plan-vida", component: PlanVidaComponent, canActivate: [AuthGuard] },
  { path: "asignar-docente", component: AsignarDocenteComponent, canActivate: [AuthGuard] },
  { path: "ayuda-componentes", component: AyudaComponentesComponent, canActivate: [AuthGuard] },
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
