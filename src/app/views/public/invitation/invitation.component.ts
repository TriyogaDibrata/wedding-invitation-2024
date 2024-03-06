import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { ApiResponse } from '@interfaces/api-response';
import { Comment } from '@interfaces/comment';
import { Guest } from '@interfaces/guest';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '@services/alert.service';
import { LoaderService } from '@services/loader.service';
import { RequestsService } from '@services/requests.service';
import { Modal, ModalInterface } from 'flowbite';
import moment from 'moment';
import AOS from 'aos';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss'
})
export class InvitationComponent implements OnInit{
  
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  guest : Guest;
  currentLang : string = "";
  guest_id? = '';
  recipient_name? = '';
  comments : Comment[];

  invitationModalEl : HTMLElement;
  invitationModal : ModalInterface;

  bankAccountModalEl : HTMLElement;
  bankAccuntModal : ModalInterface;
  calendar_url = "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=cGFxbmNrdXY1dGQ2dTI0c3NsZXIzb2VrdDggZDUwZjFiODcxODBiNjMzZTJlNTY5MDEyNzUxMTA5NzNmYWNjNDAzMzk5MzgzMTIyODA4MzYwNWM2YWZiMjk0NEBn&tmsrc=d50f1b87180b633e2e56901275110973facc4033993831228083605c6afb2944%40group.calendar.google.com";

  public rsvpForm : FormGroup = new FormGroup({
    name: new FormControl(''),
    is_attend: new FormControl(''),
    companions: new FormControl(''),
    comment: new FormControl('')
  });

  heroImages = [
    {
      id: 1,
      url: "assets/galleries/6.jpg"
    },
    {
      id: 2,
      url: "assets/galleries/7.jpg"
    },
    {
      id: 3,
      url: "assets/galleries/8.jpg"
    }
  ];

  galleries = [
    {
      id: 1,
      url: "assets/galleries/1.jpg"
    },
    {
      id: 2,
      url: "assets/galleries/2.jpg"
    },
    {
      id: 3,
      url: "assets/galleries/3.jpg"
    },
    {
      id: 4,
      url: "assets/galleries/4.jpg"
    },
    {
      id: 5,
      url: "assets/galleries/5.jpg"
    },
    {
      id: 6,
      url: "assets/galleries/6.jpg"
    },
    {
      id: 7,
      url: "assets/galleries/7.jpg"
    },
    {
      id: 8,
      url: "assets/galleries/8.jpg"
    }
  ]
  
  constructor(
    private http: HttpClient,
    private translate : TranslateService,
    private route: ActivatedRoute,
    private request: RequestsService,
    private formBuilder: FormBuilder,
    private alert : AlertService,
    public loader : LoaderService
  ) {
    
  }

  ngOnInit(): void {
    this.guest = {};
    this.comments = [];
    this.invitationModalEl = document.querySelector('#invitation-card');
    this.invitationModal = new Modal(this.invitationModalEl);

    this.bankAccountModalEl = document.querySelector('#bank-account');
    this.bankAccuntModal = new Modal(this.bankAccountModalEl);
    setTimeout(() => {
      this.initPage();
    }, 500);
    this.currentLang = this.translate.getDefaultLang();
  }

  ngAfterViewInit() : void {
    AOS.init();
    this.guest_id = this.route.snapshot.paramMap.get('id');
    // if(this.guest_id) {
    //   this.getGuestDetail(this.guest_id);
    // }
    this.route.queryParams.subscribe((params) => {
      this.recipient_name = params['to'];
    });

    this.rsvpForm = this.formBuilder.group({
      name: [this.recipient_name ? this.recipient_name : '', [Validators.required]],
      is_attend: ['', [Validators.required]],
      companions: [''],
      comment: ['']
     });
     this.getWishes();
  }

  initPage() {
    setInterval(() => {
      this.countDown();
    }, 1000);

    this.invitationModal.show();
  }

  async switchLang(lang : string) {
    const switching = await this.translate.use(lang);
    this.currentLang = lang;
  }

  countDown() {
    var now = moment(new Date());
    var end = moment('2024-05-18 16:00:00');
    var duration = moment.duration(end.diff(now));
    this.days = duration.asDays() > 0 ? Math.floor(duration.asDays()): parseInt('00');
    this.hours = duration.hours() > 0 ? duration.hours() : parseInt('00');
    this.minutes = duration.minutes() > 0 ? duration.minutes() : parseInt('00');
    this.seconds = duration.seconds() > 0 ? duration.seconds() : parseInt('00');
  }

  closeModalInvitation() {
    this.invitationModal.hide();
  }

  openBankAccountModal() {
    this.bankAccuntModal.show();
  }

  closeBankAccountModal() {
    this.bankAccuntModal.hide();
  }

  getGuestDetail(id) {
    this.request.reqGet('public/guest/'+id).subscribe({
      next: (res : ApiResponse) => {
        this.guest = res.result;
      }
    })
  }

  sendAnswer() {
    this.request.reqPost('public/rsvp/'+this.guest_id, this.rsvpForm.value).subscribe({
      next: (res : ApiResponse) => {
        if(res && res.success) {
          this.rsvpForm.get('is_attend').setValue('');
          this.rsvpForm.get('companions').setValue('');
          this.rsvpForm.get('comment').setValue('');
          this.alert.showToast('success', res.message);
          this.getWishes();
        }
      }
    })
  }

  getWishes() {
    this.request.reqGet('public/comments').subscribe({
      next: (res : ApiResponse) => {
        if(res && res.success) {
          this.comments = res.result;
        }
      }
    })
  }

  convertDateTime(date) {
    return moment(date).fromNow();
  }

  copyClipboard(id : string) {
    let clipboardEl : HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    let success_message = document.getElementById(id+'-success-message');
    let default_message = document.getElementById(id+'-default-message');

    navigator.clipboard.writeText(clipboardEl.value);
    success_message.classList.remove('hidden');
    default_message.classList.add('hidden');

    setTimeout(() => {
      success_message.classList.add('hidden');
      default_message.classList.remove('hidden');
    }, 5000);
  }
}
