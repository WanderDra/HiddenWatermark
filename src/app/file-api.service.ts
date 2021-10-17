import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileAPIService {

  imgFile$ = new BehaviorSubject<File | undefined>(undefined);
  imgUrl$ = new BehaviorSubject<string | undefined>(undefined);
  wmFile$ = new BehaviorSubject<File | undefined>(undefined);
  wmUrl$ = new BehaviorSubject<string | undefined>(undefined);
  encFile$ = new BehaviorSubject<File | undefined>(undefined);
  encUrl$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private http: HttpClient) { }



}
