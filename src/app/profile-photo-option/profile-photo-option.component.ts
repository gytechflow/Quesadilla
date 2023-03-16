import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeService } from '../services/theme/theme.service';
import { ThemePage } from '../theme.page';
@Component({
  selector: 'app-profile-photo-option',
  templateUrl: './profile-photo-option.component.html',
  styleUrls: ['./profile-photo-option.component.scss'],
})
export class ProfilePhotoOptionComponent extends ThemePage implements OnInit {

  constructor(private modalController: ModalController, theme: ThemeService) { super(theme); }

  ngOnInit() { }
  closeModal() {
    this.modalController.dismiss(null, 'backdrop');
  }
  startCapture(type) {
    this.modalController.dismiss(type, 'select');

  }
  startGallery(type) {
    this.modalController.dismiss(type, 'gallery');

  }
  delete(type) {
    this.modalController.dismiss(type, 'delete');

  }
}


