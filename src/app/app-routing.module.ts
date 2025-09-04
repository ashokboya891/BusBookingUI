import { NgModule } from '@angular/core';
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

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'editbus/:id',component:EditBusInfoComponent},
  {path:'selection/:id',component:SelectionComponent},
  {path:'upcomming',component:UpRidesComponent},
  {
    path: "", canActivate: [], data: { expectedRoles:["Moderator"] }, children: [{
    path:'comrides',component:CompletedRidesComponent
  }]
  },
  {path:'mybookings',component:MyBookingsComponent},
  {
      path: "", canActivate: [], data: { expectedRoles:["Admin"] }, children: [
      {path:'test',component:TestComponent},
      // { path: 'Product-view/:id', component: ProductViewComponent }, // 👈 Your product detail view
      { path: "Busroutes", component: RoutesComponent},
      {path:"create-event", component: AddBusEventComponent},  // ✅ Add this line for AllEventsComponent
      {path:"all-events", component: AllEventsComponent}  // ✅ Add this line for AllEventsComponent
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
