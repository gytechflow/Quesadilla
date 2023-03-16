import { Component } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';


export class ThemePage {
  public static themeColor = [
    { name: 'Dark', class: 'dark-theme' },
    { name: 'Purple', class: 'purple' },
    { name: 'Green', class: 'green' }
  ];
  public selectTheme;
  constructor(private theme: ThemeService) {
    this.selectTheme = 'red';
    //this.dynamicTheme()
  }
  dynamicTheme() {
    this.theme.activeTheme(this.selectTheme);
  }

  setTheme(value:string){
    this.theme.activeTheme(this.selectTheme);
  }
}