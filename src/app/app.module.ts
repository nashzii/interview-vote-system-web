import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Pencil,
  Vote,
  Delete,
  PlusCircle,
  Search,
  Grid2x2,
  BarChartHorizontal,
} from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VotingComponent } from './voting/voting.component';
import { HeaderComponent } from './base/header/header.component';
import { ApiInterceptor } from './services/api.interceptor';
import { ModalComponent } from './base/modal/modal.component';
import { NgChartsModule } from 'ng2-charts';
import { ToastComponent } from './base/toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VotingComponent,
    HeaderComponent,
    ModalComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LucideAngularModule.pick({
      Pencil,
      Vote,
      Delete,
      PlusCircle,
      Search,
      Grid2x2,
      BarChartHorizontal,
    }),
    NgChartsModule,
    ToastrModule.forRoot({
      toastComponent: ToastComponent,
      iconClasses: {
        error: 'bg-error',
        success: 'bg-success',
        warning: 'bg-warning',
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
