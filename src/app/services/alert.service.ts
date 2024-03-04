import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  async showAlert(status, title, message) {
    const alert = await Swal.fire({
      icon: status,
      title: title,
      text: message
    });
  }

  async showToast(status, title) {
    const Toast = await Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    return await Toast.fire({
      icon: status,
      title: title
    });
  }
}
