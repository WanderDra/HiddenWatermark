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

  constructor(private route: Router, private loginAPI: RestAPIService) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')){
      let check = this.loginAPI.loginCheck();
      if (check !== false){
        check.subscribe(
          (res) => {
            this.islogin = res;
          },
          (err) => {
            console.log("err");
            console.log(err);
          }
        ) 
      }
    }
    this.loginAPI.currentUser$.subscribe(user => {
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

  }

  onLogoutClicked(){
    this.loginAPI.logout();
    this.islogin = false;
  }

  onLogin(loginForm: {username: string, password: string}){
    this.loginAPI.login(loginForm.username, loginForm.password).subscribe(
      () => {
        if (this.loginAPI.currentUserValue){
          this.islogin = true;
        }
      }
    );
  }

  onRegister(registerForm: {username: string, password: string}){
    this.loginAPI.register(registerForm.username, registerForm.password).subscribe(
        () => {
          if (this.loginAPI.currentUserValue){
            this.islogin = true;
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

}
