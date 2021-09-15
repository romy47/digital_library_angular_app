import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  verifyingCode = false;
  loginError = false;
  code = null;
  errMessage = '';
  constructor(private authService: AuthService, private route: ActivatedRoute, private libService: LibraryService, private router: Router) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParamMap.get('code');
    if (this.code) {
      this.verifyingCode = true;
      // code varification
      this.authService.orcidSigninStage2(this.code).subscribe(res => {
        this.libService.createUser(res.body.name, res.body.orcid).subscribe(res2 => {
          this.authService.setToken(res.body);
          res2.orcid ? delete res2.orcid : '';
          this.authService.setToken(res2);
          this.verifyingCode = false;
          this.errMessage = '';
          this.router.navigate(['/search']);


        }, err => {
          this.verifyingCode = false;
          this.errMessage = 'Login Failed. Please try again.';
        })
        // return true;
      }, err => {
        this.errMessage = 'Invalid attempt. Please try again.';
        this.verifyingCode = false;
      });
    } else {
    }
  }

  openORCID() {
    this.authService.orcidSigninStage1();
  }

}
