import { Component, OnInit, Inject } from '@angular/core';

import { AuthService } from './Services/authenticationHelper';

import { UIElementData } from './SharedDataService/SharedDataService';

import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'VM Process Monitoring Tool';
  
  authButtonName = 'DEFAULT';
  isUserAuthenticated = false;

  public data:any=[]
  
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private authService: AuthService, private UIElementData: UIElementData){
    if(this.storage.get("IsUserAuthenticated") == null || this.storage.get("IsUserAuthenticated") == false){
      // Initiating Object Reference for SSO Authentication
      this.authService.initAuth();
  
      // Setting Login button Name
      this.UIElementData.currentAuthButtonname
        .subscribe(name => {
          this.authButtonName = name;
        });
  
      this.UIElementData.currentisUserAuthenticated
        .subscribe(status => {
          this.isUserAuthenticated = status;
          this.storage.set("IsUserAuthenticated", status);
        });
    }
    else{
      this.isUserAuthenticated = this.storage.get("IsUserAuthenticated");
      
      // Setting Login button Name
      this.UIElementData.currentAuthButtonname
          .subscribe(name => {
          this.authButtonName = name;
      });
    }
  }
  
  ngOnInit() {
  }

  authFunction(){
    var authActionName ;
    this.UIElementData.currentAuthButtonname
      .subscribe(name => authActionName = name);

    if(authActionName == "Sign In"){
      this.authService.login();
    }
    else if(authActionName == "Sign Out"){
      this.authService.logout();
    }
  }
}
