import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private http : HttpClient
  ) { }

  reqGet(endpoint: string, params = {}) {
    return this.http.get(`${environment.api_url}`+endpoint, {params: params}).pipe();
  }

  reqPost(endpoint: string, body = {}) {
    return this.http.post(`${environment.api_url}`+endpoint, body).pipe();
  }

  reqPut(endpoint: string, id : string, params = {}) {
    return this.http.put(`${environment.api_url}`+endpoint+id, {}, { params: params }).pipe();
  }

  reqDelete(endpoint: string, id : string) {
    return this.http.delete(`${environment.api_url}`+endpoint+id).pipe();
  }
}
