import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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
    return this.http.post<any>([this.basePath, 'authenticate'].join('/'), {
      username,
      password
    }).pipe(
      map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject$.next(user);
          return user;
      })
    )
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject$.next(null);
  }

}
