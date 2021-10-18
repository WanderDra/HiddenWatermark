
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RestAPIService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy{

  constructor(private restAPI: RestAPIService) { }

  preload(route: Route, loadMe: () => Observable<any>): Observable<any>{
    if (route.data && route.data['preload']){
      this.restAPI.currentUser$.subscribe(user => {
        if (user){
          console.log("Preload: Logged In");
          return loadMe();
        }else {
          console.log("Preload: Anomynous");
          return of(null);
        }
      })
      return loadMe();
    } else{
      return of(null);
    }
  }
}
