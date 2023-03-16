import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService, private storage: Storage) { }

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang('de');

    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
        console.log('Language value >> '+val);
      }
      else{
        this.setLanguage(language);
        console.log('No Language value');
      }
    });    
  }

  getLanguages() {
    return [
      { text: 'LANGUAGE.German', value: 'de', img: '../../assets/images/german.png' },
      { text: 'LANGUAGE.English', value: 'en', img: '../../assets/images/english.jpg' },
      { text: 'LANGUAGE.French', value: 'fr', img: '../../assets/images/french.png'}
    ]
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }
}
