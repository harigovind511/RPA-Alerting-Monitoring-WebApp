import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as hello from 'hellojs/dist/hello.all.js';

import { Configs } from '../SharedDataService/Constants';
import { UIElementData } from '../SharedDataService/SharedDataService';

@Injectable()
export class AuthService {
  constructor(
    private zone: NgZone,
    private UIData: UIElementData
  ) { }

  initAuth() {
    hello.init({
        msft: {
          id: Configs.appId,
          oauth: {
            version: 2,
            auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
          },
          scope_delim: ' ',
          form: false
        },
      },
      //{ redirect_uri: "https://rpamonitoringtool.azurewebsites.net/home"}// TODO: window.location.href }
      { redirect_uri: "http://localhost:4200"}
    );
  }

  login() {
    console.log(Configs);
    hello('msft').login({ scope: Configs.scope }).then(
      (d) => {
        // this.sharedDataService.updateAccessToken(d.authResponse.access_token);
        // this.graphHelperService.getUserDetails();
        this.UIData.updateAuthButtonName("Sign Out");
        this.UIData.updateUserAuthenticationStatus(true);
      },
      e => console.error(e.error.message)
    );
  }

  logout() {
    hello('msft').logout().then(
      () => {
        window.location.href = '/';
        this.UIData.updateAuthButtonName("Sign In");
        this.UIData.updateUserAuthenticationStatus(false);
      },
      e => console.error(e.error.message)
    );
  }
}
