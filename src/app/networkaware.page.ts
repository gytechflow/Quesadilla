import { Component } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { Router, NavigationExtras } from '@angular/router';
import { ConnectivityProvider } from 'src/app/services/network/network.service';


export class NetWorkAwarenessPage {
  isOnline:boolean = true;
  public selectTheme;
  constructor(
    private connectivityProvider: ConnectivityProvider,
    private router: Router, ) {
      console.log("NetWorkAwarenessPage");
      this.connectivityProvider.appIsOnline$.subscribe(online => {
        this.isOnline = online;
        if (!online) {
          this.router.navigate(['network-error']);
        }
      });
  }
}