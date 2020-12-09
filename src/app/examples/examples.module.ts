import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { NouisliderModule } from 'ng2-nouislider';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        RouterModule,
        NouisliderModule,
        // InputNumberModule,
        // InputTextModule,
        // InputMaskModule,
    ],
    declarations: [
        LandingComponent,
        // SignupComponent,
        ProfileComponent
    ]
})
export class ExamplesModule { }
