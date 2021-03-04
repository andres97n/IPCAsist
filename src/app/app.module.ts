import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";

// import { GoogleMapsModule } from "@angular/google-maps";

import { ComponentsModule } from "./components/components.module";
import { ExamplesModule } from "./examples/examples.module";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputMaskModule } from "primeng/inputmask";
import { CommonModule } from "@angular/common";
import { NouisliderModule } from "ng2-nouislider";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthGuard } from "./guards/auth.guard";

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    NouisliderModule,
    JwBootstrapSwitchNg2Module,
    BrowserAnimationsModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    ExamplesModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    InputMaskModule,
    // GoogleMapsModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  // exports: [AppModule]
})
export class AppModule {}
