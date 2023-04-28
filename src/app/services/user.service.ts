import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _userSource = new Subject<boolean>();

  user$ = this._userSource.asObservable();

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
}
