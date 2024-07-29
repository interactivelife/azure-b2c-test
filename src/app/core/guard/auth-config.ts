import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.azureActiveDirectory.clientId,
    authority: `https://${environment.azureActiveDirectory.tenantName}.b2clogin.com/${environment.azureActiveDirectory.tenantName}.onmicrosoft.com/${environment.azureActiveDirectory.signupSingInPolicy}`,
    knownAuthorities: [`${environment.azureActiveDirectory.tenantName}.b2clogin.com`],
    redirectUri: environment.azureActiveDirectory.redirectUri,
    navigateToLoginRequestUrl: true,

  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loadFrameTimeout: 90000,
    tokenRenewalOffsetSeconds: 3540,
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

export const protectedResources = {
  topApi: {
    endpoint: environment.azureActiveDirectory.resources.investorPortalApi.endPoint,
    scopes: [environment.azureActiveDirectory.resources.investorPortalApi.scope],
  }
}

export const loginRequest = {
  scopes: []
};