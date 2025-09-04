import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { BusyService } from 'src/app/Services/busy-service.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService:BusyService)
  {

  } 

 intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  console.log("interceptor intercepts")
    this.busyService.busy();
    return next.handle(request).pipe(
        delay(300),  // 👈 optional, just to visualize spinner
      finalize(() => this.busyService.idle())
    );
  }
}
