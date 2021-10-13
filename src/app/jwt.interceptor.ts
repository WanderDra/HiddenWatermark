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
      let iv_str = currentUser!.token.iv.join(',');
      request = request.clone({
        setHeaders: {
          token: currentUser!.token.token,
          iv: iv_str
        }
      });
      // console.log(request);
    }
    
    return next.handle(request);
  }
}
