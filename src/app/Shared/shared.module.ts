// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';   
// import { PaginatorModule } from 'primeng/paginator';
import { PaginationModule } from 'ngx-bootstrap/pagination';
// import { SpinnerComponent } from './spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    // SpinnerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastModule,
    CardModule,
    PaginationModule.forRoot(),
    NgxSpinnerModule.forRoot({
     type: 'ball-clip-rotate-pulse'
    }),
    // PaginatorModule.forRoot()
    //  PaginatorModule.forRoot() // Importing PaginationModule from ngx-bootstrap

  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    CardModule,
    PaginationModule,
    NgxSpinnerModule
  ]
})
export class SharedModule {}
