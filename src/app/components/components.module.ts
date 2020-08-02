import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { RouterModule } from "@angular/router";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from "primeng/dropdown";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

import { BasicelementsComponent } from "./basicelements/basicelements.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { TypographyComponent } from "./typography/typography.component";
import { NucleoiconsComponent } from "./nucleoicons/nucleoicons.component";
import { ComponentsComponent } from "./components.component";
import { NotificationComponent } from "./notification/notification.component";
import { NgbdModalComponent } from "./modal/modal.component";
import { NgbdModalContent } from "./modal/modal.component";
import { DesarrolladoresComponent } from "./desarrolladores/desarrolladores.component";
import { PlanVidaComponent } from "./plan-vida/plan-vida.component";
import { PasanteComponent } from "./pasante/pasante.component";
import { VisitaEmpresaComponent } from "./visita-empresa/visita-empresa.component";
import { AsignarDocenteComponent } from "./asignar-docente/asignar-docente.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NouisliderModule,
    RouterModule,
    JwBootstrapSwitchNg2Module,
    BrowserAnimationsModule,
    DropdownModule,
    AutoCompleteModule,
    CalendarModule,
    CardModule,
    TableModule,
  ],
  declarations: [
    ComponentsComponent,
    BasicelementsComponent,
    NavigationComponent,
    TypographyComponent,
    NucleoiconsComponent,
    NotificationComponent,
    NgbdModalComponent,
    NgbdModalContent,
    DesarrolladoresComponent,
    PlanVidaComponent,
    PasanteComponent,
    VisitaEmpresaComponent,
    AsignarDocenteComponent,
  ],
  entryComponents: [NgbdModalContent],
  exports: [ComponentsComponent],
})
export class ComponentsModule {}
