import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidatorService } from '../../services/custom-validator.service'
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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

  public signupOnSubmit() {
    if (this.signupForm.valid) {
      const formRaw = this.signupForm.getRawValue();
      const data = {
        firstName: formRaw.firstName, lastName: formRaw.lastName, email: formRaw.email, password: formRaw.password
      }
      this.authService.signup(data).subscribe(res => {
        this.router.navigate(['login']);
      }, err => {
        this.err = err.error.message;
      })
    }
  }
}
