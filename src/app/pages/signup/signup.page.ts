import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends ThemePage implements OnInit {

  credentialsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    theme: ThemeService
  ) {
    super(theme);
  }

  ngOnInit() {

  }

  openSignin() {
    this.route.navigate(['signin']);
  }

  openHome() {
    this.route.navigate(['home']);
  }

}
