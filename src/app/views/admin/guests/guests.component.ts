import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response';
import { Guest } from '@interfaces/guest';
import { RequestsService } from '@services/requests.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Modal, ModalInterface, ModalOptions, initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@services/alert.service';
import { environment } from '@environments/environment';
import { StateData } from '@interfaces/state-data';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule, ReactiveFormsModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss'
})
export class GuestsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false;

  invitation_url = environment.invitation_base_url;

  guests : Guest[];
  guest : Guest;

  guestModalEl : HTMLElement;
  detailModalEl : HTMLElement;

  modalCrud : ModalInterface;
  detailModal : ModalInterface;
  modalTitle = "";
  stateData : StateData;
  sharing_url : string;

  constructor(private request : RequestsService, private alert : AlertService) {}

  ngOnInit(): void {
    initFlowbite();
    this.guest = {};
    this.stateData = {};

    this.guestModalEl = document.querySelector('#createGuestModal');
    if(this.guestModalEl) {
      this.modalCrud = new Modal(this.guestModalEl);
    }

    this.detailModalEl = document.querySelector('#detail-modal');
    if(this.detailModalEl) {
      this.detailModal = new Modal(this.detailModalEl);
    }
  }

  ngAfterViewInit() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
    };
    this.getGuestLists();
    this.getStateData();
  }

  async getGuestLists() {
    const guests = await this.request.reqGet('guest').subscribe({
      next: (res : ApiResponse) => {
        this.guests = res.result;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next("");
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next("");
        }
      }
    })
  }

  async getStateData() {
    const states = await this.request.reqGet('dashboard').subscribe({
      next: (res : ApiResponse) => {
        this.stateData = res.result;
      }
    })
  }

  showModalCreate() {
    this.modalTitle = "Add new guest"
    this.modalCrud.show();
    this.guest = {};
  }

  showModalEdit(guest) {
    this.modalTitle = "Edit guest"
    this.modalCrud.show();
    this.guest = guest;
  }

  closeModal() {
    this.modalCrud.hide();
  }

  saveGuest() {
    let body = this.guest;
    if(this.guest.id) {
      this.updateGuest(body, this.guest.id);
    } else {
      this.storeGuest(body);
    }
  }

  async storeGuest(body) {
    await this.request.reqPost('guest', body).subscribe({
      next: async (res : ApiResponse) => {
        if(res && res.success) {
          this.alert.showToast("success", res.message);
          this.modalCrud.hide();
          this.getGuestLists();
          this.getStateData();
        }
      }
    })
  }

  async updateGuest(body, id) {
    await this.request.reqPost('guest/update/'+id, body).subscribe({
      next: async (res : ApiResponse) => {
        if(res && res.success) {
          this.alert.showToast("success", res.message);
          this.modalCrud.hide();
          this.getGuestLists();
          this.getStateData();
        }
      }
    })
  }

  async deleteGuest(id) {
    await this.request.reqDelete('guest', id).subscribe({
      next: (res : ApiResponse) => {
        if(res && res.success) {
          this.alert.showAlert('success', "Deleted", "Guest has been deleted !");
          this.getGuestLists();
          this.getStateData();
        }
      }
    })
  }

  confirmDelete(guest : Guest) {
    Swal.fire({
      title: "",
      text: "Are you sure to remove " + guest.name +" from your guest list! ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteGuest(guest.id);
      }
    });
  }

  async showDetailModal(guest) {
    this.detailModal.show();
    this.guest = guest;
    this.sharing_url = await this.generateUrl(guest);
  }

  closeModalDetail() {
    this.detailModal.hide();
  }

  async generateUrl(guest : Guest) {
    let name = guest.name;
    let new_name = name?.replaceAll(" ", "%20");
    return await this.invitation_url+"/invitation/"+guest.id+"?to="+new_name;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.sharing_url);

    let success_icon = document.getElementById('success-icon');
    let succes_tooltip = document.getElementById('success-tooltip-message');
    let default_icon = document.getElementById('default-icon');
    let default_tooltip = document.getElementById('default-tooltip-message');

    default_icon.classList.add('hidden');
    default_tooltip.classList.add('hidden');
    success_icon.classList.remove('hidden');
    succes_tooltip.classList.remove('hidden');

    setTimeout(() => {
      default_icon.classList.remove('hidden');
      default_tooltip.classList.remove('hidden');
      success_icon.classList.add('hidden');
      succes_tooltip.classList.add('hidden');
    }, 5000);
  }
}
