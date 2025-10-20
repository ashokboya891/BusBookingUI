import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { NavbarComponent } from './Shared/navbar/navbar.component';
import { LoginComponent } from './Components/account/login/login.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestInputsComponent } from "src/app/Components/account/test-inputs/test-inputs.component";
import { MyBookingsComponent } from './Components/User/my-bookings/my-bookings.component';
import { UpRidesComponent } from './Components/User/up-rides/up-rides.component';
import { CompletedRidesComponent } from './Components/User/completed-rides/completed-rides.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MessageService } from 'primeng/api';
import { JwtInterceptor, JwtModule } from "@auth0/angular-jwt";
import { JwtTokenInterceptor } from './Interceptors/JwtTokenInterceptor';
import { LoadingInterceptor } from './Interceptors/loading-interceptor';
import { TestComponent } from './Admin/test/test.component';
import { RoutesComponent } from './Admin/routes/routes.component';
import { SharedModule } from './Shared/shared.module';
import { AllEventsComponent } from 'src/app/Admin/all-events/all-events.component';
import { AddBusEventComponent } from 'src/app/Admin/add-bus-event/add-bus-event.component';
import { SelectionComponent } from './Components/User/selection/selection.component';   // ✅ correct import path
import { PagerComponent } from './Shared/pager/pager.component';
import { PagingHeaderComponent } from './Shared/paging-header/paging-header.component';
import { EditBusInfoComponent } from './Admin/edit-bus-info/edit-bus-info.component';
import { CheckoutComponent } from './Components/User/checkout/checkout.component';
import { PaymentoptionsComponent } from './Components/User/paymentoptions/paymentoptions.component';
import { BookingSuccessComponent } from './Components/User/booking-success/booking-success.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    TestInputsComponent,
    MyBookingsComponent,
    UpRidesComponent,
    CompletedRidesComponent,
    TestComponent,
    RoutesComponent,
    AllEventsComponent,
    AddBusEventComponent,
    SelectionComponent,
    PagerComponent,
    PagingHeaderComponent,
    EditBusInfoComponent,
    CheckoutComponent,
    PaymentoptionsComponent,
    BookingSuccessComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,   // ✅ contains ToastModule
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          const currentUser = sessionStorage.getItem("currentUser");
          return currentUser ? JSON.parse(currentUser).token : null;
        } 
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
