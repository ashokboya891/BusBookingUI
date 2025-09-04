import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from "src/app/Components/account/account.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from 'src/app/Services/notification.service';


export const moderatorGuard: CanActivateFn = (route, state) => {
  const loginService = inject(AccountService);
  const router = inject(Router);
  const jwtHelperService = inject(JwtHelperService);
  const notificationService = inject(NotificationService);
  console.log("User Guard Activated");
  // Check if the user is authenticated
  if (loginService.isAuthenticated()) {
    const currentUser = sessionStorage.getItem("currentUser");

    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const userRoles: string[] = userData.roles || []; // Get roles from stored user data
      console.log('Moderator Roles:', userRoles); // Log user roles for debugging

      // Fetch expected role(s) and ensure it's an array
      let expectedRoles = route.data['expectedRoles']; // Match with the route key
      if (typeof expectedRoles === 'string') {
        expectedRoles = [expectedRoles]; // Convert single role to an array
      }

      console.log('Expected Roles:', expectedRoles); // Log expected roles for debugging

      // Check if the user has the expected role
      const hasRole = expectedRoles.some((role: string) => userRoles.includes(role));
      console.log(hasRole + " from guard"); // Check the result of the role check

      if (hasRole) {
      notificationService.showSuccess("Authenticated Moder");
        return true; // The user can navigate to the route
      }
    }
  }
  notificationService.showInfo("you dont have rights you need Admin role or moderator");

  // Redirect to login if not authenticated or role does not match
  // notificationService.showError('You are not authorized to access this page.');
  return false; // The user can't navigate to the route
};
