import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileAPIService {

  private baseUrl = 'http://127.0.0.1:3000'

  constructor(private http: HttpClient) { }

  uploadOriginalmg(userid: string, file: File){
    let formData: FormData = new FormData();
    formData.append('original_img', file);
    // const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });
    // return this.http.request(req);
    let headers: HttpHeaders = new HttpHeaders().set('userid', userid);
    return this.http.post<any>([this.baseUrl, 'upload_original'].join('/'), formData, {
      headers: headers
    });
  }

  uploadWM(userid: string, wm: File){
    let formData: FormData = new FormData();
    formData.append('wm_img', wm);
    let headers: HttpHeaders = new HttpHeaders().set('userid', userid);
    return this.http.post<any>([this.baseUrl, 'upload_wm'].join('/'), formData, {
      headers: headers
    });
  }


}
