import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/Services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl:'./spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  // loading$: Observable<boolean>;
  // constructor(private spinnerService: SpinnerService) {
  //   this.loading$ = this.spinnerService.loading$;
  // }
}
