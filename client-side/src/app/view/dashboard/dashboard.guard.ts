import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, RouterModule } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { RegisterService } from '../register/register.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private registerSrv: RegisterService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    return this.registerSrv.user$.pipe(switchMap(userData => {
      console.log(userData)
      if(!userData || Object.keys(userData).length == 0) {
        // user logged out
        this.router.navigate(['register'])
        return of(true);
      }
      else {
        const type = route.paramMap.get('type');
        if(!type || (type != 'admin' && type != 'doc') || !userData.role ) {
          // wrong path
          this.router.navigate(['home'])
          return of(false)
        }
        else if(type == 'admin' && userData.role != 'admin'){
          this.router.navigate(['dashboard', 'doc'])
          return of(true)
        }
        else
          return of(true)
      }

    }))
  }

}
