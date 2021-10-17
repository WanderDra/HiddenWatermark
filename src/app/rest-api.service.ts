import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';

interface Token{
  token: {
    token: string,
    iv: {
      type: string,
      data: Array<number>
    }
  }
  type: string,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  basePath = 'http://localhost:3000';

  private currentUserSubject$: BehaviorSubject<User | null>;
  currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject$ = new BehaviorSubject<User | null>(JSON.parse(
      localStorage.getItem('currentUser') as string
    ));
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get currentUserValue(): User | null{
    return this.currentUserSubject$.value;
  }

  login(username: string, password: string){
    return this.http.post<any>([this.basePath, 'login'].join('/'), [] ,
    {
      headers: 
      {
        username,
        password
      }
    }).pipe(
      tap((res: Token) => {
        // console.log(res);
        let curUser = {
          username,
          password,
          type: res.type,
          id: res.id,
          token: {
            token: res.token.token,
            iv: res.token.iv.data
          }
        } as User
        localStorage.setItem('currentUser', JSON.stringify(curUser));
        this.currentUserSubject$.next(curUser);
        // console.log(localStorage.getItem('currentUser'));
        // let test = JSON.parse(localStorage.getItem('currentUser')!) as User;
        // console.log(test);
        // console.log(test.token!.iv);
      })
    )
  }

  register(username: string, password: string){
    return this.http.post<any>([this.basePath, 'register'].join('/'), [], 
    {
      headers: {
        username,
        password,
        type: 'user'
      }
    }).pipe(
      tap((res: Token) => {
        let curUser = {
          username,
          password,
          type: res.type,
          id: res.id,
          token: {
            token: res.token.token,
            iv: res.token.iv.data
          }
        } as User
        localStorage.setItem('currentUser', JSON.stringify(curUser));
        this.currentUserSubject$.next(curUser);
      })
    )
  }

  loginCheck() : Observable<boolean> | false{
    if(this.currentUserValue){
      return this.http.post<any>([this.basePath, 'authenticate'].join('/'), [], {
      }).pipe(
        map((res) => {
          if (res.res === 'permitted'){
            return true;
          }else if (res.res === 'denied') {
            this.logout();
            return false;
          }else{
            return false;
          }
        })
      )
    };
    return false;
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject$.next(null);
  }

  upload(file: File, type: string){
    let httpres = undefined;
    let formData = new FormData();
    switch(type){
      case 'image':
        formData.append('original_img', file, file.name);
        httpres = this.http.post<any>([this.basePath, 'upload_original'].join('/'), formData);
        break;
      case 'wm':
        formData.append('wm_img', file, file.name);
        httpres = this.http.post<any>([this.basePath, 'upload_wm'].join('/'), formData);
        break;
      case 'encoded':
        formData.append('encoded_img', file, file.name);
        httpres = this.http.post<any>([this.basePath, 'upload_encoded'].join('/'), formData);
        break;
      default:
        console.log('rest-api: File type error');
    }
    return httpres;
  }

  encode(imageUrl: string, wmUrl: string){
    // let formData = new FormData();
    // formData.append('imageUrl', imageUrl);
    // formData.append('wmUrl', wmUrl);
    return this.http.post<any>([this.basePath, 'encode'].join('/'), {
      imageUrl,
      wmUrl
    });
  }

  decode(originalUrl: string, encodedUrl: string){
    return this.http.post<any>([this.basePath, 'decode'].join('/'), {
      originalUrl,
      encodedUrl
    });
  }

  getImages(type: string){
    return this.http.get<any>([this.basePath, 'album', type, this.currentUserValue?.id].join('/'));
  }

  getImageUrl(type: string, img: string){
    // return this.http.get<any>([this.basePath, type, this.currentUserValue?.id, img].join('/'));
    return [this.basePath, 'album', type, this.currentUserValue?.id, img].join('/');
  }

}
