import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, Observable, switchMap, take } from 'rxjs';
import { AccountService } from 'src/app/Components/account/account.service';

@Injectable()
export class JwtTokenInterceptor  implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("JWT Interceptor called");
    // Check for the token in localStorage
    const token = sessionStorage.getItem('token');

    if (token) {
      // If the token is present, clone the request and add the Authorization header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Pass the modified request to the next handler
    return next.handle(request);
  }
}
