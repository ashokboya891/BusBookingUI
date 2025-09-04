import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from "src/app/Components/account/account.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from 'src/app/Services/notification.service';


export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(AccountService);
  const router = inject(Router);
  const jwtHelperService = inject(JwtHelperService);
  const notificationService = inject(NotificationService);

  console.log("Admin Guard Activated");

  if (loginService.isAuthenticated()) {
    const currentUser = sessionStorage.getItem("currentUser");

    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const userRoles: string[] = userData.roles || [];

      let expectedRoles = route.data['expectedRoles'];
      if (typeof expectedRoles === 'string') {
        expectedRoles = [expectedRoles];
      }

      const hasRole = expectedRoles.some((role: string) =>
        userRoles.includes(role)
      );

      if (hasRole) {
        notificationService.showSuccess("Authenticated Admin ✅");
        return true;
      }
    }
  }

  notificationService.showError("You don’t have rights (Admin required).");
  router.navigate(['/login']);   // 👈 redirect
  return false;
};
