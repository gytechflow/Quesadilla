import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage extends ThemePage implements OnInit {

  constructor(private route: Router, theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
  }

  openSignup() {
    this.route.navigate(['signup']);
  }

}
