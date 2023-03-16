import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ProfilePhotoOptionComponent } from 'src/app/profile-photo-option/profile-photo-option.component';
import { OrderService } from 'src/app/services/order/order.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { TranslateService } from '@ngx-translate/core';
import { Item, SecondItem, StorageService, ProfilePic } from 'src/app/services/storage/storage.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Photo, CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { DocumentsService } from 'src/app/services/document/documents.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';


const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends ThemePage implements OnInit {

  items: Item = <Item>{};
  items2: SecondItem = <SecondItem>{};
  picture: ProfilePic = <ProfilePic>{};
  form: FormGroup;

  socid: any;
  user: Item;
  name: any;
  phone: any;
  email: any;

  user2: Item;
  name2: any;
  phone2: any;
  email2: any;

  serverItems: any;
  imageServer: any;
  street: any;
  code: any;
  town: any;

  street2: any;
  code2: any;
  town2: any;

  editname: boolean = false;
  editphone: boolean = false;
  editemail: boolean = false;
  editstreet: boolean = false;
  edittown: boolean = false;
  editcode: boolean = false;

  nameFocus: boolean;
  phoneFocus: boolean;
  emailFocus: Boolean;

  streetFocus: boolean;
  codeFocus: boolean;
  townFocus: Boolean;

  change: Boolean;
  filename: any;
  source = "../../assets/images/image.jpeg"
  images: LocalFile[] = [];
  status: any;
  orders: any;
  booking: any;
  image: string;
  pic: string;
  response: boolean = false;

  oldOrder = [];
  oldBooking = [];

  dropbooking: boolean = false;
  droporder: boolean = false;

  gettingBookings: boolean = false;
  gettingOrders: boolean = false;

  orderPage: number = 0;
  bookingPage: number = 0;
  limit: number = 10;
  TAG: string = "ProfilePage";
  profileFound: boolean = true;

  constructor(public storageService: StorageService,
    private orderService: OrderService,
    private bookingService: BookingService,
    private platform: Platform,
    private modalController: ModalController,
    private translate: TranslateService,
    private loadingcontroller: LoadingController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private connectivityProvider: ConnectivityProvider,
    private alertController: AlertController,
    private netAware: NetworkErrorRouterService,
    private documentService: DocumentsService,
    private formBuilder: FormBuilder,
    theme: ThemeService
  ) {
    super(theme);
    this.platform.ready().then(() => {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.image = params.image;
        } else {
          this.image = "../../assets/images/image.jpeg";
        }
      })
      //this.loadItems();

      /*this.getConnectivity();
      if (this.status === false) {

      } else {
        this.loadItems();
      }*/
    })
  }

  ionViewDidEnter() {
    this.loadItems();
  }

  async ngOnInit() {
    this.getConnectivity();
    if (this.status === false) {
      console.log("Connexion off");
      this.showAlert()
    }
    this.initForm()
  }




  initForm() {
    this.form = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^[0-9 ]{9}/)]],
      names: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: ['', [Validators.required, Validators.pattern(/^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/)]],
      street: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(/^[0-9 ]{4}/), Validators.minLength(4)]],
      town: ['', [Validators.required]]
    })
  }
  getConnectivity() {
    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.status = online;
      console.log(online)
    })
  }
  Onchange() {
    this.change = !this.change;
  }

  home() {
    this.netAware.gotoPage("home");
  }

  loadItems() {
    this.storageService.getItems().then(user => {
      if (user == null) {
        // this.showAlertItems();
        console.log("No data");
        this.image = this.source;
        this.response = true;
        this.profileFound = false;
      } else {
        this.user = user;
        this.name = this.user.name
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.socid = this.user.socid;
        this.name2 = this.user.name
        this.phone2 = this.user.phone;
        this.email2 = this.user.email;
        console.log("Socid>>>>>" + this.socid);
        this.getImageOnServer(this.socid);
        if (this.status === true) {
          this.getImageOnServer(this.socid);
          this.getItems(this.user.socid)
          this.statOrders();
          this.statBooking();
        } else {
          this.response = true;
          console.log("Connexion off");
        }

      }

    });
    this.storageService.getSecondItems().then(user => {
      if (user == null) {
        console.log("No data");

      } else {
        this.code = user.code;
        this.street = user.street;
        this.town = user.town

        this.code2 = user.code;
        this.street2 = user.street;
        this.town2 = user.town
      }
    })
  }

  qrcode() {

  }

  phoneBlur(event: any) {
    const value = event.target.value;
    console.log("Valuee >>>>", value);
    if (value === this.phone) {
      this.phoneFocus = false
    }
    this.phone = value;
    if (!value) {
      this.phoneFocus = false;

    }

  }
  nameBlur(event: any) {

    const value = event.target.value
    console.log("Valuee >>>>", value);
    this.name = value;
    if (!value) {
      this.nameFocus = false;
    }

  }
  emailBlur(event: any) {

    const value = event.target.value
    console.log("Valuee >>>>", value);
    this.email = value;
    if (!value) {

      this.emailFocus = false;

    }

  }
  codeBlur(event: any) {

    const value = event.target.value
    console.log("Valuee >>>>", value);
    this.code = value;
    if (!value) {

      this.codeFocus = false;

    }

  }
  streetBlur(event: any) {

    const value = event.target.value
    console.log("Valuee >>>>", value);
    this.street = value;
    if (!value) {

      this.streetFocus = false;

    }

  }
  townBlur(event: any) {

    const value = event.target.value
    console.log("Valuee >>>>", value);
    this.town = value;
    if (!value) {

      this.townFocus = false;

    }
  }

  Save() {
    this.items.id = Date.now();
    this.items.email = this.email;
    this.items.name = this.name;
    this.items.phone = this.phone;
    this.items.socid = this.socid;
    this.storageService.addItem(this.items).then(val => {
      this.items = <Item>{};
    })
    this.items2.code = this.code;
    this.items2.street = this.street;
    this.items2.town = this.town;
    this.storageService.addSecondItem(this.items2).then(val1 => {
      this.items2 = <SecondItem>{};
    });
    this.postItems()

  }
  resetName() {
    this.nameFocus = false;
    this.name = this.name2;
  }
  resetCode() {
    this.codeFocus = false;
    this.code = this.code2;
  }
  resetStreet() {
    this.streetFocus = false;
    this.street = this.street2;
  }
  resetPhone() {
    this.phoneFocus = false;
    this.phone = this.phone2;
  }
  resetMail() {
    this.emailFocus = false;
    this.email = this.email2;
  }

  reset() {
    this.codeFocus = false;
    this.streetFocus = false;
    this.townFocus = false;
    this.emailFocus = false;
    this.phoneFocus = false;
  }
  async statOrders() {
    this.gettingOrders = true;
    this.orderService.getMyOrders(this.socid, this.orderPage, this.limit)
      .subscribe(res => {
        this.orders = res;
        // console.log("Order is"+ this.orders);
        for (let order of this.orders) {
          this.oldOrder.push(order)
          console.log(order.id);
        }
        this.orderPage++;
        this.statOrders();
      },
        (error) => {
          console.log("We have " + error.status + " Error : "+JSON.stringify(error));
          if ("" + error.status === "" + 404) {
            this.gettingOrders = false;
          } else {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.refreshOrder() }
                },
              ],
              this.TAG + "statOrders");
          }
        }
      )
  }

  refreshOrder() {
    this.orderPage = 0;
    this.oldOrder = []
    this.statOrders();
  }

  async statBooking() {
    this.gettingBookings = true;
    console.log("statBooking : " + this.socid)
    this.bookingService.getMyBookings(this.socid, this.bookingPage, this.limit)
      .subscribe(res => {
        //onsole.log("result   {\n" + JSON.stringify(res) + "\n}");
        this.booking = res;
        // console.log("Order is"+ this.orders);
        for (let booking of this.booking) {
          //console.log("result "+JSON.stringify(booking)+"\n\n"+this.socid);
          this.oldBooking.push(booking);
          //onsole.log(booking.label);
        }
        this.bookingPage++;
        this.statBooking();
      },
        (error) => {
          if ("" + error.status === "" + 404) {
            this.gettingBookings = false;
          } else {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.refreshBooking() }
                },
              ],
              this.TAG + "statBooking");
            console.log("We have " + error.status + " Error : "+JSON.stringify(error));
          }
        })
  }

  refreshBooking() {
    this.bookingPage = 0;
    this.oldBooking = []
    this.statBooking();
  }

  showOldBooking(msg: string, type: string, id: string) {
    let alert = this.alertController.create({
      message: msg + "<br>" + type + "<br><br>",
      header: this.translate.instant('BOOKING.Title') + " " + id,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }



  showOldOrder(msg: any, id: string, totalPrice: any) {
    var value = '';

    for (let element of msg) {
      //onsole.log(element.qty + " " + element.libelle + " " + element.price + "" + "€");
      value += "(" + element.qty + ")" + " " + element.libelle + " " + element.price + "" + " €" + " <br>";
    }

    let alert = this.alertController.create({
      message: value + "<br> <br>" + "<b>" + this.translate.instant('PROFILE.TTP') + " " + Number(totalPrice).toFixed(2) + " €" + "</b>" + "<br>",
      header: this.translate.instant('PROFILE.Orders') + " " + id,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  async postItems() {
    if (this.status === false) {
      this.showAlert();
    } else {
      let loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: this.translate.instant('BOOKING.Wait'),
      });
      // loading.present().then(() =>{
      this.orderService.UpdateThirdParties(this.socid, this.name, this.town, this.code, this.street, this.phone, this.email, Date.now())
        //.timeout(10000)
        .subscribe(res => {
          // this.documentService.postDocument(this.filename,"societe","",this.socid,this.pic,"base64","1","1")
          // .timeout(10000)
          // .subscribe( result =>{
          //   console.log("Result "+ result);
          //   loading.dismiss();
          // },
          // (error)=>{
          //   loading.dismiss();
          // })
          //onsole.log(res);
          // loading.dismiss();
        },
          (error) => {
            // loading.dismiss();
            this.netAware.showAlert(
              error,
              [
                {
                  text: "Ok",
                },
              ],
              this.TAG + "postItems");
          })

      // })
    }
  }
  async responses() {
    return this.response = true;
  }

  async postpicture() {
    if (this.status === false) {
      this.image = this.image;
    } else {
      let loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: this.translate.instant('BOOKING.Wait'),
      });
      loading.present().then(() => {
        this.uploadPicture(loading);
      })
    }

  }

  uploadPicture(loading) {
    this.documentService.postDocument(this.filename, "societe", "", this.socid, this.pic, "base64", "1", "1", 30000)
      .subscribe(result => {
        if (result) {
          //onsole.log(("L'image envoye est" + this.pic));
          this.response = true
          loading.dismiss();
          // this.SaveServerImageOnLocalStorage(this.filename,this.pic).then(result=>{
          if (result) {
            //onsole.log("Picture send " + result);
            // this.loadFiles();
          }
          // })
        }
      },
        (error) => {
          loading.dismiss();
          this.response = true;
          this.image = this.source;
          /*this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.uploadPicture(loading) }
              },
            ],
            this.TAG + "uploadPicture");*/
          console.log("We have " + error.status + " Error : "+JSON.stringify(error));
        })
  }

  async RemovePic() {
    let data: string = "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"

    if (this.status === false) {
      this.image = this.image;
    } else {
      let loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: this.translate.instant('BOOKING.Wait'),
      });
      loading.present().then(() => {
        this.changePicture(loading, data)
      })
    }
  }

  changePicture(loading, data) {
    this.documentService.postDocument(this.socid + '.jpeg', "societe", "", this.socid, data, "base64", "1", "1", 30000)
      .subscribe(result => {
        if (result) {
          loading.dismiss();
          this.SaveServerImageOnLocalStorage(this.filename, data).then(result => {
            if (result) {
              this.loadFiles();
              loading.dismiss();
              //onsole.log("Picture send " + result);
            }
          })
        }
      },
        (error) => {
          loading.dismiss();
          this.image = this.image;
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.changePicture(loading, data) }
              },
            ],
            this.TAG + "changePicture");
          console.log("We have " + error.status + " Error : "+JSON.stringify(error));
        })
  }
  delPic() {
    let data: string = "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"
    this.SaveServerImageOnLocalStorage(this.socid + '.jpeg', data).then(result => {
      if (result) {
        this.loadFiles();
        //onsole.log("Picture send " + result);
      }
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

  async getItems(id: number) {
    if (this.status === false) {
      console.log("Connexion off");

    } else {
      this.orderService.getThirdParty(id, 50000)
        .subscribe(result => {
          this.serverItems = result;
          console.log("Mes Infos " + this.serverItems.name);
          this.name = this.serverItems.name;
          this.phone = this.serverItems.phone;
          this.email = this.serverItems.email;
          this.town = this.serverItems.town;
          this.street = this.serverItems.address;
          this.code = this.serverItems.zip
          this.Save();
        },
          error => {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.getItems(id) }
                },
              ],
              this.TAG + "getItems");
          })
    }

  }

  async openOptionSelection() {
    if (this.status === false) {
      console.log("No internet Connexion");
      this.showAlert();
    } else if (this.socid == null) {
      this.showAlertItems();
    } else {
      const modal = await this.modalController.create({
        component: ProfilePhotoOptionComponent,
        cssClass: 'transparent-modal'
      });
      modal.onDidDismiss()
        .then(res => {
          //onsole.log('ressource', res);
          if (res.role === 'select') {
            this.takePicture();
          } else if (res.role === 'gallery') {
            this.selectImage();
          }
          else if (res.role === 'delete') {
            this.RemovePic();
          } else if (res.role === 'backdrop') {

          }
        });
      return await modal.present();
    }

  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,

    });
    if (image) {
      this.delfiles().then(() => {
        console.log("Camera");
        this.saveImage(image).then(result => {

          this.postpicture();

        });
      })
    }
    //onsole.log('la source est', this.source);

  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos

    });
    if (image) {
      this.delfiles().then(() => {
        console.log("Select Image");
        this.saveImage(image).then(result => {
          this.postpicture();

        });

      })
    }

  }

  async saveImage(photo: Photo) {

    const base64Data = await this.readAsBase64(photo);
    const fileName = this.socid + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    //onsole.log("Saved file" + savedFile);
    return savedFile;
  }

  async SaveServerImageOnLocalStorage(filename: string, data: string) {
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${filename}`,
      data: data
    });
    return savedFile;
  }

  async loadFiles() {
    if (this.socid === null) {
      console.log("NO SOCID >>>>>>>>>>>>");

    } else {
      console.log("LOADFILES >>>>>>>>>>>>>>>>>");
      let loading = await this.loadingcontroller.create({
        spinner: 'lines',
        translucent: true
      });
      loading.present();
      Filesystem.readdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      }).then(result => {
        //onsole.log('HERE: ', result);
        this.loadFileData(result.files);
        loading.dismiss();
      }, async err => {
        console.log('loading Error', JSON.stringify(err));
        Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR
        });
      }).then(() => {
        loading.dismiss();
      })

    }

  }

  async delfiles() {
    this.images = [];
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      this.deleteFileData(result.files);
    }, async err => {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_ => {
    })
  }

  async deleteFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.deleteFile({
        directory: Directory.Data,
        path: filePath
      });
    }
    this.loadFiles();
  }


  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {

      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,

      });
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`

      })
      this.pic = readFile.data;
      this.image = `data:image/jpeg;base64,${readFile.data}`;
      this.filename = f;
      var a = `data:image/jpeg;base64,${readFile.data}`;
      console.log("Le nom du fichier" + this.filename);


    }
    return a;
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


  showAlert() {
    let alert = this.alertController.create({
      message: this.translate.instant('PROFILE.NoData'),
      header: this.translate.instant('PROFILE.NetworkError'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  showAlertItems() {
    let alert = this.alertController.create({
      message: this.translate.instant('PROFILE.FirstOrderOrBooking'),
      header: "",
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }


  setEditName() {
    this.editname = !this.editname;
  }
  setEditMail() {
    this.editemail = !this.editemail
  }
  setEditPhone() {
    this.editphone = !this.editphone
  }
  setEditTown() {
    this.edittown = !this.edittown;
  }
  setEditCode() {
    this.editcode = !this.editcode;
  }
  setEditStreet() {
    this.editstreet = !this.editstreet
  }
  DropOrders() {
    this.droporder = !this.droporder;
  }
  DropBooking() {
    this.dropbooking = !this.dropbooking;
  }


}
