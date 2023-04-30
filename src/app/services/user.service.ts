import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address } from '../models/Address.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userSource = new Subject<boolean>();
  user$ = this._userSource.asObservable();

  authHeader: any;

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post('/api/login', {"email": username, "password": password});
  }

  register(user: any): Observable<any> {
    return this.httpClient.post('/api/register', user);
  }

  loggedIn() {
    this._userSource.next(true);
  }

  getAuthHeader() {
    let authToken = sessionStorage.getItem('access');
      
      let headers_object = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + authToken
      })

      return {
        headers: headers_object
      }
  }

  getAddresses(): Observable<any> {
    if (!this.authHeader) {
      this.authHeader = this.getAuthHeader()
    }

    return this.httpClient.get('/api/address', this.authHeader);
  }
}
