import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpHandler } from "@angular/common/http";

import { AlertController, IonDatetime, IonInput, LoadingController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/operator/timeout';
import { ErrorHandler } from '@angular/core';
import * as moment from 'moment-timezone';
import { BookingService } from 'src/app/services/booking/booking.service';
import { catchError } from 'rxjs/operators';
import { Item, StorageService } from 'src/app/services/storage/storage.service';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { SetupService } from 'src/app/services/setup/setup.service';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage extends ThemePage implements OnInit {
  @ViewChild("timeValue") timeValue: IonInput;
  places = [...Array(10).keys()];
  items: Item = <Item>{};
  newItem: Item = <Item>{};
  dataFromservice: any;
  dataToSend: any;
  display: string;
  date;
  time;
  dataInicial: Date;
  fins: any;
  finss: any;
  idbook: any;
  form: FormGroup;
  minTime: any;
  data: any;
  type: any;
  status: any;
  booking: any;
  socid: any;
  template: any;
  label = "QDILLA_DISPLAYED_NEWS";
  currentDate = new Date();
  deutch = moment(this.currentDate).tz('Europe/Berlin').format('LLLL'); // fuseau horaire allemand
  germanTZ = moment(this.currentDate).tz('Europe/Berlin').format('Z'); // fuseau horaire allemand
  currentTimeDeutch = new Date(this.deutch);
  selectedDate: String;
  selectedTime: String;
  dateButtonClicked = {
    isClicked: false,
  };
  timeButtonClicked = {
    isClicked: false,
  };



  isAvailable: boolean;

  types = [
    { text: 'keine', group: 'US', value: 51 },
    { text: 'Geburtstag', group: 'US', value: 52 },
    { text: 'Jahrestag', group: 'UK', value: 53 },
    { text: 'Besonderer Anlass', group: 'UK', value: 54 },
    { text: 'Geschaeftsessen', group: 'UK', value: 55 },
  ];
  TAG: string = "BookingPage";

  constructor(public bookingService: BookingService,
    public toastController: ToastController,
    public alertController: AlertController,
    private netAware: NetworkErrorRouterService,
    private plateform: Platform,
    private setupService: SetupService,
    public storageService: StorageService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public errorService: ErrorHandler,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService

  ) {
    super(theme);
    this.plateform.ready().then(() => {
      this.loadItems();
      this.selectedDate = this.translate.instant('BOOKING.Date');
      this.selectedTime = this.translate.instant('BOOKING.Time');
    });
  }

  ngOnInit() {
    this.getTemplate();
    this.initForm();
    console.log('En Allemagne nous somme', this.deutch)
    // this.getTypeBooking();
  }
  /**
   * Get news
   */
  async getTemplate() {
    this.setupService.getMailTemplate(this.label)
      .subscribe(res => {
        let result;
        result = res;
        this.template = result.content;
        //onsole.log(this.template);
      },
        error => {
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.getTemplate() }
              },
            ],
            this.TAG + "AcceptMedia");
        })
  }

  /**
   * Initialisation du formulaire
   */
  initForm() {
    this.form = this.formBuilder.group({
      type_id: ['', [Validators.required]],
      // type_code:[''],
      // code:['',[Validators.required]],
      socid: [''],
      userownerid: [''],
      label: [''],
      names: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      nbplace: ['', [Validators.required, Validators.max(10), Validators.pattern(/^[1-9]+0?$/)]],
      email: ['', [Validators.required, Validators.pattern(/^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/)]],
      datep: ['', [Validators.required]],
      type_short: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^[0-9 ]{9}/)]],
      note_private: ['']

    });
  }

  noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  /**
   * Send data
   */

  getConnectivity() {
    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.status = online;
      console.log(online)
      return this.status;
    })
  }


  async SaveBooking() {

    const form = this.form.value;

    //this.name= form['label']
    const res = "Reservation de " + form['names'] + " " + form['phone'] + " " + form['nbplace'] + " " + "places";
    form['label'] = res;
    var year = new Date(form['datep']).getFullYear();
    var month = new Date(form['datep']).getMonth() + 1;
    var months = ("0" + month).slice(-2);
    var day = new Date(form['datep']).getDate();
    var days = ("0" + day).slice(-2);


    this.finss = year + "-" + months + "-" + days;

    var tm = form['type_short']; // Value from ion-datetime
    var d = tm.split('T')[1];
    var m = d.split(':')[0];
    var n = d.split(':')[1];
    tm = m + ":" + n; // ,mm
    this.fins = tm;
    //onsole.log("l'heure envoyer", year + "-" + months + "-" + days + " " + tm)

    let selectedDateTime = new Date(year + "-" + months + "-" + days + " " + tm);
    let selected = moment(selectedDateTime).tz('Europe/Berlin');
    //form['datep'] = ""+Date.UTC(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate(),
     //selectedDateTime.getHours(), selectedDateTime.getMinutes(), selectedDateTime.getSeconds())/1000;

    //form['datep'] = selected.unix()/1000;
    form['datep'] = selectedDateTime.getTime()/1000;

    let deutchFromLocalString = new Date(selectedDateTime.toLocaleString()).toLocaleString("en-US", {timeZone:'Europe/Berlin'});
    let deutchFromTime = new Date(selectedDateTime.getTime()).toLocaleString("en-US", {timeZone:'Europe/Berlin'});
    let deutchDateFromLocalString = new Date(deutchFromLocalString);
    let deutchDateFromTime = new Date(deutchFromTime);
    console.log("deutchFromLocalString", ""+deutchFromLocalString);
    console.log("deutchFromTime", ""+deutchFromTime);
    console.log("selectedDateTime", ""+selected.toLocaleString());
    console.log("selectedDateTime", ""+selected);
    console.log("deutchDateFromLocalString", ""+deutchDateFromLocalString);
    console.log("deutchDateFromTime", ""+deutchDateFromTime);
    console.log("deutchDateFromLocalString-value", ""+deutchDateFromLocalString.toLocaleString());
    console.log("deutchDateFromTime-value", ""+deutchDateFromTime.toLocaleString());
    form['type_short'] = "";
    // form['type_id']="54";
    // form['type_code']="AC_OTH_AUTO";
    // form['code']="RESERVATION";
    form['socid'] = "";
    form['userownerid'] = "1";
    // Send Data inside loading controller
    let dataToSend = JSON.stringify(form);
    //onsole.log("Mon formulaire soumis", form)
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('BOOKING.Wait'),
    });
    loading.present().then(() => {
      this.postBooking(dataToSend, loading);
    }
    )
  }

  postBooking(dataToSend, loading: HTMLIonLoadingElement) {
    this.bookingService.SaveBookingS(dataToSend)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
          console.log('OR THIS IS THE ERROR >>> ' + e.message);
          this.netAware.showAlert(
            e,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.postBooking(dataToSend, loading) }
              },
            ],
            this.TAG + "AcceptMedia");
          throw new HttpErrorResponse(e)
        })
      )
      .subscribe(
        dataReturnFromService => {
          this.getBookingOnPost(dataReturnFromService, loading);
        },
        (error) => {
          loading.dismiss();
          this.form.get('type_short').reset();
        }
      );
  }

  getBookingOnPost(bookingId, loading: HTMLIonLoadingElement) {
    let form = this.form.value;
    this.bookingService.getBookingById(bookingId)
      .subscribe(
        res => {
          this.booking = res;
          this.socid = this.booking.socid;
          this.idbook = JSON.stringify(bookingId);
          //onsole.log("Donnees",this.idbook)
          this.newItem.id = Date.now();
          this.newItem.email = form['email'];
          this.newItem.name = form['names'];
          this.newItem.phone = form['phone'];
          this.newItem.place = form['nbplace']
          console.log("HERE IS RESPONSE DATA " + this.idbook)
          this.bookingDetails(this.idbook);
          this.storageService.addItem(this.newItem).then(item => {
            this.newItem = <Item>{};
            this.loadItems();
          });

          loading.dismiss();
        })
  }


  async getTypeBooking() {
    this.bookingService.getFreeType()
      .subscribe(result => {
        this.data = result;
        this.type = this.data.filter(types => {
          return types;
        });
        //loading.dismiss();            

        //onsole.log("les types d'event", this.type);

      })
    /*
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message:this.translate.instant('BOOKING.Wait'),
    });
      loading.present().then(() =>{
    this.bookingService.getFreeType()
    .timeout(5000)
    .subscribe(result =>{
      this.data= result;
      this.type = this.data.filter( types =>{
        return types;
      });
      loading.dismiss();            
  
      onsole.log("les types d'event", this.type);
      
    },  (error) => {
      loading.dismiss();            
    });
  })
  */
  }


  /**
   * Recuperation des paramtetres faisant office de details de reservation
   */
  bookingDetails(id: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        socid: this.socid,
        label: this.form.value['names'],
        email: this.form.value['email'],
        date: this.finss,
        heure: this.fins,
        numero: this.form.value['phone'],
        place: this.form.value['nbplace'],
        dateR: new Date(),
        gmt: this.germanTZ,
      }
    }
    //this.router.navigate(['bookingdetails'], navigationExtras);
    this.netAware.gotoPage('bookingdetails', navigationExtras, true);
    this.form.reset();
  }

  /**
  * When booking sucess
  */

  // async bookOk() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: '',
  //     subHeader: '',
  //     message: this.translate.instant('BOOKING.OkBook'),
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // } 

  /**
   * When booking fail
   */
  async bookNotOk() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      subHeader: '',
      message: this.translate.instant('BOOKING.ErrorBook'),
      buttons: ['OK']
    });

    await alert.present();

  }
  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  /**
   * We can only book after 2 hours of the current time in deutch.
   */
  getDate() {
    this.form.get('type_short').reset();
    if (this.currentTimeDeutch.getHours() >= 22) { // Si il est 22h et plus 
      this.minTime = "09:00"
    }
    if (new Date(this.form.value['datep']).getFullYear() == this.currentDate.getFullYear() && new Date(this.form.value['datep']).getMonth() == this.currentDate.getMonth() && new Date(this.form.value['datep']).getDate() == this.currentDate.getDate()) {
      var currentHour = this.currentTimeDeutch.getHours()
      var currentMin = this.currentTimeDeutch.getMinutes();
      if (currentMin >= 45) {
        currentHour++
        currentMin = 0;
      }
      var hours = ("0" + currentHour).slice(-2);
      var min = ("0" + currentMin).slice(-2)

      this.minTime = hours + ":" + min;
    }
    else {
      this.minTime = "09:00";
    }

    //this.setDate();

  }

  setTime() {
    const form = this.form.value;
    var tm = form['type_short']; // Value from ion-datetime
    var d = tm.split('T')[1];
    var m = d.split(':')[0];
    var n = d.split(':')[1];
    tm = m + ":" + n; // ,mm
    this.selectedTime = tm;
    this.fins = tm;
    this.time
  }

  setDate() {
    const form = this.form.value;
    var year = new Date(form['datep']).getFullYear();
    var month = new Date(form['datep']).getMonth() + 1;
    var months = ("0" + month).slice(-2);
    var day = new Date(form['datep']).getDate();
    var days = ("0" + day).slice(-2);
    this.selectedDate = year + "-" + months + "-" + days;
  }

  openPicker(picker: IonDatetime) {
    picker.open();
  }

  loadItems() {
    if (this.items == null) {
      console.log("Pas de precedente reservation")
    } else {
      this.storageService.getItems().then(items => {
        this.items = items;
        //console.log("User Phone"+ this.items.phone)
      });
    }
  }

  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }





}
