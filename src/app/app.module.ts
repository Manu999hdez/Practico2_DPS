import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

//Components
import { RepairsComponent } from './components/repairs/repairs.component';
import { RepairListComponent} from './components/repairs/repair-list/repair-list.component';
import { RepairComponent} from './components/repairs/repair/repair.component';

//Service
import { RepairService } from './services/repair.service';
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guard/auth.guard";

//Toastr, para notificaciones de angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    RepairComponent,
    RepairsComponent,
    RepairListComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [ AuthGuard,RepairService],
  bootstrap: [AppComponent]
})
export class AppModule { }
