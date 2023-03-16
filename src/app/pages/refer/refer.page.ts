import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {

  constructor(private translate: TranslateService,) { }

  ngOnInit() {
  }

}
