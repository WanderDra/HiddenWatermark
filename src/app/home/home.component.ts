import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showLoginPanel = false;
  islogin = false;
  isAdmin = true;

  constructor(private route: Router) { }

  ngOnInit(): void {
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
    this.islogin = false;
  }

  onLogin(){
    this.islogin = true;
  }

  onEncodeBtnClicked(){
    this.route.navigate(['encode']);
  }

  onDecodeBtnClicked(){
    this.route.navigate(['decode']);
  }

}
