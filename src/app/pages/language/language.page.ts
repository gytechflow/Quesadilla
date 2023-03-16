import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage extends ThemePage implements OnInit {
  languages = [];
  selected = '';

  constructor(private languageService: LanguageService, theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
    console.log('LanguagePage Selected >>>>> ' + this.selected);
  }

  select(lng) {
    this.languageService.setLanguage(lng);
    console.log('LanguagePage >>>>> ' + lng);
  }

}
