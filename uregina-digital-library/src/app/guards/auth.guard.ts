import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LibraryService } from '../services';

@Injectable()
export class AuthGuard {

  constructor(private authService: AuthService, private libService: LibraryService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];


    if (this.authService.isLoggedIn()) {
      console.log('USER LOGGED IN');
      return true;
    } else {
      const code = route.queryParamMap.get('code');
      if (code) {
        this.router.navigate(['/login'], { queryParams: { code: code } });
      } else {
        this.router.navigateByUrl(
          this.router.createUrlTree(
            ['/login']
          )
        );
      }
    }
  }
}