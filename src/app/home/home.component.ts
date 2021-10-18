import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestAPIService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showLoginPanel = false;
  islogin = false;
  isAdmin = true;

  constructor(private route: Router, private restAPI: RestAPIService) { }

  ngOnInit(): void {
    this.restAPI.isLoggedIn$.subscribe(data =>{
        this.islogin = data;
      }
    );
    if (localStorage.getItem('currentUser')){
      let check = this.restAPI.loginCheck();
      if (check !== false){
        check.subscribe(
          (res) => {
            this.restAPI.isLoggedIn$.next(res);
          },
          (err) => {
            console.log("err");
            console.log(err);
          }
        ) 
      }
    }
    this.restAPI.currentUser$.subscribe(user => {
      if (user?.type === 'admin'){
        this.isAdmin = true;
      }else {
        this.isAdmin = false;
      }
    })
  }

  onLoginBtnClicked(){
    this.showLoginPanel = true;
  }

  onPanelCloseClicked(){
    this.showLoginPanel = false;
  }

  onAlbumBtnClicked(){
    this.route.navigate(['album']);
  }

  onLogoutClicked(){
    this.restAPI.logout();
    this.restAPI.isLoggedIn$.next(false);
    window.location.reload();
  }

  onLogin(loginForm: {username: string, password: string}){
    this.restAPI.login(loginForm.username, loginForm.password).subscribe(
      () => {
        if (this.restAPI.currentUserValue){
          this.restAPI.isLoggedIn$.next(true);
        }
      }
    );
  }

  onRegister(registerForm: {username: string, password: string}){
    this.restAPI.register(registerForm.username, registerForm.password).subscribe(
        () => {
          if (this.restAPI.currentUserValue){
            this.restAPI.isLoggedIn$.next(true);
        }
      }
    )
  }

  onEncodeBtnClicked(){
    this.route.navigate(['encode']);
  }

  onDecodeBtnClicked(){
    this.route.navigate(['decode']);
  }

  onLoginPanelClicked(){
    this.route.navigate(['admin']);
  }

  onProfileBtnClicked(){
    this.route.navigate(['profile']);
  }

}
