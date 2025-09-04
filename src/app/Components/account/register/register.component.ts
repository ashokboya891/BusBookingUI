import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
// import { AccountService } from 'src/app/account/account.service';
import { Router } from '@angular/router';
import { debounce, debounceTime, finalize, map, switchMap, take } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
 errors: string[] | null = null;

  complexPassword = "(?=^.{6,15}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{\":;'?/\\>.<,])(?!.*\\s).*$";

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {}

  registerForm: FormGroup = this.fb.group({
    personName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
phone: [
  '',
  [
    Validators.pattern(/^[0-9]{10}$/) // Accepts only exactly 10 digits
  ]
],
    passwordGroup: this.fb.group({
      password: ['', [Validators.required, Validators.pattern(this.complexPassword)]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordsMatchValidator] })
  });

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    const { personName, email, phone, passwordGroup } = this.registerForm.value;

    const requestPayload = {
      personName,
      email,
      phone,
      password: passwordGroup.password,
      confirmPassword: passwordGroup.confirmPassword
    };

    this.accountService.register(requestPayload).subscribe({
      next: () => this.router.navigateByUrl('/shop'),
      error: error => this.errors = error.errors
    });
  }

  // onSubmit()
  // {
  //   this.accountService.register(this.registerForm.value).subscribe({
  //     next:()=>this.router.navigateByUrl('/shop'),
  //     error:error=>this.errors=error.errors
  //   })
  // }
  validateEmailNotTaken():AsyncValidatorFn
  {
    return (control:AbstractControl)=>{
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(()=>{
          return this.accountService.checkEmailExists(control.value).pipe(
            map(result=>result ?{emailExists:true}:null),
            finalize(()=>control.markAsTouched())
          );
          
        })
      )
    }
  }

  get personName() {
  return this.registerForm.get('personName') as FormControl;
}

get email() {
  return this.registerForm.get('email') as FormControl;
}

get phone() {
  return this.registerForm.get('phone') as FormControl;
}

get passwordGroup() {
  return this.registerForm.get('passwordGroup') as FormGroup;
}

get password() {
  return this.passwordGroup.get('password') as FormControl;
}

get confirmPassword() {
  return this.passwordGroup.get('confirmPassword') as FormControl;
}

}
