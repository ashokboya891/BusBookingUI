import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/account/login/login.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { UpRidesComponent } from './Components/User/up-rides/up-rides.component';
import { CompletedRidesComponent } from './Components/User/completed-rides/completed-rides.component';
import { MyBookingsComponent } from './Components/User/my-bookings/my-bookings.component';
import { adminGuard } from './_guards/admin.guard';
import { TestComponent } from './Admin/test/test.component';
import { RoutesComponent } from './Admin/routes/routes.component';
import { moderatorGuard } from './_guards/moderator.guard';
import { AllEventsComponent } from './Admin/all-events/all-events.component';
import { AddBusEventComponent } from './Admin/add-bus-event/add-bus-event.component';
import { SelectionComponent } from './Components/User/selection/selection.component';
import { EditBusInfoComponent } from './Admin/edit-bus-info/edit-bus-info.component';
import { AuthGuard } from './_guards/Auth.guard';
import { CheckoutComponent } from './Components/User/checkout/checkout.component';
import { StandcheckComponent } from './Components/User/standcheck/standcheck.component';
import { PaymentoptionsComponent } from './Components/User/paymentoptions/paymentoptions.component';
import { BookingSuccessComponent } from './Components/User/booking-success/booking-success.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Default redirect
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // ✅ Default to home

  // Protected (only if logged in)
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'selection/:id', component: SelectionComponent },
      { path: 'upcomming', component: UpRidesComponent },
      { path: 'mybookings', component: MyBookingsComponent },
      {path:"checkout",component:CheckoutComponent},
      {
        path:'dashboard',component:DashboardComponent
      },
      {
        path:"paymentoptions",component:PaymentoptionsComponent
      },
      {
        path:'standcheck',component:StandcheckComponent
      },
      {
        path:"success",component:BookingSuccessComponent
      },
      // Moderator
      {
        path: 'moderator',
        canActivate: [moderatorGuard],
        data: { expectedRoles: ['Moderator'] },
        children: [
          { path: 'comrides', component: CompletedRidesComponent }
        ]
      },

      // Admin
      {
        path: 'admin',
        canActivate: [adminGuard],
        data: { expectedRoles: ['Admin'] },
        children: [
          { path: 'all-events', component: AllEventsComponent },
          { path: 'create-event', component: AddBusEventComponent },
          { path: 'editbus/:id', component: EditBusInfoComponent },
          { path: 'test', component: TestComponent },
          { path: 'Busroutes', component: RoutesComponent }
        ]
      },
      { path: '**', redirectTo: 'home' } // ✅ not login

    ],
    
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes),StandcheckComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
