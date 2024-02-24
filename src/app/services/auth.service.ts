import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { RequestsService } from './requests.service';
import { map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userSubject : BehaviorSubject<User>;
  public user : Observable<User>;

  constructor(
    private requestService : RequestsService
  ) { 
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user')),
    );
    this.user = this.userSubject.asObservable();
  }

  public get userData(): User {
    return this.userSubject.value;
  }

  login(logindata = {}) {
    return this.requestService.reqPost('login', logindata).pipe(
      map((res : ApiResponse) => {
        if(res && res.success) {
          this.storeUserData(res.result);
        }
        return res;
      }),
    );
  }

  storeUserData(data) {
    localStorage.setItem('user', JSON.stringify(data));
    this.userSubject.next(data);
  }
}
