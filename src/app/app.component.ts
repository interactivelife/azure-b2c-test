import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { MsaluserService } from './core/services/msaluser.service';
import { Subject, filter, takeUntil } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PGI Azure B2C ';
  isIframe = false;
  loginDisplay = false;
  emailAddress: string;
  private readonly _destroying$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private msalUserService: MsaluserService
  ) { }
  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(
        () => {
          this.setLoginDisplay();
        }
      );
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalAuthService.instance.getAllAccounts().length > 0;

    if (this.loginDisplay) {
      this.checkAndSetActiveAccount();
    }
    else {
      this.msalAuthService.instance.loginRedirect();
    }
  }

  checkAndSetActiveAccount() {
    if (this.msalAuthService.instance.getAllAccounts().length > 0) {
      let accounts = this.msalAuthService.instance.getAllAccounts();
      console.log('accounts',accounts);
      this.msalAuthService.instance.setActiveAccount(accounts[0]);
      this.getClaims(this.msalAuthService.instance.getActiveAccount());
    }
    else {
      this.msalAuthService.instance.loginRedirect();
    }
  }

  async getClaims(activeAccount: any) {
    console.log('getClaims');
    var claims = activeAccount?.idTokenClaims;
    this.emailAddress = activeAccount?.username;
    console.log(claims);

    if (claims != undefined && claims != null) {
      var data = {
        Email: this.emailAddress,
        AccessToken: '',
        GivenName: claims['given_name'],
        IsAuthenticated: true,
        LastName: claims['family_name'],
        Username: this.emailAddress,
        Name: claims['name'],
        Group: '',
        UserFirstAndLastName: `${claims['given_name'].charAt(0).toUpperCase()}${claims['given_name'].slice(1)} ${claims['family_name'].charAt(0).toUpperCase()}${claims['family_name'].slice(1)}`,
        IsExternal: (this.emailAddress.includes("@abcd.com") == false),
      };
      console.log(data);
     
      this.msalUserService.setUserObs(data);
      
    }
  }

}

