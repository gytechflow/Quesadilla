import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import { TranslateModule } from '@ngx-translate/core';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2TelInputModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  providers:[Camera],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
