import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@interfaces/user";
import { AlertService } from "@services/alert.service";
import { AuthService } from "@services/auth.service";
import { LoaderService } from "@services/loader.service";
import { Observable, catchError, finalize, throwError } from "rxjs";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(
    private authService : AuthService,
    private loader : LoaderService,
    private router: Router,
    private alert : AlertService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.isLoading.next(true);
    let headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const userData : User = this.authService.userData;

    if(userData && userData.access_token) {
      headers['authorization'] = 'Bearer ' + userData.access_token;
    }

    const request = req.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401 || 403) {
          this.authService.removeUserData();
          this.router.navigateByUrl('/auth');
        }
        this.alert.showToast('error', err.error.message);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loader.isLoading.next(false);
      }),
    );
  }
}
