import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  durationInSeconds = 5;


  constructor(private userService: UserService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    let user = {
      'first_name': this.registrationForm.get('firstName')?.value,
      'last_name': this.registrationForm.get('lastName')?.value,
      'middle_name': this.registrationForm.get('middleName')?.value,
      'phone': this.registrationForm.get('phone')?.value,
      'email': this.registrationForm.get('email')?.value,
      'password': this.registrationForm.get('password')?.value,
    }

    this.userService.register(user).subscribe((response) => {
      sessionStorage.setItem('user', response['user']['first_name']);
      sessionStorage.setItem('access', response['access']);
      this.userService.loggedIn();
      this.router.navigateByUrl('/');
    }, 
    (error) => {
      this._snackBar.openFromComponent(RegistrationErrorComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
    )
  }
}

@Component({
  selector: 'registration-error-component-snack',
  template: `
  <span class="registration-error">
   User could not be created
</span>
  `,
  styles: [
    `
    .registration-error {
      color: red;
    }
  `,
  ],
})
export class RegistrationErrorComponent {}
