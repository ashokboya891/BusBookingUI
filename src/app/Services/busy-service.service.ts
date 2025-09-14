import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy() {
    console.log("busy invoked from busservice")
    this.busyRequestCount++;
    if (this.busyRequestCount === 1) {  // show only once
      this.spinnerService.show(undefined, {
        type: 'ball-clip-rotate-pulse',
        bdColor: 'rgba(152, 152, 147, 0.3)',
        color: '#bb9600ff',
        size: 'medium'
      });
    }
  }

  idle() {
    console.log("idle invoked from busservice")

    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
