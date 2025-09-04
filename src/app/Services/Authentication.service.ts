import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // ✔️ For ESModules-compatible version

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private tokenKey = 'token';

  constructor(private http: HttpClient) 
  {
    
  }

  // ✅ Login method that stores token in sessionStorage
  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  // ✅ Check login
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  // ✅ Decode token once
  getDecodedToken(): any {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

  // ✅ Role-based checks
  hasRole(role: string): boolean {
    const decoded = this.getDecodedToken();
    const roles = decoded?.role || []; // assuming token contains "role": ["Admin", "Manager"]
    return Array.isArray(roles) ? roles.includes(role) : roles === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }
  isModerator(): boolean {
    return this.hasRole('Moderator'); // use consistent casing
  }

  isFinance(): boolean {
    return this.hasRole('Finance');
  }

  isManager(): boolean {
    return this.hasRole('Manager');
  }

  isIT(): boolean {
    return this.hasRole('IT'); // not "It", use consistent casing
  }

  isUser(): boolean {
    return this.hasRole('User') || this.hasRole('Admin');
  }

  // ✅ Logout
  logout(): void {
    sessionStorage.clear();
  }

  // ✅ Get raw token if needed
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }
  // ✅ For SignalR or API auth headers
getAccessToken(): string {
  return this.getToken() ?? '';
}

  // constructor(private http:HttpClient) { }

  // isLoggedIn(): boolean {
  //   return !!sessionStorage.getItem('currentUser');  // Check if user exists in session storage
  // }

  // isAdmin(): boolean {
  //   const userData = sessionStorage.getItem('currentUser');  
  //   if (userData) {
  //     const user = JSON.parse(userData);  
  //     return user.roles.includes('Admin');  // Check if the user has an "Admin" role
  //   }
  //   return false;
  // }
  // isFinance()
  // {
  //     const userData = sessionStorage.getItem('currentUser');  
  //   if (userData) {
  //     const user = JSON.parse(userData);  
  //     return user.roles.includes('Finance');  // Check if the user has an "Admin" role
  //   }
  //   return false;
  // }

  // isManager()
  // {
  //     const userData = sessionStorage.getItem('currentUser');  
  //   if (userData) {
  //     const user = JSON.parse(userData);  
  //     return user.roles.includes('Manager');  // Check if the user has an "Admin" role
  //   }
  //   return false;
  // }
  // isIT()
  // {
  //     const userData = sessionStorage.getItem('currentUser');  
  //   if (userData) {
  //     const user = JSON.parse(userData);  
  //     return user.roles.includes('It');  // Check if the user has an "Admin" role
  //   }
  //   return false;
  // }
  // logout(): void {
  //   sessionStorage.removeItem('user'); // Clear user data on logout
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("email");
  //   sessionStorage.removeItem("currentUser")
  // }
  // isUser(): boolean {
  //   const userData = sessionStorage.getItem('currentUser');  
  //   if (userData) {
  //     const user = JSON.parse(userData);  
  //     return user.roles.includes('User') || user.roles.includes('Admin');  
  //   }
  //   return false;
  // }
  
  // login(email: string, password: string) {
  //   return this.http.post<any>('/api/auth/login', { email, password }).pipe(
  //     tap(response => {
  //       localStorage.setItem('auth_token', response.token);
  //       localStorage.setItem('user', JSON.stringify(response.user));
  //     })
  //   );
  // }
}
