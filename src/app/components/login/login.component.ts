import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  durationInSeconds = 5;

  constructor(private userService: UserService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.userService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe((response) => {
      sessionStorage.setItem('user', response['user']['first_name']);
      sessionStorage.setItem('access', response['access']);
      this.userService.loggedIn();
      this.router.navigateByUrl('/');
    }, (err) => {
      this._snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
      });
    });
  }
}

@Component({
  selector: 'login-error-component-snack',
  template: `
  <span class="login-error">
   Incorrect credentials provided
</span>
  `,
  styles: [
    `
    .login-error {
      color: red;
    }
  `,
  ],
})
export class ErrorComponent {}
