import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private loginAPI: LoginService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.loginAPI.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(this.loginAPI.basePath);
    if (isLoggedIn && isApiUrl){
      request = request.clone({
        setHeaders: {
          Authorization: ` ${currentUser!.token} `
        }
      });
    }
    
    return next.handle(request);
  }
}
