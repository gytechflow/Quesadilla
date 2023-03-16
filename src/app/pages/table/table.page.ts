import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table/table.service';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage extends ThemePage implements OnInit {

  data: any;
  freeTables: any;
  rooms: any;
  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private netAware: NetworkErrorRouterService,
    private tableService: TableService,
    theme: ThemeService
  ) {
    super(theme);
  }

  ngOnInit() {
    console.log('Test >>>>>>>')
    this.getFreetables(1);

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;



      }
    });



  }

  openBooking() {
    //this.router.navigate(['booking']);
    this.netAware.gotoPage('booking', null, true);
    
  }

  printTabel(data) {
    for (const item of data) {
      //console.log(item.number);
    }
  }

  getFreetables(id) {
    this.tableService.getFreeTable().subscribe(result => {
      this.data = result;
      this.freeTables = this.data.filter(tables => {
        return tables.floor == id;
      });
      //onsole.log('Tables Page >>>>>>>' + this.freeTables)
    }, async error => {
      console.log(JSON.stringify(error));
    });
  }


}
