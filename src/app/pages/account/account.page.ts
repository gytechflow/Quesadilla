import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ThemePage } from 'src/app/theme.page';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Item, SecondItem, StorageService, ProfilePic } from 'src/app/services/storage/storage.service';
import { DocumentsService } from 'src/app/services/document/documents.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service'



const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage extends ThemePage implements OnInit {

  response: any;
  image: string;
  source = "../../assets/images/image.jpeg"
  images: LocalFile[] = [];
  picture: ProfilePic = <ProfilePic>{};
  imageServer: any;
  user: Item;
  items: Item = <Item>{};
  filename: any;
  status: any;
  socid: any;
  TAG: string = "AccountPage";






  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    public storageService: StorageService,
    private platform: Platform,
    private netAware: NetworkErrorRouterService,
    private documentService: DocumentsService,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService) {
    super(theme);

    this.platform.ready().then(() => {
      console.log("platform.ready()");
      /*this.route.queryParams.subscribe(params => {
        console.log("route.queryParams");
        if (params) {
          console.log("route.queryParams  if (params) "+JSON.stringify(params));
          this.image = params.image
        } else {
          console.log("route.queryParams  else (params)");
          this.image = "../../assets/images/image.jpeg";
        }

        
      })*/
      this.loadFiles();
      //this.getConnectivity();

    })
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter()");
    this.loadItems();
  }

  getConnectivity() {
    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.status = online;
    })
  }

  async getImageOnServer(id: string) {
    console.log("IID>>>>>>" + id);
    this.documentService.getDocument("societe", id + '/' + id + '.jpeg', 50000)
      .subscribe(result => {
        if (result) {
          this.response = true;
          //onsole.log("Picture " + result);
          this.imageServer = result;
          this.image = `data:image/jpeg;base64,${this.imageServer.content}`;
          this.filename = this.imageServer.filename;
          this.SaveServerImageOnLocalStorage(this.filename, this.image)
        } else {
          this.response = true;
          console.log("not found");

          // this.image="../../assets/images/image.jpeg";
          // this.delPic();
        }
      },
        (error) => {
          this.response = true;
          // this.image="../../assets/images/image.jpeg";
          // this.delPic();
          /*this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.getImageOnServer(id) }
              },
            ],
            this.TAG + "getImageOnServer");*/
        })
  }

  async SaveServerImageOnLocalStorage(filename: string, data: string) {
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${filename}`,
      data: data
    });
    return savedFile;
  }


  loadItems() {
    console.log("loadItems()");
    this.storageService.getItems().then(user => {
      console.log("storageService.getItems()");
      if (user == null) {
        console.log("if (user == null)");
        // this.showAlertItems();
        console.log("No data");
        this.image = this.source;
        this.response = true;
      } else {
        console.log("else (user == null)");
        this.socid = user.socid;
        this.user = user;
        console.log("Socid>>>>>" + this.socid);
        this.getImageOnServer(this.socid);
      }

    });
    this.storageService.getSecondItems().then(user => {
      console.log("storageService.getSecondItems()");
      if (user == null) {
        console.log("storageService.getSecondItems() if (user == null)");
        console.log("No data");

      } else {
        console.log("storageService.getSecondItems() else (user == null)");
      }
    })
  }


  ngOnInit() {
  }
  gotoprofil() {
    this.netAware.gotoPage('profile', null, false);
  }

  gotobook() {
    //this.router.navigate(['reservation']);
    this.netAware.gotoPage('reservation', null, true);
  }

  gotoorder() {
    //this.router.navigate(['pages/myorders']);
    this.netAware.gotoPage('pages/myorders', null, true);
  }

  gotocoupons() {
    //this.router.navigate(['pages/coupons']);
    this.netAware.gotoPage('pages/coupons', null, true);
  }

  gotorefer() {
    //this.router.navigate(['pages/refer']);
    this.netAware.gotoPage('not-available', null, true);
    //this.netAware.gotoPage('pages/refer', null, true);
  }

  gotosupport() {
    //this.router.navigate(['pages/support']);
    this.netAware.gotoPage('not-available', null, true);
    //this.netAware.gotoPage('pages/support', null, true);
  }

  openOptionSelection() {
    throw new Error('Method not implemented.');
  }

  async loadFiles() {
    console.log("loadFiles()");
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      console.log("Filesystem.readdir() then(");
      this.response = result;
      console.log('HERE: ', result);
      this.loadFileData(result.files);
    },
      async (error) => {
        console.log("async (error)");
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR
        });
      })
  }

  async loadFileData(fileNames: string[]) {
    console.log("loadFileData  "+JSON.stringify(fileNames));
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });
      console.log("readFile" + readFile);
      if (readFile.data == null) {
        console.log("if (readFile.data == null)");
        this.image = this.source;
      } else {
        console.log("else (readFile.data == null)");
        this.image = `data:image/jpeg;base64,${readFile.data}`;
        this.source = this.image;
      }
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      })
    }
  }

}
