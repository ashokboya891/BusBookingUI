import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, map, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.UserServiceapiUrl ; 
private currentUserSource=new ReplaySubject<User|null>(1);
currentUser$=this.currentUserSource.asObservable();
public currentUserName: string | null = null;
 private userEmailSubject = new BehaviorSubject<string | null>(this.getInitialEmail());
  userEmail$ = this.userEmailSubject.asObservable();
  constructor(private http:HttpClient,private router:Router,
    private jwtHelperService:JwtHelperService)
  {

  }
  private getInitialEmail(): string | null {
    return sessionStorage.getItem('email');
  }
  
  loadCurrentUser(token:string |null)
  {
    if(token===null)
    {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers=new HttpHeaders();
    headers=headers.set('Authorization',`Bearer ${token}`);
    return this.http.get<User>(this.baseUrl+'Account',{headers}).pipe(
      map(user=>{
       if(user)
       {
        sessionStorage.setItem('token',user.token);
        this.currentUserSource.next(user);
        return user;
       }
       else{
        return null;
       }
      }
      )
    )

  }
  login(value: any) {
  return this.http.post<User>(this.baseUrl + 'Account/login', value).pipe(
    map(user => {
      if (user) {
        // localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
        sessionStorage.setItem('currentUserName', user.email);
        sessionStorage.setItem('token', user.token);
        sessionStorage.setItem('refreshToken', user.refreshToken);
        // localStorage["token"] = user.token;
        // localStorage["refreshToken"] = user.refreshToken;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        // localStorage.setItem('email', user.email);
        sessionStorage.setItem('email', user.email);

        // Extract role if needed by your userGuard
        const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
        const userId = tokenPayload.sub;
        const roles = tokenPayload['role'] || tokenPayload['roles'];  // check how roles are stored

        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('roles', JSON.stringify(roles));

        console.log("Logged in roles:", roles);

        // Use zone or delay to allow guards to recognize updated user state
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 100);  // 100ms delay to allow guards to pick up the role change
      }
      return user;
    })
  );
}

  register(values:any)
  {
    return this.http.post<User>(this.baseUrl+'Register',values).pipe(
      map(user =>{
        sessionStorage.setItem('token',user.token);
        this.currentUserSource.next(user);
      })
    )
  }
logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUserName");
  sessionStorage.removeItem("roles");
  sessionStorage.removeItem("userId");
  this.currentUserName = null;
  this.currentUserSource.next(null);
  this.router.navigateByUrl('/login');
}

  checkEmailExists(email:string)
  {
    return this.http.get<Boolean>(this.baseUrl+'account/emailExists?email='+email);
  }

  // getUserAddress()
  // {
  //   return this.http.get<Address>(this.baseUrl+'account/address');
  // }
  // updateuserAddress(address:Address)
  // {
  //   return this.http.put(this.baseUrl+'account/address',address);
  // }
    public isAuthenticated(): boolean {
    const token = sessionStorage.getItem("token");
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        this.currentUserName = JSON.parse(currentUser).email; // Set the current user name
      }
      return true; // Token is valid
    }
    return false; // Token is not valid
  }
  public loadUserFromStorage() {
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      this.currentUserName = storedUserName;
    }
  }
  
  public postGenerateNewToken(): Observable<any> {
    const token = sessionStorage.getItem("token");
    const refreshToken = sessionStorage.getItem("refreshToken");

    return this.http.post<any>(`${this.baseUrl}generate-new-jwt-token`, { token, refreshToken }).pipe(
      tap((response: { token: string; }) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      })
    );
}
}
