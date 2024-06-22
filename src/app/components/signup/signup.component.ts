import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidatorService } from '../../services/custom-validator.service'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ISignupPostData } from 'src/app/interfaces/auth.interfaces';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public err = ''

  constructor(private fb: FormBuilder, private customValidation: CustomValidatorService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.customValidation.passwordValidator()]]
    });
  }

  signupOnSubmit() {
    if (this.signupForm.valid) {
      const formRaw = this.signupForm.getRawValue();
      const data = {
        firstName: formRaw.firstName, lastName: formRaw.lastName, email: formRaw.email, password: formRaw.password
      } as ISignupPostData
      this.authService.signup(data).subscribe(res => {
        this.authService.clearSession();
        this.router.navigate(['login']);
      }, err => {
        this.err = err.error.message;
      })
    }
  }
}
