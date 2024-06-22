import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidatorService } from '../../services/custom-validator.service'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ILoginPostData } from 'src/app/interfaces/auth.interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err = '';
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private customValidation: CustomValidatorService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.customValidation.passwordValidator()]]
    });
  }

  loginOnSubmit() {
    if (this.loginForm.valid) {
      const formRaw = this.loginForm.getRawValue();
      const data = {
        email: formRaw.email, password: formRaw.password
      } as ILoginPostData
      this.authService.login(data).subscribe(res => {
        this.authService.setToken({
          access_token: res.data.tokens.accessToken, refresh_token: res.data.tokens.refreshToken, name: `${res.data.user.firstName} ${res.data.user.lastName}`
        });
        this.router.navigate(['/']);
      }, err => {
        this.err = err.error.message;
      })
    }
  }
}
