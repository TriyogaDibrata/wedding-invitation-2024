import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from '@interfaces/api-response';
import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { LoaderService } from '@services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public loginForm : FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  showPassword : boolean = false;
  hasError : boolean = false;
  errorMessage : string;

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private alertService : AlertService,
    private router : Router,
    public loader : LoaderService,
  ) {
   this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
   })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  checkboxChanged(ev) {
    this.showPassword = ev.target.checked;
  }

  onLogin() {
    this.authService.login(this.loginForm.value).subscribe({
      next: async (res : ApiResponse) => {
        if(res && res.success) {
          await this,this.router.navigateByUrl('/admin');
          await this.alertService.showToast('success', 'You are logged in');
        }
      },
      error : (err) => {
        //error here
      }
    })
  }

}
